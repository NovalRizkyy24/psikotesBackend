function transformDarkTriad(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi untuk Dark Triad tidak ditemukan');
    }

    let section = {
        id: interpretation.psikotestCode, 
        title: interpretation.meta.title, 
        blocks: []
    };

    // 1. HEADING BLOCK
    section.blocks.push({
        type: 'heading',
        content: {
            heading: interpretation.meta.title,
            subtitle: interpretation.meta.subtitle,
            description: interpretation.meta.shortBrief
        }
    });

    const dimensions = ['narcissism', 'machiavellianism', 'psychopathy'];
    const dimensionsWording = interpretation.results.dimensions;

    // 2. PROCESS EACH DIMENSION
    dimensions.forEach(key => {
        const userResultDim = userResult[key];
        if (!userResultDim) return;

        const userCategory = userResultDim.category.toLowerCase(); // e.g., 'tinggi', 'sedang', 'rendah'
        const wording = dimensionsWording[key] ? dimensionsWording[key][userCategory] : null;

        if (wording) {
            section.blocks.push({
                type: 'text',
                content: {
                    heading: `${wording.title} (${userResultDim.category})`,
                    text: `${wording.description}\n\n**Manifestasi:**\n${wording.manifestation}`
                }
            });
        }
    });

    return section;
}

module.exports = {
    transformDarkTriad
};