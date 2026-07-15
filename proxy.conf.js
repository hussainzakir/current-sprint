const PROXY_CONFIG = [
    {
        context: [
            '/microservices-config',
            '/api-trinet-auth',
            "/api-profile",
            "/api-employee",
            "/api-company",
            "/api-bss",
            "/api-benefits"
        ],
        target: 'https://trinetqec.hrpassport.com',
        changeOrigin: true,
        logLevel: 'debug',
        secure: false
    }
];

module.exports = PROXY_CONFIG;
