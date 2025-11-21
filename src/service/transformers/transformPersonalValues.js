// File: TestMagang1%/src/service/transformers/personalValues.js

const DIMENSION_MAP = {
    // Memetakan kunci dari data pengguna (self_direction) ke kunci di interpretasi (selfDirection)
    'self_direction': 'selfDirection' 
};

function getInterpretationKey(userKey) {
    // Jika ada di map, gunakan kunci dari map, jika tidak, gunakan kunci aslinya
    return DIMENSION_MAP[userKey] || userKey;
}

function getTop3PersonalValues(scores) {
    return Object.entries(scores)
        .map(([key, value]) => ({ key, score: value }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}

function transformPersonalValues(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi untuk Personal Values tidak ditemukan');
    }

    let section = {
        id: interpretation.psikotestCode, 
        title: interpretation.meta.title, 
        blocks: []
    };

    const scores = userResult.result.score;
    const dimensionsWording = interpretation.results.dimensions;
    const top3Values = getTop3PersonalValues(scores);

    section.blocks.push({
        type: 'heading',
        content: {
            heading: interpretation.meta.title,
            subtitle: interpretation.meta.subtitle,
            description: interpretation.meta.shortBrief
        }
    });

    const dimensionListItems = top3Values.map((dim, index) => {
        const userKey = dim.key; // Kunci asli dari userResult
        const key = getInterpretationKey(userKey); // Kunci yang sudah disesuaikan (misalnya 'selfDirection')
        const wording = dimensionsWording[key];

        if (!wording) {
            throw new Error(`500 Interpretation wording not found for dimension key: ${key} in ${interpretation.psikotestCode}`);
        }

        return {
            rank: index + 1,
            dimension: wording.title,
            score: dim.score,
            level: `Top ${index + 1}`,
            description: wording.description
        };
    });

    section.blocks.push({
        type: 'dimension_list',
        content: {
            heading: interpretation.results.topN.title,
            items: dimensionListItems
        }
    });

    top3Values.forEach(dim => {
        const userKey = dim.key;
        const key = getInterpretationKey(userKey); // Kunci yang sudah disesuaikan
        const wording = dimensionsWording[key];
        
        if (!wording) return;
        
        const textContent = `${wording.description}\n\n**Manifestasi dalam Kehidupan:**\n${wording.manifestation}\n\n**Kekuatan dan Tantangan:**\n${wording.strengthChallenges}`;

        section.blocks.push({
            type: 'text',
            content: {
                heading: wording.title,
                text: textContent 
            }
        });
    });

    return section;
}

module.exports = {
    transformPersonalValues
};