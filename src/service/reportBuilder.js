const { getAssessmentResult, getInterpretation, ObjectId } = require('../db/db');
const { transformMinatBakat } = require('./transformers/minatBakat');
const { transformKepribadian } = require('./transformers/kepribadian');
const { transformIqTest } = require('./transformers/iqTest');
const { transformEnglishSkills } = require('./transformers/englishSkills');
const { transformPersonalValues } = require('./transformers/personalValues');
const { transformMotivationBoost } = require('./transformers/motivationBoost');
const { transformPetaPerilaku } = require('./transformers/petaPerilaku');
const { transformWorkingStyle } = require('./transformers/workingStyle');
const { transformLeadershipStyle } = require('./transformers/leadershipStyle');
const { transformLearningStyle } = require('./transformers/learningStyle');
const { transformEmotionalQuality } = require('./transformers/emotionalQuality'); 
const { transformCreativityPotential } = require('./transformers/creativityPotential'); 
const { transformGrit } = require('./transformers/grit');
const { transformDarkTriad } = require('./transformers/darkTriad');
const { transformManagementStress } = require('./transformers/managementStress');
const { transformGrowthMindset } = require('./transformers/growthMindset');
const { transformAttachmentStyle } = require('./transformers/attachmentStyle');
const { transformFourTempraments } = require('./transformers/fourTempraments');
const { transformMbti } = require('./transformers/mbti');
// 🚨 Import Transformer Baru untuk Kepribadian Facet
const { transformKepribadianFacet } = require('./transformers/kepribadianFacet');

function getPsikotestCode(key) {
    if (key === 'kepribadian') return 'ocean';
    if (key === 'minatBakat') return 'minat_bakat'; 
    if (key === 'enSkill') return 'englishSkills';
    if (key === 'leaderStyle') return 'leadershipStyle';
    if (key === 'KecerdasanEmosional') return 'emotionalQuality';
    if (key === 'kreativitasInovasi') return 'creativity_potential'; 
    
    return key;
}

const transformers = {
    minatBakat: transformMinatBakat,
    kepribadian: transformKepribadian, // Ini adalah transformer default untuk Big Five sederhana
    iqTest: transformIqTest,
    enSkill: transformEnglishSkills,
    personalValues: transformPersonalValues,
    motivationBoost: transformMotivationBoost,
    petaPerilaku: transformPetaPerilaku,
    workingStyle: transformWorkingStyle,
    leaderStyle: transformLeadershipStyle,
    learningStyle: transformLearningStyle,
    emotionalQuality: transformEmotionalQuality, 
    kreativitasInovasi: transformCreativityPotential, 
    grit: transformGrit,
    dark_triad: transformDarkTriad,
    management_stress: transformManagementStress,
    growth_mindset: transformGrowthMindset,
    attachmentStyle: transformAttachmentStyle,
    fourTempraments: transformFourTempraments,
    mbti: transformMbti,
    // Kita tidak perlu mendaftarkan transformKepribadianFacet di sini,
    // karena pemanggilannya dilakukan secara kondisional di generateReport.
};

async function generateReport(id, lang, v) {
    
    const userResultDoc = await getAssessmentResult(id);
    if (!userResultDoc) {
        throw new Error('404 Result not found');
    }

    const testResultKeys = Object.keys(userResultDoc.testResult);
    
    // --- FASE 1: Mengumpulkan Permintaan Interpretasi ---
    const interpretationRequests = testResultKeys.map(key => {
        let psikotestCode = getPsikotestCode(key);
        
        // 🚨 LOGIKA KONDISIONAL BARU untuk Kepribadian (Facet-based)
        if (key === 'kepribadian' && userResultDoc.testResult.kepribadian.formId === 'waMWav') {
             psikotestCode = 'ocean_facet'; 
        }
        return getInterpretation(psikotestCode, lang, v);
    });

    const interpretationResults = await Promise.all(interpretationRequests);

    const interpretationDocs = interpretationResults.reduce((acc, doc) => {
        if (doc) {
            acc[doc.psikotestCode] = doc;
        }
        return acc;
    }, {});
    
    const sections = [];

    // --- FASE 2: Memproses dan Mentransformasi Hasil ---
    for (const key of testResultKeys) {
        const userResult = userResultDoc.testResult[key];
        
        let interpretationKey = getPsikotestCode(key);
        let transformerFunction = transformers[key];

        // 🚨 LOGIKA KONDISIONAL BARU untuk Kepribadian (memilih transformer yang tepat)
        if (key === 'kepribadian') {
             if (userResult.formId === 'waMWav') {
                 // Gunakan transformer dan kode interpretasi Facet yang baru
                 transformerFunction = transformKepribadianFacet;
                 interpretationKey = 'ocean_facet';
             } else {
                 // Default: Gunakan transformer lama (simple Big Five)
                 transformerFunction = transformers.kepribadian;
                 interpretationKey = 'ocean'; 
             }
        }

        const interpretationDoc = interpretationDocs[interpretationKey];

        if (!interpretationDoc) {
            throw new Error(`500 Interpretation not found for code: ${interpretationKey}`);
        }

        if (transformerFunction) {
            const sectionBlock = transformerFunction(userResult, interpretationDoc);
            sections.push(sectionBlock);
        }
    }

    return {
        pid: userResultDoc._id.toHexString(), 
        product: {
            code: userResultDoc.code,
            name: userResultDoc.productName,
            package: userResultDoc.package
        },
        user: {
            name: userResultDoc.name,
            email: userResultDoc.email,
            phoneNumber: userResultDoc.phoneNumber
        },
        meta: {},
        orderNumber: userResultDoc.orderNumber,
        createdDate: userResultDoc.createdDate,
        schemaVersion: v,
        lang: lang,
        version: v,
        sections: sections 
    };
}

module.exports = {
    generateReport
};