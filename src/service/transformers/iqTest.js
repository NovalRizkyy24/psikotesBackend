function transformIqTest(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi untuk IQ Test tidak ditemukan');
    }

    let section = {
        id: interpretation.psikotestCode, 
        title: interpretation.meta.title, 
        blocks: []
    };

    const iqLabel = userResult.iqLabel.toLowerCase();
    const iqWording = interpretation.results.dimensions[iqLabel];

    section.blocks.push({
        type: 'heading',
        content: {
            heading: interpretation.meta.title,
            subtitle: interpretation.meta.subtitle,
            description: interpretation.meta.shortBrief
        }
    });

    section.blocks.push({
        type: 'richtext_html',
        content: {
            html: `<p><strong>Skor IQ:</strong> ${userResult.iqScore}</p><p><strong>Kategori:</strong> ${userResult.iqLabel}</p>`
        }
    });

    if (iqWording && iqWording.overview) {
        section.blocks.push({
            type: 'richtext_html',
            content: {
                html: `<h3>Overview</h3><p>${iqWording.overview}</p>`
            }
        });
    }

    if (iqWording && iqWording.inDepth) {
        const inDepth = iqWording.inDepth;
        
        Object.keys(inDepth).forEach(key => {
            const part = inDepth[key];
            
            if (part.content && typeof part.content === 'string' && part.content.includes('<ul>')) {
                 section.blocks.push({
                    type: 'richtext_html',
                    content: {
                        html: `<h3>${part.title}</h3><p>${part.content}</p>`
                    }
                });
            }
        });
    }

    if (iqWording && iqWording.recommendations) {
        const recommendations = iqWording.recommendations;
        
        Object.keys(recommendations).forEach(key => {
            const part = recommendations[key];
            
            if (part.content && typeof part.content === 'string' && part.content.includes('<ul>')) {
                 section.blocks.push({
                    type: 'richtext_html',
                    content: {
                        html: `<h3>${part.title}</h3><p>${part.content}</p>`
                    }
                });
            }
        });
    }

    return section;
}

module.exports = {
    transformIqTest
};