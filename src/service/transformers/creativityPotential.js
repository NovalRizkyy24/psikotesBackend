function getCreativityCategory(userResult) {
    return 'mahir'; 
}

function getCreativityRankLevel(score) {
    if (score <= 1) return 'rendah';
    if (score >= 5) return 'tinggi';
    return 'sedang';
}

function transformCreativityPotential(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi untuk Creativity Potential tidak ditemukan');
    }

    let section = {
        id: interpretation.psikotestCode, 
        title: interpretation.meta.title, 
        blocks: []
    };

    const category = getCreativityCategory(userResult); 
    const categoryWording = interpretation.results.dimensions.interpretasiTotalSkor[category];
    const userScores = userResult.score;

    section.blocks.push({
        type: 'heading',
        content: {
            heading: interpretation.meta.title,
            subtitle: interpretation.meta.subtitle,
            description: interpretation.meta.shortBrief
        }
    });

    section.blocks.push({
        type: 'richtext_html',
        content: {
            html: `<h3>Overview Potensi Kreativitas</h3><p>${categoryWording.overview}</p>`
        }
    });

    const pillarMap = {
        'kelancaran': 'pilar1',
        'fleksibilitas': 'pilar2',
        'orisinalitas': 'pilar3'
    };

    Object.keys(userScores).forEach(userKey => {
        const pillarKey = pillarMap[userKey];
        const score = userScores[userKey];
        
        const rankLevel = getCreativityRankLevel(score);

        const pillarWording = interpretation.results.dimensions[pillarKey][rankLevel];

        section.blocks.push({
            type: 'richtext_html',
            content: {
                html: `<h3>${pillarWording.tipe}</h3><p>${pillarWording.description}</p>`
            }
        });
    });

    return section;
}

module.exports = {
    transformCreativityPotential
};