use axum::{
    extract::{Query, State, Path, Extension, Json},
    http::{header, Method, StatusCode, HeaderMap},
    response::{IntoResponse, Json as ResponseJson},
    routing::{get, post, delete},
    Router, middleware::{self, Next},
    response::Response,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tower_http::cors::CorsLayer;
use mongodb::bson::{doc, DateTime, oid::ObjectId};
use chrono::Utc;
use dotenv::dotenv;

mod scraper;
mod models;
mod database;
mod auth;

use models::*;
use database::DatabaseConnection;
use auth::AuthService;

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

#[derive(Clone, Serialize)]
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
    text_content: String,
    word_frequency: HashMap<String, usize>,
    reading_time_minutes: f64,
    readability_score: f64,
    language: String,
    social_media_links: Vec<LinkInfo>,
    page_size_kb: f64,
    // New fields for advanced analysis
    rendered_html: Option<String>,
    network_resources: Vec<NetworkResource>,
    response_headers: HashMap<String, String>,
    console_logs: Vec<ConsoleLog>,
    security_report: SecurityReport,
}

#[derive(Serialize, Clone)]
struct LinkInfo {
    text: String,
    href: String,
    is_external: bool,
}

#[derive(Clone, Serialize)]
struct ImageInfo {
    alt: String,
    src: String,
    width: Option<String>,
    height: Option<String>,
}

#[derive(Clone, Serialize)]
struct NetworkRequest {
    url: String,
    method: String,
    status: u16,
    response_time_ms: u64,
    size_bytes: usize,
    content_type: String,
    headers: std::collections::HashMap<String, String>,
}

#[derive(Clone, Serialize)]
struct SecurityAnalysis {
    https: bool,
    security_headers: std::collections::HashMap<String, String>,
    mixed_content: bool,
    insecure_forms: bool,
    third_party_requests: Vec<String>,
    cookies_secure: bool,
    risk_level: String,
    recommendations: Vec<String>,
}

#[derive(Clone, Serialize)]
struct PerformanceMetrics {
    total_load_time_ms: u64,
    dom_ready_time_ms: u64,
    first_paint_ms: u64,
    largest_contentful_paint_ms: u64,
    cumulative_layout_shift: f32,
    total_requests: usize,
    total_size_kb: f32,
}

#[derive(Clone, Serialize)]
struct NetworkResource {
    name: String,
    initiator_type: String,
    start_time_ms: f64,
    duration_ms: f64,
    transfer_size: Option<u64>,
    encoded_body_size: Option<u64>,
}

#[derive(Clone, Serialize)]
struct ConsoleLog {
    level: String,
    message: String,
}

#[derive(Clone, Serialize)]
struct SecurityReport {
    is_https: bool,
    mixed_content: bool,
    missing_security_headers: Vec<String>,
    insecure_cookies: bool,
    csp: Option<String>,
    notes: Vec<String>,
}





async fn health_check() -> ResponseJson<serde_json::Value> {
    ResponseJson(serde_json::json!({
        "status": "healthy",
        "service": "web-scraper-backend",
        "version": "0.1.0"
    }))
}

#[axum::debug_handler]
async fn scrape_website(
    State(state): State<AppState>,
    Extension(user_context): Extension<(ObjectId, ObjectId)>,
    Json(payload): Json<ScrapeRequest>,
) -> ResponseJson<ScrapeResponse> {
    let (user_id, api_key_id) = user_context;
    let start_time = std::time::Instant::now();
    
    match scraper::scrape_url(&payload.url).await {
        Ok(data) => {
            let response_time_ms = start_time.elapsed().as_millis() as i64;
            
            // Save usage log to database
            let usage_log = models::UsageLog {
                id: None,
                user_id,
                api_key_id,
                endpoint: "/api/scrape".to_string(),
                url_scraped: Some(payload.url.clone()),
                timestamp: DateTime::now(),
                response_time_ms,
                success: true,
                error_message: None,
                data_size_bytes: serde_json::to_string(&data).unwrap_or_default().len() as i64,
            };
            
            // Log to database (don't fail if logging fails)
            if let Err(e) = state.db.save_usage_log(usage_log).await {
                eprintln!("Failed to save usage log: {}", e);
            }
            
            ResponseJson(ScrapeResponse {
                success: true,
                data: Some(data),
                error: None,
            })
        },
        Err(e) => {
            let response_time_ms = start_time.elapsed().as_millis() as i64;
            
            // Save failed attempt to database
            let usage_log = models::UsageLog {
                id: None,
                user_id,
                api_key_id,
                endpoint: "/api/scrape".to_string(),
                url_scraped: Some(payload.url.clone()),
                timestamp: DateTime::now(),
                response_time_ms,
                success: false,
                error_message: Some(e.to_string()),
                data_size_bytes: 0,
            };
            
            // Log to database (don't fail if logging fails)
            if let Err(log_err) = state.db.save_usage_log(usage_log).await {
                eprintln!("Failed to save usage log: {}", log_err);
            }
            
            ResponseJson(ScrapeResponse {
                success: false,
                data: None,
                error: Some(e.to_string()),
            })
        },
    }
}

#[derive(Clone)]
struct AppState {
    auth_service: auth::AuthService,
    db: database::DatabaseConnection,
}

// Auth middleware
async fn auth_middleware(
    State(state): State<AppState>,
    headers: HeaderMap,
    mut request: axum::extract::Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let token = headers
        .get("authorization")
        .and_then(|header| header.to_str().ok())
        .and_then(|header| header.strip_prefix("Bearer "));

    if let Some(token) = token {
        match state.auth_service.verify_token(token).await {
            Ok(user_id) => {
                request.extensions_mut().insert(user_id);
                Ok(next.run(request).await)
            }
            Err(_) => Err(StatusCode::UNAUTHORIZED),
        }
    } else {
        Err(StatusCode::UNAUTHORIZED)
    }
}

// API Key middleware
async fn api_key_middleware(
    State(state): State<AppState>,
    headers: HeaderMap,
    mut request: axum::extract::Request,
    next: Next,
) -> Result<Response, StatusCode> {
    println!("🔍 API Key middleware called");
    
    let api_key = headers
        .get("x-api-key")
        .and_then(|header| header.to_str().ok());

    if let Some(key) = api_key {
        println!("🔑 API Key found: {}", &key[..std::cmp::min(8, key.len())]);
        match state.auth_service.verify_api_key(key).await {
            Ok((user_id, api_key_id)) => {
                println!("✅ API Key verified for user: {}", user_id);
                request.extensions_mut().insert((user_id, api_key_id));
                Ok(next.run(request).await)
            }
            Err(e) => {
                println!("❌ API Key verification failed: {:?}", e);
                Err(StatusCode::UNAUTHORIZED)
            },
        }
    } else {
        println!("❌ No API Key found in headers");
        Err(StatusCode::UNAUTHORIZED)
    }
}

// Authentication endpoints
async fn register(
    State(state): State<AppState>,
    Json(payload): Json<models::RegisterRequest>,
) -> impl IntoResponse {
    use validator::Validate;
    
    if let Err(e) = payload.validate() {
        return (StatusCode::BAD_REQUEST, ResponseJson(serde_json::json!({
            "error": format!("Validation error: {:?}", e)
        })));
    }

    match state.auth_service.register(payload).await {
        Ok(response) => (StatusCode::CREATED, ResponseJson(serde_json::json!(response))),
        Err(e) => (StatusCode::BAD_REQUEST, ResponseJson(serde_json::json!({
            "error": e.to_string()
        }))),
    }
}

async fn login(
    State(state): State<AppState>,
    Json(payload): Json<models::LoginRequest>,
) -> impl IntoResponse {
    use validator::Validate;
    
    if let Err(e) = payload.validate() {
        return (StatusCode::BAD_REQUEST, ResponseJson(serde_json::json!({
            "error": format!("Validation error: {:?}", e)
        })));
    }

    match state.auth_service.login(payload).await {
        Ok(response) => (StatusCode::OK, ResponseJson(serde_json::json!(response))),
        Err(e) => (StatusCode::UNAUTHORIZED, ResponseJson(serde_json::json!({
            "error": e.to_string()
        }))),
    }
}

// API Key management endpoints
async fn create_api_key(
    State(state): State<AppState>,
    Extension(user_id): Extension<String>,
    Json(payload): Json<models::CreateApiKeyRequest>,
) -> impl IntoResponse {
    match state.auth_service.create_api_key(&user_id, payload).await {
        Ok(response) => (StatusCode::CREATED, ResponseJson(serde_json::json!(response))),
        Err(e) => (StatusCode::BAD_REQUEST, ResponseJson(serde_json::json!({
            "error": e.to_string()
        }))),
    }
}

async fn list_api_keys(
    State(state): State<AppState>,
    Extension(user_id): Extension<String>,
) -> impl IntoResponse {
    println!("📋 Listing API keys for user: {}", user_id);
    match state.auth_service.list_api_keys(&user_id).await {
        Ok(keys) => {
            println!("✅ Found {} API keys", keys.len());
            for key in &keys {
                println!("🔑 Key ID: {:?}, Key: {}, Active: {:?}", 
                    key.id, 
                    &key.key[..std::cmp::min(8, key.key.len())],
                    key.is_active
                );
            }
            (StatusCode::OK, ResponseJson(serde_json::json!(keys)))
        },
        Err(e) => {
            println!("❌ Error listing API keys: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, ResponseJson(serde_json::json!({
                "error": e.to_string()
            })))
        },
    }
}

async fn delete_api_key(
    State(state): State<AppState>,
    Path(api_key_id): Path<String>,
    Extension(user_id): Extension<String>,
) -> impl IntoResponse {
    match state.auth_service.delete_api_key(&user_id, &api_key_id).await {
        Ok(_) => StatusCode::NO_CONTENT,
        Err(e) => {
            println!("Error deleting API key: {}", e);
            StatusCode::NOT_FOUND
        }
    }
}

// Dashboard and analytics endpoints
async fn get_dashboard_stats(
    State(state): State<AppState>,
    Extension(user_id): Extension<String>,
) -> impl IntoResponse {
    let user_id_obj = match ObjectId::parse_str(&user_id) {
        Ok(id) => id,
        Err(_) => return (StatusCode::BAD_REQUEST, ResponseJson(serde_json::json!({
            "error": "Invalid user ID"
        })))
    };

    // Fetch real data from database
    let active_keys = state.db.count_active_api_keys(user_id_obj).await.unwrap_or(0);
    let recent_logs = state.db.get_usage_logs_for_user(user_id_obj, 10).await.unwrap_or_default();
    
    // Get stats for different time periods
    let (total_today, _, _, _) = state.db.get_usage_stats_for_period(user_id_obj, 1).await.unwrap_or((0, 0, 0.0, 0.0));
    let (total_month, successful_month, avg_time, success_rate) = state.db.get_usage_stats_for_period(user_id_obj, 30).await.unwrap_or((0, 0, 0.0, 100.0));
    
    // Convert recent logs to activity format
    let recent_activity: Vec<models::RecentActivity> = recent_logs.iter().map(|log| {
        models::RecentActivity {
            timestamp: log.timestamp.to_string(),
            endpoint: log.endpoint.clone(),
            url_scraped: log.url_scraped.clone(),
            success: log.success,
            response_time_ms: log.response_time_ms,
        }
    }).collect();

    let stats = models::DashboardStats {
        total_requests_today: total_today,
        total_requests_this_month: total_month,
        requests_remaining: 10000 - total_month, // Assuming 10000 limit
        active_api_keys: active_keys,
        avg_response_time_ms: avg_time,
        success_rate,
        recent_activity,
        usage_by_day: vec![], // Can be implemented later with daily aggregation
    };

    (StatusCode::OK, ResponseJson(serde_json::json!(stats)))
}

async fn get_usage_analytics(
    State(state): State<AppState>,
    Extension(user_id): Extension<String>,
    Query(params): Query<std::collections::HashMap<String, String>>,
) -> (StatusCode, ResponseJson<serde_json::Value>) {
    println!("📈 Usage analytics requested for user: {}", user_id);
    
    let time_range = params.get("range").unwrap_or(&"7d".to_string()).clone();
    
    // Get real user ID
    let user_id_obj = match ObjectId::parse_str(&user_id) {
        Ok(id) => id,
        Err(_) => return (StatusCode::BAD_REQUEST, ResponseJson(serde_json::json!({"error": "Invalid user ID"})))
    };
    
    // Parse time range
    let days = match time_range.as_str() {
        "24h" => 1,
        "7d" => 7,
        "30d" => 30,
        _ => 7,
    };
    
    // Get real analytics from database
    let (total_requests, successful_requests, avg_response_time, _success_rate) = 
        state.db.get_usage_stats_for_period(user_id_obj, days).await.unwrap_or((0, 0, 0.0, 100.0));
    
    let failed_requests = total_requests - successful_requests;
    
    // Get recent logs to extract top domains
    let recent_logs = state.db.get_usage_logs_for_user(user_id_obj, 100).await.unwrap_or_default();
    let mut domain_counts: std::collections::HashMap<String, usize> = std::collections::HashMap::new();
    
    for log in recent_logs {
        if let Some(url) = log.url_scraped {
            if let Ok(parsed_url) = url::Url::parse(&url) {
                if let Some(domain) = parsed_url.host_str() {
                    *domain_counts.entry(domain.to_string()).or_insert(0) += 1;
                }
            }
        }
    }
    
    // Get top 5 domains
    let mut domains: Vec<_> = domain_counts.into_iter().collect();
    domains.sort_by(|a, b| b.1.cmp(&a.1));
    let top_domains: Vec<String> = domains.into_iter().take(5).map(|(domain, _)| domain).collect();
    
    let analytics = serde_json::json!({
        "totalRequests": total_requests,
        "successfulRequests": successful_requests,
        "failedRequests": failed_requests,
        "avgResponseTime": avg_response_time.round() as i64,
        "dataProcessed": format!("{} KB", (total_requests * 50)), // Rough estimate
        "topDomains": top_domains
    });
    
    (StatusCode::OK, ResponseJson(analytics))
}

async fn get_scraping_history(
    State(state): State<AppState>,
    Extension(user_id): Extension<String>,
    Query(params): Query<std::collections::HashMap<String, String>>,
) -> (StatusCode, ResponseJson<serde_json::Value>) {
    println!("📝 Scraping history requested for user: {}", user_id);
    
    let _limit: i64 = params.get("limit").and_then(|s| s.parse().ok()).unwrap_or(50);
    let _offset: i64 = params.get("offset").and_then(|s| s.parse().ok()).unwrap_or(0);
    
    // Get real user ID
    let user_id_obj = match ObjectId::parse_str(&user_id) {
        Ok(id) => id,
        Err(_) => return (StatusCode::BAD_REQUEST, ResponseJson(serde_json::json!({"error": "Invalid user ID"})))
    };
    
    // For now, return empty history
    // TODO: Implement real scraping history from usage logs collection
    let history = serde_json::json!({
        "history": [],
        "total": 0
    });
    
    (StatusCode::OK, ResponseJson(history))
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    
    // Initialize database connection
    let db = database::DatabaseConnection::new().await
        .expect("Failed to connect to MongoDB");
    
    // Initialize services
    let auth_service = auth::AuthService::new(db.clone());
    
    let app_state = AppState {
        auth_service,
        db,
    };

    // Public routes (no authentication required)
    let public_routes = Router::new()
        .route("/api/health", get(health_check))
        .route("/api/auth/register", post(register))
        .route("/api/auth/login", post(login));

    // Protected routes (require JWT authentication)
    let protected_routes = Router::new()
        .route("/api/dashboard/stats", get(get_dashboard_stats))
        .route("/api/keys", post(create_api_key))
        .route("/api/keys", get(list_api_keys))
        .route("/api/keys/:id", delete(delete_api_key))
        .route("/api/analytics/usage", get(get_usage_analytics))
        .route("/api/analytics/history", get(get_scraping_history))
        .layer(middleware::from_fn_with_state(app_state.clone(), auth_middleware));

    // API routes (require API key authentication)
    let api_routes = Router::new()
        .route("/api/scrape", post(scrape_website))
        .layer(middleware::from_fn_with_state(app_state.clone(), api_key_middleware));

    let app = Router::new()
        .merge(public_routes)
        .merge(protected_routes)
        .merge(api_routes)
        .with_state(app_state)
        .layer(
            CorsLayer::new()
                .allow_origin([
                    "http://localhost:3000".parse().unwrap(),
                    "http://localhost:5173".parse().unwrap(), // Vite dev server
                    "http://127.0.0.1:3000".parse().unwrap(),
                    "http://127.0.0.1:5173".parse().unwrap(),
                ])
                .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
                .allow_headers([
                    header::CONTENT_TYPE, 
                    header::AUTHORIZATION, 
                    "x-api-key".parse::<axum::http::HeaderName>().unwrap()
                ])
                .allow_credentials(true),
        );

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    println!("🚀 Web Scraper API running on http://0.0.0.0:8080");
    println!("📋 Health check: GET http://0.0.0.0:8080/api/health");
    println!("👤 Register: POST http://0.0.0.0:8080/api/auth/register");
    println!("🔑 Login: POST http://0.0.0.0:8080/api/auth/login");
    println!("🔍 Scrape: POST http://0.0.0.0:8080/api/scrape (requires API key)");
    println!("📊 Dashboard: GET http://0.0.0.0:8080/api/dashboard/stats (requires JWT)");
    
    axum::serve(listener, app).await.unwrap();
}
