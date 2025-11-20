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
        const key = dim.key; 
        const wording = dimensionsWording[key];

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
        const key = dim.key;
        const wording = dimensionsWording[key];
        
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