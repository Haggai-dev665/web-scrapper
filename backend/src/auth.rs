use anyhow::{anyhow, Result};
use bcrypt::{hash, verify, DEFAULT_COST};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation, Algorithm};
use mongodb::bson::{doc, oid::ObjectId};
use serde::{Deserialize, Serialize};
use std::env;
use uuid::Uuid;

use crate::database::DatabaseConnection;
use crate::models::{User, ApiKey, RegisterRequest, LoginRequest, AuthResponse, CreateApiKeyRequest, ApiKeyResponse};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // user id
    pub exp: i64,    // expiration time
    pub iat: i64,    // issued at
}

#[derive(Clone)]
pub struct AuthService {
    db: DatabaseConnection,
    jwt_secret: String,
}

impl AuthService {
    pub fn new(db: DatabaseConnection) -> Self {
        let jwt_secret = env::var("JWT_SECRET")
            .unwrap_or_else(|_| "your-secret-key".to_string());
        
        Self { db, jwt_secret }
    }

    pub async fn register(&self, request: RegisterRequest) -> Result<AuthResponse> {
        // Check if user already exists
        let existing_user = self.db.users_collection()
            .find_one(doc! { "email": &request.email }, None)
            .await?;

        if existing_user.is_some() {
            return Err(anyhow!("User with this email already exists"));
        }

        // Hash password
        let password_hash = hash(&request.password, DEFAULT_COST)?;

        // Create user
        let user = User::new(
            request.email,
            password_hash,
            request.first_name,
            request.last_name,
        );

        let insert_result = self.db.users_collection()
            .insert_one(&user, None)
            .await?;

        let user_id = insert_result.inserted_id.as_object_id()
            .ok_or_else(|| anyhow!("Failed to get user ID"))?;

        // Generate JWT token
        let token = self.generate_token(&user_id.to_hex())?;

        // Get user with ID for response
        let mut created_user = user;
        created_user.id = Some(user_id);

        Ok(AuthResponse {
            token,
            user: created_user.to_profile(),
        })
    }

    pub async fn login(&self, request: LoginRequest) -> Result<AuthResponse> {
        // Find user by email
        let user = self.db.users_collection()
            .find_one(doc! { "email": &request.email }, None)
            .await?
            .ok_or_else(|| anyhow!("Invalid email or password"))?;

        // Verify password
        if !verify(&request.password, &user.password_hash)? {
            return Err(anyhow!("Invalid email or password"));
        }

        if !user.is_active {
            return Err(anyhow!("Account is deactivated"));
        }

        // Generate JWT token
        let user_id = user.id.as_ref()
            .ok_or_else(|| anyhow!("User ID not found"))?
            .to_hex();
        
        let token = self.generate_token(&user_id)?;

        Ok(AuthResponse {
            token,
            user: user.to_profile(),
        })
    }

    pub async fn verify_token(&self, token: &str) -> Result<String> {
        let decoding_key = DecodingKey::from_secret(self.jwt_secret.as_bytes());
        let validation = Validation::new(Algorithm::HS256);

        let token_data = decode::<Claims>(token, &decoding_key, &validation)
            .map_err(|_| anyhow!("Invalid token"))?;

        // Check if user still exists and is active
        let user_id = ObjectId::parse_str(&token_data.claims.sub)
            .map_err(|_| anyhow!("Invalid user ID in token"))?;

        let user = self.db.users_collection()
            .find_one(doc! { "_id": user_id }, None)
            .await?
            .ok_or_else(|| anyhow!("User not found"))?;

        if !user.is_active {
            return Err(anyhow!("Account is deactivated"));
        }

        Ok(token_data.claims.sub)
    }

    pub async fn create_api_key(&self, user_id: &str, request: CreateApiKeyRequest) -> Result<ApiKeyResponse> {
        println!("🔑 Creating API key for user: {}", user_id);
        
        let user_object_id = ObjectId::parse_str(user_id)
            .map_err(|_| anyhow!("Invalid user ID"))?;

        // Check if user exists
        let user = self.db.users_collection()
            .find_one(doc! { "_id": user_object_id }, None)
            .await?
            .ok_or_else(|| anyhow!("User not found"))?;

        // Create API key
        let rate_limit = match user.subscription_tier {
            crate::models::SubscriptionTier::Free => request.rate_limit_per_hour.unwrap_or(100).min(100),
            crate::models::SubscriptionTier::Pro => request.rate_limit_per_hour.unwrap_or(1000).min(1000),
            crate::models::SubscriptionTier::Enterprise => request.rate_limit_per_hour.unwrap_or(10000),
        };

        let api_key = ApiKey::new(
            user_object_id,
            request.name,
            request.description,
            rate_limit,
        );
        
        println!("🔑 Generated API key: {}", &api_key.key[..std::cmp::min(8, api_key.key.len())]);

        let insert_result = self.db.api_keys_collection()
            .insert_one(&api_key, None)
            .await?;

        let api_key_id = insert_result.inserted_id.as_object_id()
            .ok_or_else(|| anyhow!("Failed to get API key ID"))?;

        let mut created_key = api_key;
        created_key.id = Some(api_key_id);

        Ok(created_key.to_response())
    }

    pub async fn list_api_keys(&self, user_id: &str) -> Result<Vec<ApiKeyResponse>> {
        let user_object_id = ObjectId::parse_str(user_id)
            .map_err(|_| anyhow!("Invalid user ID"))?;

        let cursor = self.db.api_keys_collection()
            .find(doc! { "user_id": user_object_id }, None)
            .await?;

        let api_keys: Vec<ApiKey> = cursor.try_collect().await?;
        
        Ok(api_keys.into_iter().map(|key| key.to_response()).collect())
    }

    pub async fn delete_api_key(&self, user_id: &str, api_key_id: &str) -> Result<()> {
        let user_object_id = ObjectId::parse_str(user_id)
            .map_err(|_| anyhow!("Invalid user ID"))?;
        
        let api_key_object_id = ObjectId::parse_str(api_key_id)
            .map_err(|_| anyhow!("Invalid API key ID"))?;

        let result = self.db.api_keys_collection()
            .delete_one(doc! { 
                "_id": api_key_object_id,
                "user_id": user_object_id 
            }, None)
            .await?;

        if result.deleted_count == 0 {
            return Err(anyhow!("API key not found"));
        }

        Ok(())
    }

    pub async fn verify_api_key(&self, api_key: &str) -> Result<(ObjectId, ObjectId)> {
        println!("🔍 Verifying API key: {}", &api_key[..std::cmp::min(8, api_key.len())]);
        
        let key_doc = self.db.api_keys_collection()
            .find_one(doc! { 
                "key": api_key,
                "is_active": true 
            }, None)
            .await?
            .ok_or_else(|| {
                println!("❌ No matching API key found in database");
                anyhow!("Invalid API key")
            })?;

        println!("✅ API key found for user: {}", key_doc.user_id);
        Ok((key_doc.user_id, key_doc.id.unwrap()))
    }

    fn generate_token(&self, user_id: &str) -> Result<String> {
        let expiration = Utc::now() + Duration::days(30); // Token expires in 30 days

        let claims = Claims {
            sub: user_id.to_string(),
            exp: expiration.timestamp(),
            iat: Utc::now().timestamp(),
        };

        let encoding_key = EncodingKey::from_secret(self.jwt_secret.as_bytes());
        let token = encode(&Header::default(), &claims, &encoding_key)
            .map_err(|_| anyhow!("Failed to generate token"))?;

        Ok(token)
    }
}

// Add this trait import at the top of the file
use futures::TryStreamExt;