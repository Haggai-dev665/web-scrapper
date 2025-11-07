use mongodb::{Client, Database, Collection, bson::{doc, oid::ObjectId, DateTime}};
use crate::models::{User, ApiKey, UsageLog};
use anyhow::Result;
use std::env;
use chrono::{Utc, Duration};

#[derive(Clone)]
pub struct DatabaseConnection {
    pub db: Database,
}

impl DatabaseConnection {
    pub async fn new() -> Result<Self> {
        let mongodb_uri = env::var("MONGODB_URI")
            .unwrap_or_else(|_| "mongodb://localhost:27017".to_string());
        
        let client = Client::with_uri_str(&mongodb_uri).await?;
        let db = client.database("web_scraper");
        
        Ok(Self { db })
    }

    pub fn users_collection(&self) -> Collection<User> {
        self.db.collection("users")
    }

    pub fn api_keys_collection(&self) -> Collection<ApiKey> {
        self.db.collection("api_keys")
    }

    pub fn usage_logs_collection(&self) -> Collection<UsageLog> {
        self.db.collection("usage_logs")
    }

    pub async fn save_usage_log(&self, usage_log: UsageLog) -> Result<()> {
        self.usage_logs_collection().insert_one(usage_log, None).await?;
        Ok(())
    }

    pub async fn get_usage_logs_for_user(&self, user_id: ObjectId, limit: i64) -> Result<Vec<UsageLog>> {
        use mongodb::options::FindOptions;
        use futures_util::stream::StreamExt;

        let options = FindOptions::builder()
            .sort(doc! { "timestamp": -1 })
            .limit(limit)
            .build();

        let mut cursor = self.usage_logs_collection()
            .find(doc! { "user_id": user_id }, options)
            .await?;

        let mut logs = Vec::new();
        while let Some(result) = cursor.next().await {
            if let Ok(log) = result {
                logs.push(log);
            }
        }

        Ok(logs)
    }

    pub async fn count_active_api_keys(&self, user_id: ObjectId) -> Result<i64> {
        let count = self.api_keys_collection()
            .count_documents(doc! { "user_id": user_id, "is_active": true }, None)
            .await?;
        Ok(count as i64)
    }

    pub async fn get_usage_stats_for_period(&self, user_id: ObjectId, days: i64) -> Result<(i64, i64, f64, f64)> {
        use futures_util::stream::StreamExt;
        
        let cutoff_date = Utc::now() - Duration::days(days);
        let cutoff_bson = DateTime::from_millis(cutoff_date.timestamp_millis());

        let mut cursor = self.usage_logs_collection()
            .find(doc! { 
                "user_id": user_id,
                "timestamp": { "$gte": cutoff_bson }
            }, None)
            .await?;

        let mut total_requests = 0i64;
        let mut successful_requests = 0i64;
        let mut total_response_time = 0i64;
        let mut count_with_time = 0i64;

        while let Some(result) = cursor.next().await {
            if let Ok(log) = result {
                total_requests += 1;
                if log.success {
                    successful_requests += 1;
                }
                if log.response_time_ms > 0 {
                    total_response_time += log.response_time_ms;
                    count_with_time += 1;
                }
            }
        }

        let avg_response_time = if count_with_time > 0 {
            total_response_time as f64 / count_with_time as f64
        } else {
            0.0
        };

        let success_rate = if total_requests > 0 {
            (successful_requests as f64 / total_requests as f64) * 100.0
        } else {
            100.0
        };

        Ok((total_requests, successful_requests, avg_response_time, success_rate))
    }
}