require('dotenv').config(); 
const fastify = require('fastify')();
const resultsRoute = require('./src/routes/results');

const PORT = process.env.PORT || 3000;

fastify.register(resultsRoute);

async function startServer() {
    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server is running at http://localhost:${PORT}`);
        console.log(`Database URI: ${process.env.MONGODB_URI}`);
    } catch (err) {
        console.error('Server failed to start:', err);
        process.exit(1);
    }
}

startServer();