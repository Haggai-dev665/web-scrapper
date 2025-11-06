use serde::{Deserialize, Serialize};
use mongodb::bson::{oid::ObjectId, DateTime};
use validator::Validate;
use chrono::Utc;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub email: String,
    pub password_hash: String,
    pub first_name: String,
    pub last_name: String,
    pub created_at: DateTime,
    pub updated_at: DateTime,
    pub is_active: bool,
    pub subscription_tier: SubscriptionTier,
    pub monthly_requests: i64,
    pub monthly_limit: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum SubscriptionTier {
    Free,
    Pro,
    Enterprise,
}

impl Default for SubscriptionTier {
    fn default() -> Self {
        SubscriptionTier::Free
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ApiKey {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub user_id: ObjectId,
    pub key: String,
    pub name: String,
    pub description: Option<String>,
    pub created_at: DateTime,
    pub last_used_at: Option<DateTime>,
    pub is_active: bool,
    pub requests_count: i64,
    pub rate_limit_per_hour: i32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UsageLog {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub user_id: ObjectId,
    pub api_key_id: ObjectId,
    pub endpoint: String,
    pub url_scraped: Option<String>,
    pub timestamp: DateTime,
    pub response_time_ms: i64,
    pub success: bool,
    pub error_message: Option<String>,
    pub data_size_bytes: i64,
}

// Request/Response DTOs
#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct RegisterRequest {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 8))]
    pub password: String,
    #[validate(length(min = 1))]
    pub first_name: String,
    #[validate(length(min = 1))]
    pub last_name: String,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct LoginRequest {
    #[validate(email)]
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: UserProfile,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserProfile {
    pub id: String,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub subscription_tier: SubscriptionTier,
    pub monthly_requests: i64,
    pub monthly_limit: i64,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateApiKeyRequest {
    pub name: String,
    pub description: Option<String>,
    pub rate_limit_per_hour: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiKeyResponse {
    pub id: String,
    pub name: String,
    pub key: String,
    pub description: Option<String>,
    pub created_at: String,
    pub last_used_at: Option<String>,
    pub requests_count: i64,
    pub rate_limit_per_hour: i32,
    pub is_active: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DashboardStats {
    pub total_requests_today: i64,
    pub total_requests_this_month: i64,
    pub requests_remaining: i64,
    pub active_api_keys: i64,
    pub avg_response_time_ms: f64,
    pub success_rate: f64,
    pub recent_activity: Vec<RecentActivity>,
    pub usage_by_day: Vec<DailyUsage>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RecentActivity {
    pub timestamp: String,
    pub endpoint: String,
    pub url_scraped: Option<String>,
    pub success: bool,
    pub response_time_ms: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DailyUsage {
    pub date: String,
    pub requests: i64,
    pub success_count: i64,
    pub avg_response_time: f64,
}

impl User {
    pub fn new(email: String, password_hash: String, first_name: String, last_name: String) -> Self {
        let now = DateTime::from_chrono(Utc::now());
        Self {
            id: None,
            email,
            password_hash,
            first_name,
            last_name,
            created_at: now,
            updated_at: now,
            is_active: true,
            subscription_tier: SubscriptionTier::Free,
            monthly_requests: 0,
            monthly_limit: 1000, // Free tier limit
        }
    }

    pub fn to_profile(&self) -> UserProfile {
        UserProfile {
            id: self.id.as_ref().map(|id| id.to_hex()).unwrap_or_default(),
            email: self.email.clone(),
            first_name: self.first_name.clone(),
            last_name: self.last_name.clone(),
            subscription_tier: self.subscription_tier.clone(),
            monthly_requests: self.monthly_requests,
            monthly_limit: self.monthly_limit,
            created_at: self.created_at.try_to_rfc3339_string().unwrap_or_default(),
        }
    }
}

impl ApiKey {
    pub fn new(user_id: ObjectId, name: String, description: Option<String>, rate_limit_per_hour: i32) -> Self {
        let now = DateTime::from_chrono(Utc::now());
        Self {
            id: None,
            user_id,
            key: format!("sk-{}", uuid::Uuid::new_v4().to_string().replace("-", "")),
            name,
            description,
            created_at: now,
            last_used_at: None,
            is_active: true,
            requests_count: 0,
            rate_limit_per_hour,
        }
    }

    pub fn to_response(&self) -> ApiKeyResponse {
        ApiKeyResponse {
            id: self.id.as_ref().map(|id| id.to_hex()).unwrap_or_default(),
            name: self.name.clone(),
            key: self.key.clone(),
            description: self.description.clone(),
            created_at: self.created_at.try_to_rfc3339_string().unwrap_or_default(),
            last_used_at: self.last_used_at.as_ref().map(|dt| dt.try_to_rfc3339_string().unwrap_or_default()),
            requests_count: self.requests_count,
            rate_limit_per_hour: self.rate_limit_per_hour,
            is_active: self.is_active,
        }
    }
}