function getTop2Motivations(scores) {
    return Object.entries(scores)
        .map(([key, value]) => ({ key, score: value }))
        .sort((a, b) => b.score - a.score) 
        .slice(0, 2);
}

function transformMotivationBoost(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi untuk Motivation Boost tidak ditemukan');
    }

    let section = {
        id: interpretation.psikotestCode, 
        title: interpretation.meta.title, 
        blocks: []
    };

    const scores = userResult.score;
    const dimensionsWording = interpretation.results.dimensions;
    const top2Motivations = getTop2Motivations(scores);

    section.blocks.push({
        type: 'heading',
        content: {
            heading: interpretation.meta.title,
            subtitle: interpretation.meta.subtitle,
            description: interpretation.meta.shortBrief
        }
    });

    const dimensionListItems = top2Motivations.map((dim, index) => {
        const key = dim.key; 
        const wording = dimensionsWording[key];

        if (!wording) {
            return { rank: index + 1, dimension: 'Error', score: dim.score, level: 'Error', description: 'Missing data' };
        }

        return {
            rank: index + 1,
            dimension: wording.title,
            score: dim.score,
            level: `Top ${index + 1}`,
            description: wording.subtitle 
        };
    });

    section.blocks.push({
        type: 'dimension_list',
        content: {
            heading: interpretation.results.topN ? interpretation.results.topN.title : 'Top 2 Motivasi Pendorong Anda',
            items: dimensionListItems
        }
    });

    top2Motivations.forEach(dim => {
        const key = dim.key;
        const wording = dimensionsWording[key];
        
        if (!wording) return; 

        const textContent = `${wording.overview}\n\n**Manifestasi dalam Kehidupan:**\n${wording.manifestation}\n\n**Kekuatan dan Tantangan:**\n${wording.strengthAndChallenge}`;

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
    transformMotivationBoost
};