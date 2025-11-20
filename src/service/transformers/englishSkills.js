function getEnglishLevel(score) {
    if (score >= 60) return 'tinggi';
    if (score >= 40) return 'sedang';
    return 'rendah';
}

function transformEnglishSkills(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi untuk English Skills tidak ditemukan');
    }

    let section = {
        id: interpretation.psikotestCode, 
        title: interpretation.meta.title, 
        blocks: []
    };

    const userLevel = getEnglishLevel(userResult.score); 
    const levelWording = interpretation.results.dimensions[userLevel];
    
    section.blocks.push({
        type: 'heading',
        content: {
            heading: interpretation.meta.title,
            subtitle: interpretation.meta.subtitle,
            description: interpretation.meta.shortBrief
        }
    });

    if (levelWording && levelWording.overview) {
        section.blocks.push({
            type: 'richtext_html',
            content: {
                html: `<h3>Overview</h3><p>${levelWording.overview}</p>`
            }
        });
    }

    if (levelWording && levelWording.inDepth) {
        const inDepth = levelWording.inDepth;
        
        Object.keys(inDepth).forEach(key => {
            const part = inDepth[key];
            section.blocks.push({
                type: 'richtext_html',
                content: {
                    html: `<h3>${part.title}</h3>${part.content}`
                }
            });
        });
    }
    
    if (levelWording && levelWording.characteristic) {
        const characteristic = levelWording.characteristic;
        
        Object.keys(characteristic).forEach(key => {
            const part = characteristic[key];
            section.blocks.push({
                type: 'richtext_html',
                content: {
                    html: `<h4>${part.title}</h4>${part.content}`
                }
            });
        });
    }

    if (levelWording && levelWording.recommendation) {
        const recommendation = levelWording.recommendation;
        
        section.blocks.push({
            type: 'richtext_html',
            content: {
                html: `<h3>Rekomendasi</h3>`
            }
        });

        Object.keys(recommendation).forEach(key => {
            const part = recommendation[key];
            section.blocks.push({
                type: 'richtext_html',
                content: {
                    html: `<h4>${part.title}</h4>${part.content}`
                }
            });
        });
    }

    return section;
}

module.exports = {
    transformEnglishSkills
};