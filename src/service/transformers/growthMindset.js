function transformGrowthMindset(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi untuk Growth Mindset tidak ditemukan');
    }

    let section = {
        id: interpretation.psikotestCode, 
        title: interpretation.meta.title, 
        blocks: []
    };

    const dimensionsWording = interpretation.results.dimensions;

    // 1. HEADING BLOCK
    section.blocks.push({
        type: 'heading',
        content: {
            heading: interpretation.meta.title,
            subtitle: interpretation.meta.subtitle,
            description: interpretation.meta.shortBrief
        }
    });

    // 2. PROCESS RANK SCORE
    const rankScore = userResult.rankScore; 
    const wordingKey = rankScore.toLowerCase().replace(/\s/g, '_'); // e.g., 'cenderung growth mindset' -> 'cenderung_growth_mindset'
    const rankWording = dimensionsWording[wordingKey];

    if (rankWording) {
        section.blocks.push({
            type: 'text',
            content: {
                heading: `Hasil Anda: ${rankScore}`,
                text: rankWording.description
            }
        });
        
        if (rankWording.implications) {
            section.blocks.push({
                type: 'list',
                content: {
                    heading: `Implikasi dalam Karir & Kehidupan`,
                    items: Object.values(rankWording.implications)
                }
            });
        }
        
    } else {
        section.blocks.push({
            type: 'text',
            content: {
                heading: `Hasil Anda: ${rankScore}`,
                text: "Interpretasi naratif tidak ditemukan. Silakan cek dokumen interpretasi di database."
            }
        });
    }

    return section;
}

module.exports = {
    transformGrowthMindset
};