const cron = require('node-cron');
const { pool } = require('./config/db');

class TokenCleanupService {
  constructor() {
    this.isRunning = false;
    this.lastCleanup = null;
    this.stats = {
      totalRunsCompleted: 0,
      totalResetTokensDeleted: 0,
      totalRefreshTokensDeleted: 0,
      lastError: null
    };
  }

  async cleanupExpiredTokens() {
    if (this.isRunning) {
      console.log('Cleanup already running, skipping this execution');
      return;
    }

    this.isRunning = true;
    const client = await pool.connect();
    
    try {
      console.log(`[${new Date().toISOString()}] Starting token cleanup...`);
      
      const result = await client.query('SELECT * FROM cleanup_expired_tokens()');
      
      if (result.rows.length > 0) {
        const { reset_tokens_deleted, refresh_tokens_deleted, cleanup_timestamp } = result.rows[0];
        
        this.stats.totalRunsCompleted++;
        this.stats.totalResetTokensDeleted += reset_tokens_deleted;
        this.stats.totalRefreshTokensDeleted += refresh_tokens_deleted;
        this.lastCleanup = cleanup_timestamp;
        this.stats.lastError = null;
        
        console.log(`[${cleanup_timestamp}] Cleanup completed successfully:`);
        console.log(`  - Reset tokens deleted: ${reset_tokens_deleted}`);
        console.log(`  - Refresh tokens deleted: ${refresh_tokens_deleted}`);
        console.log(`  - Total runs completed: ${this.stats.totalRunsCompleted}`);
        
        if (reset_tokens_deleted > 0 || refresh_tokens_deleted > 0) {
          console.log('✓ Expired tokens cleaned up successfully');
        } else {
          console.log('✓ No expired tokens found');
        }
      }
    } catch (error) {
      this.stats.lastError = {
        message: error.message,
        timestamp: new Date().toISOString()
      };
      
      console.error(`[${new Date().toISOString()}] Error during token cleanup:`, error);
      
      try {
        await client.query(
          'INSERT INTO token_cleanup_log (reset_tokens_deleted, refresh_tokens_deleted, cleanup_timestamp, error_message) VALUES ($1, $2, $3, $4)',
          [0, 0, new Date(), error.message]
        );
      } catch (logError) {
        console.error('Failed to log error to database:', logError);
      }
    } finally {
      this.isRunning = false;
      client.release();
    }
  }

  getStatus() {
    return {
      service: 'Token Cleanup Service',
      status: this.isRunning ? 'running' : 'idle',
      lastCleanup: this.lastCleanup,
      stats: this.stats,
      uptime: process.uptime(),
      nextRun: this.getNextRunTime()
    };
  }

  getNextRunTime() {
    const now = new Date();
    const nextRun = new Date(now);
    nextRun.setHours(now.getHours() + 1, 0, 0, 0);
    return nextRun.toISOString();
  }

  start() {
    console.log('🚀 Token Cleanup Service starting...');
    
    cron.schedule('0 * * * *', () => {
      this.cleanupExpiredTokens();
    }, {
      scheduled: true,
      timezone: process.env.TZ || "UTC"
    });

    setTimeout(() => {
      console.log('Running initial cleanup on startup...');
      this.cleanupExpiredTokens();
    }, 30000);

    console.log('✅ Token cleanup service started successfully');
    console.log(`📅 Scheduled to run every hour at minute 0 (${process.env.TZ || "UTC"})`);
    console.log(`🔄 Next run: ${this.getNextRunTime()}`);
  }

  async stop() {
    console.log('🛑 Token cleanup service shutting down...');
    
    while (this.isRunning) {
      console.log('Waiting for current cleanup to finish...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('✅ Token cleanup service stopped gracefully');
  }
}

const cleanupService = new TokenCleanupService();

cleanupService.start();

process.on('SIGINT', async () => {
  console.log('\n📥 Received SIGINT signal');
  await cleanupService.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n📥 Received SIGTERM signal');
  await cleanupService.stop();
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = cleanupService;