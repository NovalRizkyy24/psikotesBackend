function transformFourTempraments(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi untuk Four Tempraments tidak ditemukan');
    }

    let section = {
        id: interpretation.psikotestCode, 
        title: interpretation.meta.title, 
        blocks: []
    };

    const userStyle = userResult.result.value.toLowerCase(); 
    const userSecondStyle = userResult.result.secondValue.toLowerCase();
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

    // 2. MAIN STYLE LIST
    const mainWording = dimensionsWording[userStyle];
    if (mainWording) {
         section.blocks.push({
            type: 'dimension_list',
            content: {
                mode: 'top',
                groups: [{
                    name: 'Gaya Temperamen Dominan',
                    items: [{
                        label: mainWording.title, 
                        value: 1, 
                        level: 'Dominan',
                        description: mainWording.description
                    }]
                }]
            }
        });

        // 3. MAIN STYLE OVERVIEW
        section.blocks.push({
            type: 'text',
            content: {
                heading: `${mainWording.title} Overview`,
                text: mainWording.overview
            }
        });
    }

    // 4. SECONDARY STYLE INFO
    const secondWording = dimensionsWording[userSecondStyle];
    if (secondWording) {
        section.blocks.push({
            type: 'text',
            content: {
                heading: `Gaya Sekunder: ${secondWording.title}`,
                text: `Sebagai gaya sekunder, ${secondWording.title} memberikan nuansa tambahan pada kepribadian Anda. Hal ini membantu Anda menjadi lebih seimbang dan adaptif dalam interaksi sosial.`
            }
        });
    }

    return section;
}

module.exports = {
    transformFourTempraments
};