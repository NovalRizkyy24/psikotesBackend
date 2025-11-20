function transformWorkingStyle(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi untuk Working Style tidak ditemukan');
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
                name: (interpretation.results.topN && interpretation.results.topN.name) || 'Top Working Style', 
                items: [{
                    label: wording.title, 
                    value: userResult.scoring ? userResult.scoring[userStyle] : 1, 
                    level: 'high',
                    description: wording.subtitle
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
    
    if (wording.inDepth) {
        section.blocks.push({
            type: 'richtext_html',
            content: {
                heading: `${wording.title} In-Depth Analysis`,
                html: `<p>${wording.inDepth}</p>`
            }
        });
    }

    return section;
}

module.exports = {
    transformWorkingStyle
};