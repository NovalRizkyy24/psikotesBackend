function transformAttachmentStyle(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi untuk Attachment Style tidak ditemukan');
    }

    let section = {
        id: interpretation.psikotestCode, 
        title: interpretation.meta.title, 
        blocks: []
    };

    const userStyleKey = userResult.result.value; // e.g., 'dismissing_avoidant'
    const wording = interpretation.results.dimensions[userStyleKey];
    
    if (!wording) {
        throw new Error(`500 Interpretation wording not found for attachment style: ${userStyleKey}`);
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
                name: 'Gaya Keterikatan Dominan',
                items: [{
                    label: wording.title, 
                    value: 1, 
                    level: 'high',
                    description: wording.subtitle
                }]
            }]
        }
    });

    // 3. DESCRIPTION & OVERVIEW
    section.blocks.push({
        type: 'text',
        content: {
            heading: `${wording.title} Overview`,
            text: wording.description
        }
    });
    
    // 4. RELATIONSHIP PATTERNS (List)
    if (wording.relationship_patterns) {
        section.blocks.push({
            type: 'list',
            content: {
                heading: `Pola Hubungan Khas (${wording.title})`,
                items: Object.values(wording.relationship_patterns)
            }
        });
    }

    return section;
}

module.exports = {
    transformAttachmentStyle
};