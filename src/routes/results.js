const { generateReport } = require('../service/reportBuilder');
const { ObjectId } = require('../db/db');

async function resultsRoute(fastify, options) {
    fastify.get('/api/v1/results/:id', async (request, reply) => {
        const { id } = request.params;
        const { lang, v } = request.query;

        if (!ObjectId.isValid(id)) {
            return reply.code(404).send({ error: 'Invalid ID format' });
        }

        if (!lang || !v) {
            return reply.code(400).send({ error: 'Missing required query parameters: lang and v' });
        }

        try {
            const report = await generateReport(id, lang, v);
            return reply.code(200).send(report);

        } catch (error) {
            const message = error.message;

            if (message.startsWith('404')) {
                return reply.code(404).send({ error: 'Result ID not found in assessment_results' });
            } 
            
            if (message.startsWith('500') || message.includes('Interpretation not found')) {
                return reply.code(500).send({ error: message.replace('500 ', '') });
            }

            return reply.code(500).send({ error: 'Internal Server Error: ' + message });
        }
    });
}

module.exports = resultsRoute;