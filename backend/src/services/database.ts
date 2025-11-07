import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { User, ApiKey, UsageLog } from '../models';

export class DatabaseConnection {
  private client: MongoClient;
  private db: Db;

  constructor(client: MongoClient, db: Db) {
    this.client = client;
    this.db = db;
  }

  static async create(): Promise<DatabaseConnection> {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const client = new MongoClient(mongoUri);
    
    await client.connect();
    const db = client.db('web_scraper');
    
    console.log('✅ Connected to MongoDB');
    return new DatabaseConnection(client, db);
  }

  usersCollection(): Collection<User> {
    return this.db.collection<User>('users');
  }

  apiKeysCollection(): Collection<ApiKey> {
    return this.db.collection<ApiKey>('api_keys');
  }

  usageLogsCollection(): Collection<UsageLog> {
    return this.db.collection<UsageLog>('usage_logs');
  }

  async saveUsageLog(usageLog: UsageLog): Promise<void> {
    await this.usageLogsCollection().insertOne(usageLog);
  }

  async getUsageLogsForUser(userId: ObjectId, limit: number): Promise<UsageLog[]> {
    return await this.usageLogsCollection()
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
  }

  async countActiveApiKeys(userId: ObjectId): Promise<number> {
    return await this.apiKeysCollection().countDocuments({ 
      userId, 
      isActive: true 
    });
  }

  async getUsageStatsForPeriod(
    userId: ObjectId, 
    days: number
  ): Promise<{
    totalRequests: number;
    successfulRequests: number;
    avgResponseTime: number;
    successRate: number;
  }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const logs = await this.usageLogsCollection()
      .find({
        userId,
        timestamp: { $gte: cutoffDate }
      })
      .toArray();

    const totalRequests = logs.length;
    const successfulRequests = logs.filter(log => log.success).length;
    const totalResponseTime = logs.reduce((sum, log) => sum + log.responseTimeMs, 0);
    const avgResponseTime = totalRequests > 0 ? totalResponseTime / totalRequests : 0;
    const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100;

    return {
      totalRequests,
      successfulRequests,
      avgResponseTime,
      successRate
    };
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}
