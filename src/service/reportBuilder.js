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
    kepribadian: transformKepribadian,
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
};

async function generateReport(id, lang, v) {
    
    const userResultDoc = await getAssessmentResult(id);
    if (!userResultDoc) {
        throw new Error('404 Result not found');
    }

    const testResultKeys = Object.keys(userResultDoc.testResult);
    
    const interpretationPromises = testResultKeys.map(key => {
        const psikotestCode = getPsikotestCode(key);
        return getInterpretation(psikotestCode, lang, v);
    });

    const interpretationResults = await Promise.all(interpretationPromises);

    const interpretationDocs = interpretationResults.reduce((acc, doc) => {
        if (doc) {
            acc[doc.psikotestCode] = doc;
        }
        return acc;
    }, {});
    
    const sections = [];

    for (const key of testResultKeys) {
        const userResult = userResultDoc.testResult[key];
        
        const interpretationKey = getPsikotestCode(key);
        const interpretationDoc = interpretationDocs[interpretationKey];

        if (!interpretationDoc) {
            throw new Error(`500 Interpretation not found for code: ${interpretationKey}`);
        }

        const transformerFunction = transformers[key];
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