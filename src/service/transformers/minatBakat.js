function getTopNScores(scores, n = 3) {
    return Object.entries(scores)
        .map(([key, value]) => ({ key, value: value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, n);
}

function transformMinatBakat(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi untuk Minat Bakat tidak ditemukan');
    }

    let section = {
        id: interpretation.psikotestCode,
        title: interpretation.meta.title,
        blocks: []
    };

    const scores = userResult.score;
    const dimensionsWording = interpretation.results.dimensions;

    section.blocks.push({
        type: 'heading',
        content: {
            heading: interpretation.meta.title,
            subtitle: interpretation.meta.subtitle,
            description: interpretation.meta.shortBrief
        }
    });

    const top3Dimensions = getTopNScores(scores, 3);

    const dimensionListItems = top3Dimensions.map(dim => {
        const key = dim.key;
        const wording = dimensionsWording[key];
        const level = userResult.rank ? userResult.rank[key] : null; 

        return {
            label: wording.title,
            value: dim.value,
            level: level,
            description: wording.subtitle
        };
    });

    section.blocks.push({
        type: 'dimension_list',
        content: {
            mode: 'top',
            groups: [{
                name: 'Top Interest Areas',
                items: dimensionListItems
            }]
        }
    });

    top3Dimensions.forEach(dim => {
        const key = dim.key;
        const wording = dimensionsWording[key];

        section.blocks.push({
            type: 'text',
            content: {
                heading: wording.title,
                text: wording.overview
            }
        });
        
        section.blocks.push({
            type: 'text',
            content: {
                heading: 'Passion & Hobby',
                text: wording.passionHobby
            }
        });

        section.blocks.push({
            type: 'list',
            content: {
                heading: 'Career Potential',
                items: wording.careerPotential 
            }
        });

        section.blocks.push({
            type: 'list',
            content: {
                heading: 'Recommended Majors',
                items: wording.majorRecommendation
            }
        });
    });

    return section;
}

module.exports = {
    transformMinatBakat
};