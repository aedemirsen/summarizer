const { Pool } = require("pg");
const config = require('./config');

let pool;

function log(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({ timestamp, level, component: 'db', message, ...meta }));
}

function getPool() {
  if (!pool) {
    const dbConfig = config.database;
    log('info', 'Creating database connection pool', { 
      url: dbConfig.url.replace(/:[^:@]+@/, ':***@'),
      poolMax: dbConfig.poolMax,
      poolMin: dbConfig.poolMin
    });
    
    pool = new Pool({
      connectionString: dbConfig.url,
      min: dbConfig.poolMin,
      max: dbConfig.poolMax,
      ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: dbConfig.connectionTimeout,
      idleTimeoutMillis: dbConfig.idleTimeout
    });
    
    pool.on('error', (err) => {
      log('error', 'Unexpected database pool error', { error: err.message, stack: err.stack });
    });
    
    pool.on('connect', () => {
      log('info', 'New database connection established');
    });
  }
  return pool;
}

async function query(text, params) {
  const startTime = Date.now();
  const queryPreview = text.substring(0, 100).replace(/\s+/g, ' ');
  log('debug', 'Executing query', { query: queryPreview, params: params?.length || 0 });
  
  try {
    const p = getPool();
    const res = await p.query(text, params);
    const duration = Date.now() - startTime;
    log('debug', 'Query completed', { duration, rows: res.rowCount });
    return res;
  } catch (err) {
    const duration = Date.now() - startTime;
    log('error', 'Query failed', { 
      query: queryPreview, 
      error: err.message, 
      code: err.code,
      duration 
    });
    throw err;
  }
}

module.exports = {
  query
};
