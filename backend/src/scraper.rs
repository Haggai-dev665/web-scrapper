use anyhow::{anyhow, Result};
use reqwest::Client;
use scraper::{Html, Selector};
use std::collections::HashMap;
use std::time::{Duration, Instant};
use url::Url;

use crate::{ScrapedData, LinkInfo, ImageInfo};

pub async fn scrape_url(url: &str) -> Result<ScrapedData> {
    let start_time = Instant::now();
    
    // Validate URL
    let parsed_url = Url::parse(url).map_err(|_| anyhow!("Invalid URL format"))?;
    
    // Create HTTP client with timeout
    let client = Client::builder()
        .timeout(Duration::from_secs(30))
        .user_agent("WebScraper/1.0")
        .build()?;

    // Fetch the webpage
    let response = client.get(url).send().await?;
    let status = response.status();
    
    if !status.is_success() {
        return Err(anyhow!("HTTP error: {}", status));
    }

    let html_content = response.text().await?;
    let document = Html::parse_document(&html_content);
    
    let response_time = start_time.elapsed().as_millis() as u64;

    // Extract title
    let title_selector = Selector::parse("title").unwrap();
    let title = document
        .select(&title_selector)
        .next()
        .map(|el| el.text().collect::<String>())
        .unwrap_or_else(|| "No title found".to_string());

    // Extract description from meta tag
    let description_selector = Selector::parse("meta[name='description']").unwrap();
    let description = document
        .select(&description_selector)
        .next()
        .and_then(|el| el.value().attr("content"))
        .unwrap_or("No description found")
        .to_string();

    // Extract headings (h1-h6)
    let mut headings = Vec::new();
    for i in 1..=6 {
        let heading_selector = Selector::parse(&format!("h{}", i)).unwrap();
        for element in document.select(&heading_selector) {
            let text = element.text().collect::<String>().trim().to_string();
            if !text.is_empty() {
                headings.push(format!("H{}: {}", i, text));
            }
        }
    }

    // Extract links
    let link_selector = Selector::parse("a[href]").unwrap();
    let mut links = Vec::new();
    for element in document.select(&link_selector) {
        if let Some(href) = element.value().attr("href") {
            let text = element.text().collect::<String>().trim().to_string();
            let is_external = is_external_link(href, &parsed_url);
            links.push(LinkInfo {
                text: if text.is_empty() { href.to_string() } else { text },
                href: href.to_string(),
                is_external,
            });
        }
    }

    // Extract images
    let img_selector = Selector::parse("img").unwrap();
    let mut images = Vec::new();
    for element in document.select(&img_selector) {
        if let Some(src) = element.value().attr("src") {
            images.push(ImageInfo {
                alt: element.value().attr("alt").unwrap_or("").to_string(),
                src: src.to_string(),
                width: element.value().attr("width").map(|s| s.to_string()),
                height: element.value().attr("height").map(|s| s.to_string()),
            });
        }
    }

    // Extract meta tags
    let meta_selector = Selector::parse("meta").unwrap();
    let mut meta_tags = HashMap::new();
    for element in document.select(&meta_selector) {
        if let Some(name) = element.value().attr("name") {
            if let Some(content) = element.value().attr("content") {
                meta_tags.insert(name.to_string(), content.to_string());
            }
        }
        if let Some(property) = element.value().attr("property") {
            if let Some(content) = element.value().attr("content") {
                meta_tags.insert(property.to_string(), content.to_string());
            }
        }
    }

    // Count words in text content
    let text_selector = Selector::parse("body").unwrap();
    let word_count = document
        .select(&text_selector)
        .next()
        .map(|el| {
            el.text()
                .collect::<String>()
                .split_whitespace()
                .count()
        })
        .unwrap_or(0);

    // For now, we'll skip screenshot generation as it requires additional complexity
    // In a production environment, you'd use tools like puppeteer or playwright
    let screenshot = None;

    Ok(ScrapedData {
        url: url.to_string(),
        title,
        description,
        headings,
        links,
        images,
        meta_tags,
        screenshot,
        word_count,
        response_time_ms: response_time,
    })
}

fn is_external_link(href: &str, base_url: &Url) -> bool {
    if href.starts_with("http://") || href.starts_with("https://") {
        if let Ok(link_url) = Url::parse(href) {
            return link_url.domain() != base_url.domain();
        }
    }
    false
}