// SECURITY ISSUE: Configuration file with hardcoded secrets
const config = {
    // Database credentials
    database: {
        host: 'localhost',
        port: 5432,
        username: 'admin',
        password: 'password123',
        ssl: false  // SECURITY ISSUE: SSL disabled
    },
    
    // API keys and secrets
    apiKeys: {
        stripe: 'sk_test_1234567890abcdef1234567890abcdef12345678',
        google: 'AIzaSyDaGmWKa4JsXZ-HjGw175aGdCXrqxF3456', 
        aws: {
            accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
            secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
        }
    },
    
    // JWT secret
    jwtSecret: 'supersecretjwttoken',
    
    // SECURITY ISSUE: Debug mode enabled in production
    debug: true,
    
    // SECURITY ISSUE: Weak encryption
    encryption: {
        algorithm: 'md5',  // Weak hash algorithm
        key: '123456'      // Weak key
    }
};

module.exports = config;