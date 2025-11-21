const DIMENSION_MAP = {
    'open': 'openness',
    'conscientious': 'conscientiousness',
    'extraversion': 'extraversion',
    'agreeable': 'agreeableness',
    'neurotic': 'neuroticism'
};

function transformKepribadian(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi untuk Kepribadian tidak ditemukan');
    }

    if (!userResult.score || !userResult.rank) {
        throw new Error('500 Kepribadian data structure is unsupported or empty (Expected simple Big Five score/rank).');
    }
    // ------------------------------------

    let section = {
        id: interpretation.psikotestCode, 
        title: interpretation.meta.title, 
        blocks: []
    };

    const dimensionsWording = interpretation.results.dimensions;
    const userRanks = userResult.rank;
    const userScores = userResult.score;

    section.blocks.push({
        type: 'heading',
        content: {
            heading: interpretation.meta.title,
            subtitle: interpretation.meta.subtitle,
            description: interpretation.meta.shortBrief
        }
    });

    const dimensionListItems = Object.keys(userScores).map(userKey => {
        const interpretationKey = DIMENSION_MAP[userKey];
        const rankLevel = userRanks[userKey];
        const wording = dimensionsWording[interpretationKey][rankLevel];
        const dimensionTitle = interpretationKey.charAt(0).toUpperCase() + interpretationKey.slice(1);

        return {
            label: dimensionTitle,
            value: userScores[userKey],
            level: rankLevel, 
            description: wording.interpretation.length > 100 ? wording.interpretation : null 
        };
    });

    section.blocks.push({
        type: 'dimension_list',
        content: {
            mode: 'all',
            groups: [{
                name: 'Dimensi Kepribadian',
                items: dimensionListItems
            }]
        }
    });
    
    Object.keys(userScores).forEach(userKey => {
        const interpretationKey = DIMENSION_MAP[userKey];
        const rankLevel = userRanks[userKey];
        const wording = dimensionsWording[interpretationKey][rankLevel];
        const dimensionTitle = interpretationKey.charAt(0).toUpperCase() + interpretationKey.slice(1);

        section.blocks.push({
            type: 'text',
            content: {
                heading: dimensionTitle,
                text: wording.interpretation
            }
        });
        
        const aspects = wording.aspekKehidupan;

        const aspectsMap = {
            'kekuatan': 'Kekuatan',
            'kelemahan': 'Area Pengembangan',
            'hubunganInterpersonal': 'Hubungan Interpersonal',
            'kepemimpinan': 'Kepemimpinan',
            'karir': 'Karir',
            'gayaBelajar': 'Gaya Belajar'
        };

        Object.keys(aspectsMap).forEach(key => {
            if (aspects[key]) {
                
                const itemsArray = Object.values(aspects[key]); 
                
                if (itemsArray.length > 0) { 
                     section.blocks.push({
                         type: 'list',
                         content: {
                             heading: aspectsMap[key],
                             items: itemsArray 
                         }
                     });
                }
            }
        });
    });

    return section;
}

module.exports = {
    transformKepribadian
};