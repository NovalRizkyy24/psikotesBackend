// TestMagang1%/src/service/transformers/petaPerilaku.js

function transformPetaPerilaku(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi untuk Peta Perilaku tidak ditemukan');
    }

    let section = {
        id: interpretation.psikotestCode, 
        title: interpretation.meta.title, 
        blocks: []
    };

    const userStyle = userResult.result; 
    const wording = interpretation.results.dimensions[userStyle];

    const styleTitle = wording.title || (userStyle.charAt(0).toUpperCase() + userStyle.slice(1));
    
    section.blocks.push({
        type: 'heading',
        content: {
            heading: interpretation.meta.title,
            subtitle: interpretation.meta.subtitle,
            description: interpretation.meta.shortBrief
        }
    });

    section.blocks.push({
        type: 'dimension_list',
        content: {
            mode: 'top',
            groups: [{
                name: interpretation.results.topN ? interpretation.results.topN.name : 'Top Behavioral Style', 
                items: [{
                    label: styleTitle, 
                    value: 1, 
                    level: 'high',
                    description: null
                }]
            }]
        }
    });

    if (wording.overview) {
        section.blocks.push({
            type: 'text',
            content: {
                heading: `${styleTitle} Overview`,
                text: wording.overview
            }
        });
    }
    
    if (wording.behavioralStyle) {
        const style = wording.behavioralStyle;
        
        const combinedStyleText = Object.values(style).join('\n');

        section.blocks.push({
            type: 'text',
            content: {
                heading: `${styleTitle} Behavioral Style`,
                text: combinedStyleText
            }
        });
    }

    if (wording.communicationTips) {
        const tips = wording.communicationTips;
        
        const combinedTipsText = Object.values(tips).join('\n');
        
        section.blocks.push({
            type: 'text',
            content: {
                heading: `${styleTitle} Communication Tips`,
                text: combinedTipsText
            }
        });
    }

    return section;
}

module.exports = {
    transformPetaPerilaku
};