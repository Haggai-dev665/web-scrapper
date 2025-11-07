import { ObjectId } from 'mongodb';

export enum SubscriptionTier {
  Free = 'Free',
  Pro = 'Pro',
  Enterprise = 'Enterprise'
}

export interface User {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  subscriptionTier: SubscriptionTier;
  monthlyRequests: number;
  monthlyLimit: number;
}

export interface ApiKey {
  _id?: ObjectId;
  userId: ObjectId;
  key: string;
  name: string;
  description?: string;
  createdAt: Date;
  lastUsedAt?: Date;
  isActive: boolean;
  requestsCount: number;
  rateLimitPerHour: number;
}

export interface UsageLog {
  _id?: ObjectId;
  userId: ObjectId;
  apiKeyId: ObjectId;
  endpoint: string;
  urlScraped?: string;
  timestamp: Date;
  responseTimeMs: number;
  success: boolean;
  errorMessage?: string;
  dataSizeBytes: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionTier: SubscriptionTier;
  monthlyRequests: number;
  monthlyLimit: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface CreateApiKeyRequest {
  name: string;
  description?: string;
  rateLimitPerHour?: number;
}

export interface ApiKeyResponse {
  id: string;
  name: string;
  key: string;
  description?: string;
  createdAt: string;
  lastUsedAt?: string;
  requestsCount: number;
  rateLimitPerHour: number;
  isActive: boolean;
}

export interface LinkInfo {
  text: string;
  href: string;
  isExternal: boolean;
}

export interface ImageInfo {
  alt: string;
  src: string;
  width?: string;
  height?: string;
}

export interface NetworkResource {
  name: string;
  initiatorType: string;
  startTimeMs: number;
  durationMs: number;
  transferSize?: number;
  encodedBodySize?: number;
}

export interface ConsoleLog {
  level: string;
  message: string;
}

export interface SecurityReport {
  isHttps: boolean;
  mixedContent: boolean;
  missingSecurityHeaders: string[];
  insecureCookies: boolean;
  csp?: string;
  notes: string[];
}

export interface ScrapedData {
  url: string;
  title: string;
  description: string;
  headings: string[];
  links: LinkInfo[];
  images: ImageInfo[];
  metaTags: { [key: string]: string };
  screenshot?: string;
  wordCount: number;
  responseTimeMs: number;
  textContent: string;
  wordFrequency: { [key: string]: number };
  readingTimeMinutes: number;
  readabilityScore: number;
  language: string;
  socialMediaLinks: LinkInfo[];
  pageSizeKb: number;
  renderedHtml?: string;
  networkResources: NetworkResource[];
  responseHeaders: { [key: string]: string };
  consoleLogs: ConsoleLog[];
  securityReport: SecurityReport;
}

export interface DashboardStats {
  totalRequestsToday: number;
  totalRequestsThisMonth: number;
  requestsRemaining: number;
  activeApiKeys: number;
  avgResponseTimeMs: number;
  successRate: number;
  recentActivity: RecentActivity[];
  usageByDay: DailyUsage[];
}

export interface RecentActivity {
  timestamp: string;
  endpoint: string;
  urlScraped?: string;
  success: boolean;
  responseTimeMs: number;
}

export interface DailyUsage {
  date: string;
  requests: number;
  successCount: number;
  avgResponseTime: number;
}
