const DIMENSION_MAP = {
    'selfAwareness_empathy': 'Kesadaran Diri & Empati',
    'understanding_emotions': 'Memahami Emosi',
    'managing_emotions': 'Mengelola Emosi',
    'using_emotions': 'Menggunakan Emosi'
};

function getEmotionalQualityCategory(userResult) {
    return 'berkembang'; 
}

function getRankLevel(score) {
    if (score === 1) return 'rendah';
    if (score === 2) return 'sedang';
    if (score === 3) return 'tinggi';
    return 'sedang'; 
}

function transformEmotionalQuality(userResult, interpretation) {
    if (!userResult || !interpretation) {
        throw new Error('Data user atau interpretasi untuk Emotional Quality tidak ditemukan');
    }

    let section = {
        id: interpretation.psikotestCode, 
        title: interpretation.meta.title, 
        blocks: []
    };

    const category = getEmotionalQualityCategory(userResult); 
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
            html: `<h3>Overview Kecerdasan Emosional</h3><p>${categoryWording.overview}</p>`
        }
    });

    Object.keys(userScores).forEach(userKey => {
        const rankLevel = getRankLevel(userScores[userKey]);
        const dimensionWording = interpretation.results.dimensions[userKey][rankLevel];
        const title = DIMENSION_MAP[userKey];

        section.blocks.push({
            type: 'richtext_html',
            content: {
                html: `<h3>${title}: ${dimensionWording.tipe}</h3><p>${dimensionWording.description}</p>`
            }
        });
    });

    return section;
}

module.exports = {
    transformEmotionalQuality
};