const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI; 
const client = new MongoClient(uri);

let dbInstance = null;

async function connectDb() {
    if (dbInstance) {
        return dbInstance;
    }
    await client.connect();
    // Menggunakan dbName dari URI untuk fleksibilitas
    const dbName = new URL(uri).pathname.substring(1); 
    dbInstance = client.db(dbName);
    return dbInstance;
}

async function getAssessmentResult(id) {
    const db = await connectDb();
    const collection = db.collection('assessment_results');
    const result = await collection.findOne({ _id: new ObjectId(id) });
    return result;
}

async function getInterpretation(psikotestCode, lang, version) {
    const db = await connectDb();
    const collection = db.collection('interpretations');
    const result = await collection.findOne({
        psikotestCode: psikotestCode,
        lang: lang,
        version: version
    });
    return result;
}

module.exports = {
    // 🔥 PERBAIKAN: Export connectDb agar bisa dipanggil dari server.js
    connectDb, 
    getAssessmentResult,
    getInterpretation,
    ObjectId
};