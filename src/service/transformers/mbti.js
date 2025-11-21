function transformMbti(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi untuk MBTI tidak ditemukan');
    }

    let section = {
        id: interpretation.psikotestCode, 
        title: interpretation.meta.title, 
        blocks: []
    };

    const userType = userResult.resultType; // e.g., 'INTJ'
    const wording = interpretation.results.dimensions[userType];
    
    if (!wording) {
        throw new Error(`500 Interpretation wording not found for MBTI type: ${userType}`);
    }

    // 1. HEADING BLOCK
    section.blocks.push({
        type: 'heading',
        content: {
            heading: interpretation.meta.title,
            subtitle: interpretation.meta.subtitle,
            description: interpretation.meta.shortBrief
        }
    });

    // 2. MAIN RESULT BLOCK (Dimension List)
    section.blocks.push({
        type: 'dimension_list',
        content: {
            mode: 'top',
            groups: [{
                name: 'Tipe Kepribadian Dominan',
                items: [{
                    label: userType, 
                    value: userResult.resultScore, 
                    level: 'Dominan',
                    description: wording.subtitle
                }]
            }]
        }
    });

    // 3. DETAILED ANALYSIS (Overview)
    section.blocks.push({
        type: 'text',
        content: {
            heading: `Tipe ${userType}: ${wording.title}`,
            text: wording.overview
        }
    });

    // 4. CAREER PATH (List)
    if (wording.careerPath && Object.values(wording.careerPath).length > 0) {
        section.blocks.push({
            type: 'list',
            content: {
                heading: 'Potensi Karir',
                items: Object.values(wording.careerPath)
            }
        });
    }

    return section;
}

module.exports = {
    transformMbti
};