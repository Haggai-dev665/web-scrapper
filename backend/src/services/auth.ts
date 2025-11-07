import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import {
  User,
  ApiKey,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  CreateApiKeyRequest,
  ApiKeyResponse,
  UserProfile,
  SubscriptionTier
} from '../models';
import { DatabaseConnection } from './database';

interface JWTPayload {
  sub: string;
  exp: number;
  iat: number;
}

export class AuthService {
  private db: DatabaseConnection;
  private jwtSecret: string;

  constructor(db: DatabaseConnection) {
    this.db = db;
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  }

  async register(request: RegisterRequest): Promise<AuthResponse> {
    // Validate input
    if (!validator.isEmail(request.email)) {
      throw new Error('Invalid email format');
    }
    if (request.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    if (!request.firstName || request.firstName.length < 1) {
      throw new Error('First name is required');
    }
    if (!request.lastName || request.lastName.length < 1) {
      throw new Error('Last name is required');
    }

    // Check if user already exists
    const existingUser = await this.db.usersCollection().findOne({ email: request.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(request.password, 10);

    // Create user
    const now = new Date();
    const user: User = {
      email: request.email,
      passwordHash,
      firstName: request.firstName,
      lastName: request.lastName,
      createdAt: now,
      updatedAt: now,
      isActive: true,
      subscriptionTier: SubscriptionTier.Free,
      monthlyRequests: 0,
      monthlyLimit: 1000
    };

    const result = await this.db.usersCollection().insertOne(user);
    const userId = result.insertedId;

    // Generate JWT token
    const token = this.generateToken(userId.toString());

    // Create user profile
    const userProfile: UserProfile = {
      id: userId.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      subscriptionTier: user.subscriptionTier,
      monthlyRequests: user.monthlyRequests,
      monthlyLimit: user.monthlyLimit,
      createdAt: user.createdAt.toISOString()
    };

    return {
      token,
      user: userProfile
    };
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    // Validate input
    if (!validator.isEmail(request.email)) {
      throw new Error('Invalid email format');
    }

    // Find user by email
    const user = await this.db.usersCollection().findOne({ email: request.email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(request.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Generate JWT token
    const token = this.generateToken(user._id!.toString());

    // Create user profile
    const userProfile: UserProfile = {
      id: user._id!.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      subscriptionTier: user.subscriptionTier,
      monthlyRequests: user.monthlyRequests,
      monthlyLimit: user.monthlyLimit,
      createdAt: user.createdAt.toISOString()
    };

    return {
      token,
      user: userProfile
    };
  }

  async verifyToken(token: string): Promise<string> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JWTPayload;
      
      // Check if user still exists and is active
      const userId = new ObjectId(decoded.sub);
      const user = await this.db.usersCollection().findOne({ _id: userId });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }
      
      return decoded.sub;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async createApiKey(userId: string, request: CreateApiKeyRequest): Promise<ApiKeyResponse> {
    console.log('🔑 Creating API key for user:', userId);
    
    const userObjectId = new ObjectId(userId);
    
    // Check if user exists
    const user = await this.db.usersCollection().findOne({ _id: userObjectId });
    if (!user) {
      throw new Error('User not found');
    }

    // Determine rate limit based on subscription tier
    let rateLimit: number;
    switch (user.subscriptionTier) {
      case SubscriptionTier.Free:
        rateLimit = Math.min(request.rateLimitPerHour || 100, 100);
        break;
      case SubscriptionTier.Pro:
        rateLimit = Math.min(request.rateLimitPerHour || 1000, 1000);
        break;
      case SubscriptionTier.Enterprise:
        rateLimit = request.rateLimitPerHour || 10000;
        break;
      default:
        rateLimit = 100;
    }

    // Create API key
    const now = new Date();
    const apiKey: ApiKey = {
      userId: userObjectId,
      key: `sk-${uuidv4().replace(/-/g, '')}`,
      name: request.name,
      description: request.description,
      createdAt: now,
      isActive: true,
      requestsCount: 0,
      rateLimitPerHour: rateLimit
    };

    console.log('🔑 Generated API key:', apiKey.key.substring(0, 8) + '...');

    const result = await this.db.apiKeysCollection().insertOne(apiKey);
    const apiKeyId = result.insertedId;

    return {
      id: apiKeyId.toString(),
      name: apiKey.name,
      key: apiKey.key,
      description: apiKey.description,
      createdAt: apiKey.createdAt.toISOString(),
      lastUsedAt: apiKey.lastUsedAt?.toISOString(),
      requestsCount: apiKey.requestsCount,
      rateLimitPerHour: apiKey.rateLimitPerHour,
      isActive: apiKey.isActive
    };
  }

  async listApiKeys(userId: string): Promise<ApiKeyResponse[]> {
    const userObjectId = new ObjectId(userId);
    
    const apiKeys = await this.db.apiKeysCollection()
      .find({ userId: userObjectId })
      .toArray();

    return apiKeys.map(key => ({
      id: key._id!.toString(),
      name: key.name,
      key: key.key,
      description: key.description,
      createdAt: key.createdAt.toISOString(),
      lastUsedAt: key.lastUsedAt?.toISOString(),
      requestsCount: key.requestsCount,
      rateLimitPerHour: key.rateLimitPerHour,
      isActive: key.isActive
    }));
  }

  async deleteApiKey(userId: string, apiKeyId: string): Promise<void> {
    const userObjectId = new ObjectId(userId);
    const apiKeyObjectId = new ObjectId(apiKeyId);

    const result = await this.db.apiKeysCollection().deleteOne({
      _id: apiKeyObjectId,
      userId: userObjectId
    });

    if (result.deletedCount === 0) {
      throw new Error('API key not found');
    }
  }

  async verifyApiKey(apiKey: string): Promise<{ userId: ObjectId; apiKeyId: ObjectId }> {
    console.log('🔍 Verifying API key:', apiKey.substring(0, 8) + '...');
    
    const keyDoc = await this.db.apiKeysCollection().findOne({
      key: apiKey,
      isActive: true
    });

    if (!keyDoc) {
      console.log('❌ No matching API key found in database');
      throw new Error('Invalid API key');
    }

    console.log('✅ API key found for user:', keyDoc.userId.toString());
    return {
      userId: keyDoc.userId,
      apiKeyId: keyDoc._id!
    };
  }

  private generateToken(userId: string): string {
    const payload: JWTPayload = {
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, this.jwtSecret);
  }
}
