function transformGrit(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi untuk Grit tidak ditemukan');
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

    const resultsKeys = Object.keys(userResult).filter(key => key !== 'formId' && key !== 'formName');
    
    // 2. PROCESS GRIT TOTAL
    const totalResult = userResult.gritTotal;
    if (totalResult) {
        const category = totalResult.category;
        const wordingKey = category.toLowerCase();
        
        // Asumsi interpretasi total ada di dimensions.gritTotal[wordingKey]
        const totalWording = interpretation.results.dimensions.gritTotal[wordingKey];

        section.blocks.push({
            type: 'text',
            content: {
                heading: `Grit Total: ${category}`,
                // Menggunakan overview jika ada, jika tidak, pakai teks fallback
                text: totalWording ? totalWording.overview : `Hasil total Grit Anda berada dalam kategori ${category}.`
            }
        });
    }
    
    // 3. PROCESS DIMENSIONS (Passion, Perseverance)
    resultsKeys.forEach(key => {
        if (key !== 'gritTotal') {
            const dimResult = userResult[key];
            const category = dimResult.category;
            const wordingKey = category.toLowerCase();
            
            // Asumsi interpretasi dimensi ada di interpretation.results.dimensions[key][wordingKey]
            const dimWording = interpretation.results.dimensions[key] ? interpretation.results.dimensions[key][wordingKey] : null;

            section.blocks.push({
                type: 'text',
                content: {
                    heading: dimWording ? dimWording.title : key.charAt(0).toUpperCase() + key.slice(1),
                    text: dimWording ? dimWording.description : `Kategori ${key} Anda: ${category}`
                }
            });
        }
    });

    return section;
}

module.exports = {
    transformGrit
};