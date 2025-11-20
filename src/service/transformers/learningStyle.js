function transformLearningStyle(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi untuk Learning Style tidak ditemukan');
    }

    let section = {
        id: interpretation.psikotestCode, 
        title: interpretation.meta.title, 
        blocks: []
    };

    const userStyle = userResult.result; 
    const wording = interpretation.results.dimensions[userStyle];

    section.blocks.push({
        type: 'heading',
        content: {
            heading: interpretation.meta.title,
            subtitle: interpretation.meta.subtitle,
            description: interpretation.meta.shortBrief
        }
    });

    section.blocks.push({
        type: 'dimension_list',
        content: {
            mode: 'top',
            groups: [{
                name: (interpretation.results.topN && interpretation.results.topN.name) || 'Top Learning Style', 
                items: [{
                    label: wording.title, 
                    value: 1, 
                    level: 'high',
                    description: null
                }]
            }]
        }
    });

    if (wording.overview) {
        section.blocks.push({
            type: 'text',
            content: {
                heading: `${wording.title} Overview`,
                text: wording.overview
            }
        });
    }

    if (wording.strengths) {
        section.blocks.push({
            type: 'richtext_html',
            content: {
                heading: `${wording.title} Kekuatan`,
                html: wording.strengths
            }
        });
    }
    
    if (wording.challenges) {
        section.blocks.push({
            type: 'richtext_html',
            content: {
                heading: `${wording.title} Tantangan`,
                html: wording.challenges
            }
        });
    }

    if (wording.learningStrategy) {
        const strategyItems = Object.values(wording.learningStrategy);

        section.blocks.push({
            type: 'list',
            content: {
                heading: `${wording.title} Strategi Belajar`,
                items: strategyItems 
            }
        });
    }

    return section;
}

module.exports = {
    transformLearningStyle
};