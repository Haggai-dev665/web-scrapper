use anyhow::{anyhow, Result};
use reqwest::Client;
use scraper::{Html, Selector};
use std::collections::HashMap;
use std::time::{Duration, Instant};
use url::Url;
use regex::Regex;
use base64::{engine::general_purpose, Engine as _};

use crate::{ImageInfo, LinkInfo, NetworkRequest, PerformanceMetrics, SecurityAnalysis, NetworkResource, ConsoleLog, SecurityReport, ScrapedData};

pub async fn scrape_url(url: &str) -> Result<ScrapedData> {
    let start_time = Instant::now();
    println!("🔍 Starting scrape for URL: {}", url);

    // Validate URL
    let parsed_url = Url::parse(url).map_err(|_| anyhow!("Invalid URL format"))?;

    // Create HTTP client with timeout
    let client = Client::builder()
        .timeout(Duration::from_secs(30))
        .user_agent("WebScraper/1.0")
        .build()?;

    // Fetch the webpage (initial request to grab headers and raw HTML quickly)
    let response = client.get(url).send().await?;
    let status = response.status();

    if !status.is_success() {
        return Err(anyhow!("HTTP error: {}", status));
    }

    let headers_map = response
        .headers()
        .iter()
        .map(|(k, v)| (k.to_string(), v.to_str().unwrap_or("").to_string()))
        .collect::<HashMap<String, String>>();

    let html_content = response.text().await?;
    println!("✅ HTML fetched, parsing content...");
    let (title, description, headings, links, images, meta_tags, text_content) = {
        let document = Html::parse_document(&html_content);

        // Basic extraction (title, description, headings, links, images, meta)
        let title_selector = Selector::parse("title").unwrap();
        let title = document
            .select(&title_selector)
            .next()
            .map(|el| el.text().collect::<String>())
            .unwrap_or_else(|| "No title found".to_string());

        let description_selector = Selector::parse("meta[name='description']").unwrap();
        let description = document
            .select(&description_selector)
            .next()
            .and_then(|el| el.value().attr("content"))
            .unwrap_or("No description found")
            .to_string();

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

        // Extract text content and analyze
        let text_selector = Selector::parse("body").unwrap();
        let text_content = document
            .select(&text_selector)
            .next()
            .map(|el| {
                let text = el.text().collect::<Vec<_>>().join(" ");
                // Clean up whitespace
                let re = Regex::new(r"\s+").unwrap();
                re.replace_all(&text, " ").trim().to_string()
            })
            .unwrap_or_default();
        
        (title, description, headings, links, images, meta_tags, text_content)
    };

    let response_time = start_time.elapsed().as_millis() as u64;

    let word_count = text_content.split_whitespace().count();
    let reading_time_minutes = word_count as f64 / 200.0;
    let word_frequency = calculate_word_frequency(&text_content);
    let readability_score = calculate_readability_score(&text_content);
    let language = detect_language(&text_content);
    let social_media_links = links
        .iter()
        .filter(|link| is_social_media_link(&link.href))
        .cloned()
        .collect();
    let page_size_kb = html_content.len() as f64 / 1024.0;

    // Drop the non-Send document before awaiting further async operations
    // drop(document);

    // Collect cookies from response Set-Cookie headers
    let mut cookie_issues = Vec::new();
    if let Some(set_cookie_value) = headers_map.get("set-cookie") {
        if let Ok(parsed) = Cookie::parse(set_cookie_value.to_string()) {
            let mut issues = Vec::new();
            // Check cookie security attributes
            if !set_cookie_value.to_lowercase().contains("httponly") {
                issues.push("Missing HttpOnly".to_string());
            }
            if !set_cookie_value.to_lowercase().contains("secure") {
                issues.push("Missing Secure".to_string());
            }
            if !issues.is_empty() {
                cookie_issues.push(format!("{}: {}", parsed.name(), issues.join(", ")));
            }
        }
    }

    // Simple HTML analysis without browser automation (faster and more reliable for production)
    println!("🌐 Analyzing HTML content...");
    
    // Use the already fetched HTML content for analysis
    let rendered_html_opt = Some(html_content.clone());
    let screenshot_opt: Option<String> = None; // Skip screenshots for now
    
    // Generate mock network resources based on HTML analysis
    let network_resources = analyze_network_resources(&html_content, &parsed_url);
    
    // Generate mock console logs (empty for static analysis)
    let console_logs: Vec<ConsoleLog> = Vec::new();

    // Security analysis
    let is_https = parsed_url.scheme() == "https";
    let mut missing_security_headers = Vec::new();
    let expected_headers = [
        "strict-transport-security",
        "content-security-policy",
        "x-frame-options",
        "x-content-type-options",
        "referrer-policy",
    ];
    for &h in &expected_headers {
        if !headers_map.keys().any(|k| k.to_lowercase() == h) {
            missing_security_headers.push(h.to_string());
        }
    }

    // Mixed content: if page is HTTPS but contains http:// resource URLs
    let mut mixed_content = false;
    if is_https {
        if let Some(ref rendered_html) = rendered_html_opt {
            if rendered_html.contains("http://") {
                mixed_content = true;
            }
        }
        for res in &network_resources {
            if res.name.starts_with("http://") {
                mixed_content = true;
            }
        }
    }

    // CSP header value
    let csp = headers_map
        .get("content-security-policy")
        .cloned()
        .or_else(|| headers_map.get("Content-Security-Policy").cloned());

    // Detect some common libraries / frameworks for notes
    let mut notes = Vec::new();
    if html_content.to_lowercase().contains("jquery") || rendered_html_opt.as_deref().map_or(false, |h| h.to_lowercase().contains("jquery")) {
        notes.push("Detected jquery references; consider checking version for known vulnerabilities".to_string());
    }

    if html_content.to_lowercase().contains("wordpress") || rendered_html_opt.as_deref().map_or(false, |h| h.to_lowercase().contains("wordpress")) {
        notes.push("WordPress site detected; consider known WP plugin vulnerabilities".to_string());
    }

    let security_report = SecurityReport {
        is_https,
        mixed_content,
        missing_security_headers,
        insecure_cookies: !cookie_issues.is_empty(),
        csp,
        notes,
    };

    Ok(scraped_data)
}

// Helper function to analyze network resources from HTML content
fn analyze_network_resources(html: &str, base_url: &reqwest::Url) -> Vec<NetworkResource> {
    let mut resources = Vec::new();
    let document = Html::parse_document(html);
    
    // Find CSS files
    let css_selector = Selector::parse("link[rel='stylesheet']").unwrap();
    for element in document.select(&css_selector) {
        if let Some(href) = element.value().attr("href") {
            if let Ok(url) = base_url.join(href) {
                resources.push(NetworkResource {
                    name: url.to_string(),
                    initiator_type: "css".to_string(),
                    start_time_ms: 0.0,
                    duration_ms: 100.0, // Mock duration
                    transfer_size: Some(1024), // Mock size
                    encoded_body_size: Some(1024),
                });
            }
        }
    }
    
    // Find JavaScript files
    let js_selector = Selector::parse("script[src]").unwrap();
    for element in document.select(&js_selector) {
        if let Some(src) = element.value().attr("src") {
            if let Ok(url) = base_url.join(src) {
                resources.push(NetworkResource {
                    name: url.to_string(),
                    initiator_type: "script".to_string(),
                    start_time_ms: 0.0,
                    duration_ms: 150.0, // Mock duration
                    transfer_size: Some(2048), // Mock size
                    encoded_body_size: Some(2048),
                });
            }
        }
    }
    
    // Find images
    let img_selector = Selector::parse("img[src]").unwrap();
    for element in document.select(&img_selector) {
        if let Some(src) = element.value().attr("src") {
            if let Ok(url) = base_url.join(src) {
                resources.push(NetworkResource {
                    name: url.to_string(),
                    initiator_type: "img".to_string(),
                    start_time_ms: 0.0,
                    duration_ms: 200.0, // Mock duration
                    transfer_size: Some(5120), // Mock size
                    encoded_body_size: Some(5120),
                });
            }
        }
    }
    
    resources
}
        url: url.to_string(),
        title,
        description,
        headings,
        links,
        images,
        meta_tags,
        screenshot: screenshot_opt,
        word_count,
        response_time_ms: response_time,
        text_content,
        word_frequency,
        reading_time_minutes,
        readability_score,
        language,
        social_media_links,
        page_size_kb,
        rendered_html: rendered_html_opt,
        network_resources,
        response_headers: headers_map,
        console_logs,
        security_report,
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

fn calculate_word_frequency(text: &str) -> HashMap<String, usize> {
    let mut frequency = HashMap::new();

    // Common stop words to filter out
    let stop_words = vec![
        "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not",
        "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from",
        "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would",
    ];

    let stop_words_set: std::collections::HashSet<&str> = stop_words.into_iter().collect();
    let word_regex = Regex::new(r"\b[a-zA-Z]{3,}\b").unwrap();

    for word_match in word_regex.find_iter(text) {
        let word = word_match.as_str().to_lowercase();
        if !stop_words_set.contains(word.as_str()) {
            *frequency.entry(word).or_insert(0) += 1;
        }
    }

    frequency
}

fn calculate_readability_score(text: &str) -> f64 {
    if text.is_empty() {
        return 0.0;
    }

    let sentences = text.split('.').filter(|s| !s.trim().is_empty()).count() as f64;
    let words: Vec<&str> = text.split_whitespace().collect();
    let word_count = words.len() as f64;

    if sentences == 0.0 || word_count == 0.0 {
        return 0.0;
    }

    // Count syllables (simplified)
    let mut syllable_count = 0;
    for word in &words {
        syllable_count += count_syllables(word);
    }
    let syllable_count = syllable_count as f64;

    // Flesch Reading Ease formula
    let score = 206.835 - (1.015 * (word_count / sentences)) - (84.6 * (syllable_count / word_count));
    score.max(0.0).min(100.0)
}

fn count_syllables(word: &str) -> usize {
    let word = word.to_lowercase();
    let vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
    let mut count = 0;
    let mut prev_was_vowel = false;

    for c in word.chars() {
        let is_vowel = vowels.contains(&c);
        if is_vowel && !prev_was_vowel {
            count += 1;
        }
        prev_was_vowel = is_vowel;
    }

    if word.ends_with('e') && count > 1 {
        count -= 1;
    }

    count.max(1)
}

fn detect_language(text: &str) -> String {
    let english_words = ["the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "was"];
    let spanish_words = ["el", "la", "de", "que", "y", "en", "un", "es", "se", "no", "te"];
    let french_words = ["le", "de", "et", "à", "un", "il", "être", "et", "en", "avoir", "que"];

    let text_lower = text.to_lowercase();

    let english_count = english_words.iter().filter(|&&word| text_lower.contains(word)).count();
    let spanish_count = spanish_words.iter().filter(|&&word| text_lower.contains(word)).count();
    let french_count = french_words.iter().filter(|&&word| text_lower.contains(word)).count();

    if english_count >= spanish_count && english_count >= french_count {
        "English".to_string()
    } else if spanish_count >= french_count {
        "Spanish".to_string()
    } else if french_count > 0 {
        "French".to_string()
    } else {
        "Unknown".to_string()
    }
}

fn is_social_media_link(href: &str) -> bool {
    let social_domains = [
        "facebook.com", "twitter.com", "x.com", "instagram.com", "linkedin.com",
        "youtube.com", "tiktok.com", "pinterest.com", "snapchat.com", "reddit.com",
        "tumblr.com", "whatsapp.com", "telegram.org", "discord.com"
    ];

    social_domains.iter().any(|&domain| href.contains(domain))
}