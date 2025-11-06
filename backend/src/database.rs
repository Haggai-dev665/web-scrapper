use mongodb::{Client, Database, Collection};
use crate::models::{User, ApiKey, UsageLog};
use anyhow::Result;
use std::env;

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
}