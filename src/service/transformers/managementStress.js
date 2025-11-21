function transformManagementStress(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi untuk Management Stress tidak ditemukan');
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

    // 2. PROCESS DOMINANT STRATEGY
    const strategyName = userResult.dominantStrategy.name;
    const strategyWording = dimensionsWording.strategy[strategyName];
    
    if (strategyWording) {
        section.blocks.push({
            type: 'text',
            content: {
                heading: `Strategi Dominan: ${strategyWording.title}`,
                text: strategyWording.description
            }
        });
    }

    // 3. PROCESS EFC RESULT (Emotion-Focused Coping)
    const efcCategory = userResult.efcResult.category.toLowerCase();
    const efcWording = dimensionsWording.efc[efcCategory];

    if (efcWording) {
        section.blocks.push({
            type: 'richtext_html',
            content: {
                heading: efcWording.title,
                html: `<p>${efcWording.overview}</p>`
            }
        });
    }

    // 4. PROCESS PFC RESULT (Problem-Focused Coping)
    const pfcCategory = userResult.pfcResult.category.toLowerCase();
    const pfcWording = dimensionsWording.pfc[pfcCategory];

    if (pfcWording) {
        section.blocks.push({
            type: 'richtext_html',
            content: {
                heading: pfcWording.title,
                html: `<p>${pfcWording.overview}</p>`
            }
        });
    }

    return section;
}

module.exports = {
    transformManagementStress
};