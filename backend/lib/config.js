/**
 * Configuration management with validation
 * Centralizes all environment variable access and provides defaults
 */

const requiredEnvVars = {
  production: [
    'DATABASE_URL',
    'JWT_SECRET',
    'ADMIN_STATS_TOKEN'
  ],
  development: [
    'DATABASE_URL'
  ]
};

const optionalEnvVars = {
  // Server
  PORT: '9090',
  NODE_ENV: 'development',
  APP_URL: 'http://localhost:9090',
  
  // Database
  DB_POOL_MAX: '10',
  DB_POOL_MIN: '2',
  DB_CONNECTION_TIMEOUT: '10000',
  DB_IDLE_TIMEOUT: '30000',
  DB_SSL: 'false',
  
  // Authentication
  JWT_EXPIRES_IN: '30d',
  BCRYPT_ROUNDS: '12',
  
  // CORS
  CORS_ORIGIN: '*',
  
  // LLM Providers
  MANAGED_PROVIDER: 'groq',
  DEFAULT_MODEL: 'llama-3.1-8b-instant',
  GROQ_API_KEY: '',
  GEMINI_API_KEY: '',
  OPENAI_API_KEY: '',
  
  // Usage Limits
  FREE_DAILY_LIMIT: '5',
  PAID_MONTHLY_LIMIT: '500',
  EXTENSION_DAILY_LIMIT: '5',
  
  // Stripe (optional - only needed if using subscriptions)
  STRIPE_SECRET_KEY: '',
  STRIPE_WEBHOOK_SECRET: '',
  STRIPE_PRICE_MONTHLY_ID: '',
  STRIPE_PRICE_YEARLY_ID: '',
  
  // Logging
  LOG_LEVEL: 'info',
  LOG_SQL_QUERIES: 'false'
};

class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigError';
  }
}

function getEnv(key, defaultValue = undefined) {
  const value = process.env[key];
  if (value !== undefined && value !== '') {
    return value;
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  return undefined;
}

function requireEnv(key) {
  const value = getEnv(key);
  if (value === undefined) {
    throw new ConfigError(`Required environment variable ${key} is not set`);
  }
  return value;
}

function validateConfig() {
  const env = getEnv('NODE_ENV', 'development');
  const required = env === 'production' ? requiredEnvVars.production : requiredEnvVars.development;
  
  const missing = [];
  for (const key of required) {
    if (!getEnv(key)) {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    throw new ConfigError(
      `Missing required environment variables for ${env} environment: ${missing.join(', ')}\n` +
      'Please check your .env file or environment configuration.'
    );
  }
  
  // Validate JWT_SECRET strength in production
  if (env === 'production') {
    const jwtSecret = getEnv('JWT_SECRET');
    if (jwtSecret && jwtSecret.length < 32) {
      console.warn('WARNING: JWT_SECRET should be at least 32 characters long for production');
    }
  }
  
  // Validate DATABASE_URL format
  const dbUrl = getEnv('DATABASE_URL');
  if (dbUrl && !dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    throw new ConfigError('DATABASE_URL must be a valid PostgreSQL connection string');
  }
  
  return true;
}

const config = {
  // Server
  port: parseInt(getEnv('PORT', optionalEnvVars.PORT), 10),
  nodeEnv: getEnv('NODE_ENV', optionalEnvVars.NODE_ENV),
  appUrl: getEnv('APP_URL', optionalEnvVars.APP_URL),
  
  // Database
  database: {
    url: requireEnv('DATABASE_URL'),
    poolMax: parseInt(getEnv('DB_POOL_MAX', optionalEnvVars.DB_POOL_MAX), 10),
    poolMin: parseInt(getEnv('DB_POOL_MIN', optionalEnvVars.DB_POOL_MIN), 10),
    connectionTimeout: parseInt(getEnv('DB_CONNECTION_TIMEOUT', optionalEnvVars.DB_CONNECTION_TIMEOUT), 10),
    idleTimeout: parseInt(getEnv('DB_IDLE_TIMEOUT', optionalEnvVars.DB_IDLE_TIMEOUT), 10),
    ssl: getEnv('DB_SSL', optionalEnvVars.DB_SSL) === 'true'
  },
  
  // Authentication
  auth: {
    jwtSecret: () => requireEnv('JWT_SECRET'),
    jwtExpiresIn: getEnv('JWT_EXPIRES_IN', optionalEnvVars.JWT_EXPIRES_IN),
    bcryptRounds: parseInt(getEnv('BCRYPT_ROUNDS', optionalEnvVars.BCRYPT_ROUNDS), 10),
    adminStatsToken: () => requireEnv('ADMIN_STATS_TOKEN')
  },
  
  // CORS
  cors: {
    origin: getEnv('CORS_ORIGIN', optionalEnvVars.CORS_ORIGIN)
  },
  
  // LLM
  llm: {
    provider: getEnv('MANAGED_PROVIDER', optionalEnvVars.MANAGED_PROVIDER),
    defaultModel: getEnv('DEFAULT_MODEL', optionalEnvVars.DEFAULT_MODEL),
    groqApiKey: getEnv('GROQ_API_KEY', optionalEnvVars.GROQ_API_KEY),
    geminiApiKey: getEnv('GEMINI_API_KEY', optionalEnvVars.GEMINI_API_KEY),
    openaiApiKey: getEnv('OPENAI_API_KEY', optionalEnvVars.OPENAI_API_KEY)
  },
  
  // Usage Limits
  limits: {
    freeDaily: parseInt(getEnv('FREE_DAILY_LIMIT', optionalEnvVars.FREE_DAILY_LIMIT), 10),
    paidMonthly: parseInt(getEnv('PAID_MONTHLY_LIMIT', optionalEnvVars.PAID_MONTHLY_LIMIT), 10),
    extensionDaily: parseInt(getEnv('EXTENSION_DAILY_LIMIT', optionalEnvVars.EXTENSION_DAILY_LIMIT), 10)
  },
  
  // Stripe
  stripe: {
    secretKey: getEnv('STRIPE_SECRET_KEY', optionalEnvVars.STRIPE_SECRET_KEY),
    webhookSecret: getEnv('STRIPE_WEBHOOK_SECRET', optionalEnvVars.STRIPE_WEBHOOK_SECRET),
    priceMonthlyId: getEnv('STRIPE_PRICE_MONTHLY_ID', optionalEnvVars.STRIPE_PRICE_MONTHLY_ID),
    priceYearlyId: getEnv('STRIPE_PRICE_YEARLY_ID', optionalEnvVars.STRIPE_PRICE_YEARLY_ID)
  },
  
  // Logging
  logging: {
    level: getEnv('LOG_LEVEL', optionalEnvVars.LOG_LEVEL),
    sqlQueries: getEnv('LOG_SQL_QUERIES', optionalEnvVars.LOG_SQL_QUERIES) === 'true'
  },
  
  // Helper methods
  isProduction: () => config.nodeEnv === 'production',
  isDevelopment: () => config.nodeEnv === 'development',
  isTest: () => config.nodeEnv === 'test'
};

// Validate configuration on load
try {
  validateConfig();
} catch (error) {
  console.error('Configuration Error:', error.message);
  if (config.nodeEnv === 'production') {
    process.exit(1);
  }
}

module.exports = config;
