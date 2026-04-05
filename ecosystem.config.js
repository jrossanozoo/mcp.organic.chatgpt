module.exports = {
  apps: [{
    name: 'mcp-organic-server',
    script: './dist/server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      KNOWLEDGE_BASE_PATH: './src/knowledge',
      DEFAULT_BUSINESS_LINE: 'organic',
      LOG_LEVEL: 'info'
    },
    env_development: {
      NODE_ENV: 'development',
      LOG_LEVEL: 'debug'
    },
    log_file: './logs/mcp-server.log',
    error_file: './logs/mcp-error.log',
    out_file: './logs/mcp-out.log',
    pid_file: './logs/mcp.pid',
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    max_memory_restart: '500M',
    restart_delay: 4000
  }]
};
