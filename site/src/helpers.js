export function getSampleValues(testOrStudy) {
    let samples = [];
    if (testOrStudy.sample) {
        samples.push(...testOrStudy.sample);
    }
    if (testOrStudy.studies) {
        let studies = Object.values(testOrStudy.studies);
        for (const study of studies) {
            if (study.sample) {
                samples.push(...study.sample);
            }
        }
    }

    samples = samples.filter(function (item, pos) {
        return samples.indexOf(item) == pos;
    });
    return samples;
}

export function getSampleIcons(testOrStudy) {
    const mapping = {
        nasal: "👃",
        np: "🥺",
        op: "😲",
        sputum: "🤑",
        saliva: "💦",
        stool: "💩",
        "mid-turbinate": "🐚",
    };

    let samples = getSampleValues(testOrStudy);
    return samples.map((k) => mapping[k]).join("");
}

export function getSampleText(testOrStudy) {
    const mapping = {
        nasal: "👃 vordere Nase",
        np: "🥺 Nasen-Rachen-Abstrich",
        op: "😲 Mund-Rachen-Abstrich",
        sputum: "🤑 Sputum",
        saliva: "💦 Speichel",
        stool: "💩 Stuhl",
        "mid-turbinate": "🐚 Mittlere Nasenmuschel",
    };

    let samples = getSampleValues(testOrStudy);
    return samples.map((k) => mapping[k]).join(", ");
}

const quadas = {
    "low concern":          {hexColor: "#388E3C", vueColor: "green darken-2",   german: "geringe Bedenken"},
    "intermediate concern": {hexColor: "#388E3C", vueColor: "yellow darken-2",  german: "mittlere Bedenken"},
    "high concern":         {hexColor: "#D32F2F", vueColor: "red darken-2",     german: "hohe Bedenken"},
    "unclear":              {hexColor: "#000000", vueColor: "black",            german: "unklare Bedenken"},
    "unknown":              {hexColor: "#000000", vueColor: "black",            german: "keine Angabe"},
    "manufacturer":         {hexColor: "#1976D2", vueColor: "blue darken-2",    german: "Hersteller-Angaben"},
}

export function getStudyQuality(study) {
    if (study.author == "manufacturer") return quadas["manufacturer"];
    if (quadas[study.quadas]) return quadas[study.quadas];
    return quadas["unknown"];
}

export function getStudyColor(study, hex) {
    let quality = getStudyQuality(study);
    return hex ? quality.hexColor : quality.vueColor;
}

export function getStudyQualityText(study) {
    return getStudyQuality(study).german;
}

export function getStudySampleSizeString(study) {
    if (study.sampleSize) {
        return "n = " + study.sampleSize;
    }
    return "";
}