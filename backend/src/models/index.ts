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
  // ADVANCED NETWORK FIELDS
  method?: string;
  status?: number;
  statusText?: string;
  mimeType?: string;
  requestHeaders?: any;
  responseHeaders?: any;
  postData?: string;
  cached?: boolean;
  serviceWorker?: boolean;
  remoteAddress?: string;
  protocol?: string;
  priority?: string;
}

export interface ConsoleLog {
  level: string;
  message: string;
  // ADVANCED CONSOLE FIELDS
  args?: any[];
  location?: string;
  stackTrace?: string;
  errorText?: string;
  method?: string;
  resourceType?: string;
}

export interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  description: string;
  recommendation: string;
}

export interface SecurityReport {
  isHttps: boolean;
  mixedContent: boolean;
  missingSecurityHeaders: string[];
  insecureCookies: boolean;
  csp?: string;
  notes: string[];
  issues?: SecurityIssue[];
  score?: number;
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
  networkRequests?: NetworkRequest[];
  performanceMetrics?: any;
  cookies?: any[];
  // NEW ADVANCED FIELDS - All properly defined
  forms?: any[];
  scripts?: any[];
  stylesheets?: any[];
  iframes?: any[];
  inputFields?: any[];
  buttons?: any[];
  technologies?: string[];
  structuredData?: any[];
  localStorage?: { [key: string]: string };
  sessionStorage?: { [key: string]: string };
  viewport?: any;
  detailedConsoleLogs?: DetailedConsoleLog[];
  pageElements?: PageElements;
  storageData?: StorageData;
  jsExecution?: JavaScriptExecution;
  crawledLinks?: CrawledLink[];
}

export interface NetworkRequest {
  url: string;
  method: string;
  status: number;
  status_text: string;
  content_type: string;
  size_bytes: number;
  response_time_ms: number;
  headers: { [key: string]: string };
  resource_type: string;
  from_cache: boolean;
  remote_address?: { ip: string; port: number };
}

export interface PerformanceMetrics {
  total_load_time_ms: number;
  dom_ready_time_ms: number;
  first_paint_ms: number;
  largest_contentful_paint_ms: number;
  cumulative_layout_shift: number;
  total_requests: number;
  total_size_kb: number;
  dns_lookup_ms?: number;
  tcp_connection_ms?: number;
  server_response_ms?: number;
  page_download_ms?: number;
}

export interface DetailedConsoleLog {
  level: string;
  message: string;
  timestamp: number;
  source?: string;
  line_number?: number;
  url?: string;
  stack_trace?: string;
}

export interface PageElements {
  forms: Array<{
    id?: string;
    name?: string;
    action?: string;
    method?: string;
    fields: Array<{ name: string; type: string; required: boolean }>;
  }>;
  scripts: Array<{
    src?: string;
    inline: boolean;
    async: boolean;
    defer: boolean;
    type?: string;
  }>;
  stylesheets: Array<{
    href?: string;
    inline: boolean;
    media?: string;
  }>;
  iframes: Array<{
    src?: string;
    sandbox?: string;
    allow?: string;
  }>;
  buttons: Array<{
    text: string;
    type?: string;
    id?: string;
  }>;
  inputs: Array<{
    type: string;
    name?: string;
    placeholder?: string;
    required: boolean;
  }>;
}

export interface CrawledLink {
  url: string;
  title: string;
  status: number;
  content_type?: string;
  size_kb?: number;
  load_time_ms?: number;
  error?: string;
}

export interface JavaScriptExecution {
  errors: string[];
  warnings: string[];
  global_variables: string[];
  event_listeners: number;
}

export interface StorageData {
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  cookies: Array<{
    name: string;
    value: string;
    domain: string;
    path: string;
    expires?: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite?: string;
  }>;
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
