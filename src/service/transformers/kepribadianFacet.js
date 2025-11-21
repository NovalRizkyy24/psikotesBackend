function transformKepribadianFacet(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi Kepribadian (Facet) tidak ditemukan');
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
    
    // Tambahkan overview jika ada di DB
    const overviewWording = interpretation.results.dimensions.overview;
    if (overviewWording) {
         section.blocks.push({
            type: 'text',
            content: {
                heading: overviewWording.title,
                text: overviewWording.text
            }
        });
    }

    const dimensions = ['open', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];

    // 2. Iterate dan tampilkan hasil facet per dimensi
    dimensions.forEach(dimKey => {
        const dimension = userResult[dimKey];
        if (!dimension) return;
        
        const dimTitle = dimKey.charAt(0).toUpperCase() + dimKey.slice(1);
        
        // Kumpulkan semua sub-dimensi (facets) dan kategorinya
        let facetDetails = [];
        
        Object.keys(dimension).forEach(facetKey => {
            const facet = dimension[facetKey];
            if (facet.category) {
                // Formatting: Nama Facet: Kategori
                const formattedFacetName = facetKey.charAt(0).toUpperCase() + facetKey.slice(1);
                facetDetails.push(`${formattedFacetName}: ${facet.category}`);
            }
        });

        // Tampilkan facet sebagai list
        section.blocks.push({
            type: 'list',
            content: {
                heading: `Dimensi ${dimTitle} (Facets)`,
                items: facetDetails 
            }
        });
    });

    return section;
}

module.exports = {
    transformKepribadianFacet
};