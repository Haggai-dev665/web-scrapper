use axum::{
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tower_http::cors::CorsLayer;

mod scraper;

#[derive(Deserialize)]
struct ScrapeRequest {
    url: String,
}

#[derive(Serialize)]
struct ScrapeResponse {
    success: bool,
    data: Option<ScrapedData>,
    error: Option<String>,
}

#[derive(Serialize)]
struct ScrapedData {
    url: String,
    title: String,
    description: String,
    headings: Vec<String>,
    links: Vec<LinkInfo>,
    images: Vec<ImageInfo>,
    meta_tags: HashMap<String, String>,
    screenshot: Option<String>, // Base64 encoded screenshot
    word_count: usize,
    response_time_ms: u64,
}

#[derive(Serialize)]
struct LinkInfo {
    text: String,
    href: String,
    is_external: bool,
}

#[derive(Serialize)]
struct ImageInfo {
    alt: String,
    src: String,
    width: Option<String>,
    height: Option<String>,
}

async fn health_check() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "healthy",
        "service": "web-scraper-backend",
        "version": "0.1.0"
    }))
}

async fn scrape_website(Json(payload): Json<ScrapeRequest>) -> Result<Json<ScrapeResponse>, StatusCode> {
    match scraper::scrape_url(&payload.url).await {
        Ok(data) => Ok(Json(ScrapeResponse {
            success: true,
            data: Some(data),
            error: None,
        })),
        Err(e) => Ok(Json(ScrapeResponse {
            success: false,
            data: None,
            error: Some(e.to_string()),
        })),
    }
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/api/health", get(health_check))
        .route("/api/scrape", post(scrape_website))
        .layer(
            CorsLayer::new()
                .allow_origin(tower_http::cors::Any)
                .allow_methods(tower_http::cors::Any)
                .allow_headers(tower_http::cors::Any),
        );

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    println!("🚀 Web scraper API running on http://0.0.0.0:8080");
    println!("📋 Health check: http://0.0.0.0:8080/api/health");
    println!("🔍 Scrape endpoint: POST http://0.0.0.0:8080/api/scrape");
    
    axum::serve(listener, app).await.unwrap();
}
