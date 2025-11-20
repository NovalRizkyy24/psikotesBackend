require('dotenv').config(); 
const fastify = require('fastify')();
const resultsRoute = require('./src/routes/results');
const { connectDb } = require('./src/db/db'); 

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectDb(); 
        console.log("Connected successfully to MongoDB Atlas.");

        fastify.get('/', async (request, reply) => {
            return {
                message: "Selamat datang di API Laporan Psikotes.",
                instruksi: "Silakan uji coba endpoint API sesuai dengan format:",
                endpoint: "/api/v1/results/:id?lang=id&v=1.0.0",
                contoh_uji: "https://psikotes-backend.vercel.app/api/v1/results/68d2754ccd2e1d3a51c869a7?lang=id&v=1.0.0",
                
                github: "https://github.com/NovalRizkyy24/psikotesBackend.git"
            };
        });

        fastify.register(resultsRoute);

        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server is running at http://localhost:${PORT}`);
        console.log(`Database URI: ${process.env.MONGODB_URI}`);
    } catch (err) {
        console.error('Server failed to start or connect to DB:', err);
        process.exit(1);
    }
}

startServer();