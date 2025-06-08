export const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'ExceliDraw API',
            description: 'ExceliDraw API Information',
            contact: {
                name: 'Akshat Sipany',
            },
        },
        servers: [
            {
                url: "http://localhost:3002"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token'
                }
            }
        }
    },
    apis: ['./src/routes/*.ts']
}