const util = require('util');
const fs = require('fs');
const parse = require('csv-parse/lib/sync');
var latestEvaluationName = "";
var latestMapping = null;
var currentStudyId = 1;
var currentTestId = 1;

function getAntigenTestColumnNames(firstLine) {
    return firstLine.map(convertAntigenTestColumnName);
}

function convertAntigenTestColumnName(origName) {
    switch (origName) {
        case "Test-ID": return "id";
        case "Handelsname des Herstellers / Europ. Bevollmächtigten": return "name";
        case "Evaluierung PEI": return "pei";
        case "Hersteller Name": return "manufacturer";
        case "Sensitivität %": return "sensitivityAvg";
        case "95%iges Vertrauensintervall (Sensitivität)": return "sensitivityRange";
        case "Spezifität %": return "specificityAvg";
        case "95%iges Vertrauensintervall (Spezifität)": return "specificityRange";
        case "Liste Handelsnamen": return "tradename";
        case "Liste Deutscher Vertreiber": return "distributors";
    }
    return origName;
}

bools = { "Ja": true, "Nein": false, "": undefined };

function onAntigenTestRecord(record, context) {
    record.pei = bools[record.pei];
    let manufacturerStudyId = currentStudyId++;
    record.studies = { [manufacturerStudyId]: { "author": "manufacturer", "id": manufacturerStudyId } };
    record.studies[manufacturerStudyId].sensitivity = {
        avg: parseFloat((record.sensitivityAvg + "").replace(",", ".")) / 100.0,
        min: parseFloat(record.sensitivityRange.split("-")[0]) / 100.0,
        max: parseFloat(record.sensitivityRange.split("-")[1]) / 100.0
    };
    record.studies[manufacturerStudyId].specificity = {
        avg: parseFloat((record.specificityAvg + "").replace(",", ".")) / 100.0,
        min: parseFloat((record.specificityRange.split("-")[0] + "").replace(",", ".")) / 100.0,
        max: parseFloat((record.specificityRange.split("-")[1] + "").replace(",", ".")) / 100.0
    };
    delete record.sensitivityAvg;
    delete record.sensitivityRange;
    delete record.specificityAvg;
    delete record.specificityRange;
    record.distributors = record.distributors.split(",");
    record.tradename = record.tradename.split(",");

    let matchingSelftests = jsonSelftests.filter(selftest => selftest.id == record.id);

    record.selftest = (matchingSelftests.length == 1);
    if (record.selftest) {
        record.reference = matchingSelftests[0].reference;
        record.shops = matchingSelftests[0].available;
        record.pei = true;
    } else {
        record.shops = [];
    }

    // add independent studies
    jsonEvaluation.filter(study => study.testId == record.id).forEach(study => {
        record.studies[study.id] = study;
    });

    return record;
}

function getEvaluationColumnNames(firstLine) {
    return firstLine.map(convertEvaluationColumnName);
}

function convertEvaluationColumnName(origName) {
    switch (origName) {
        case "Author": return "author";
        case "Study location": return "location";
        case "QUADAS": return "quadas";
        case "Independent": return "independent";
        case "Sample condition": return "sampleCondition";
        case "Sample type": return "sampleType";
        case "Sample size": return "sampleSize";
        case "Sensitivity (95% CI)": return "sensitivity";
        case "Specificity (95% CI)": return "specificity";
    }
    return origName;
}

function onEvaluationRecord(record, context) {
    const nonEmpty = Object.values(record).filter(v => v != "").length;
    if (nonEmpty == 0) {
        return null;
    }

    if (nonEmpty == 1) {
        latestEvaluationName = record.author; // this is the name of the antigen test, but it's saved in the 'author' column
        let mapping = jsonEvaluationNameMapping[latestEvaluationName];
        if (mapping && mapping.startsWith("AT")) {
            latestMapping = mapping;
        } else {
            latestMapping = null;
        }
        // console.log("Got name: " + latestEvaluationName + " a.k.a. " + latestMapping);
        return null;
    }

    record.testId = latestMapping;
    record.sensitivity = parseEvaluationRange(record.sensitivity);
    record.specificity = parseEvaluationRange(record.specificity);
    record.id = currentStudyId++;

    return record;
}

function parseEvaluationRange(input) {
    // matches strings like "52.5% (95% CI 46.7-58.3)" with several variations
    var re = /(\d+(\.\d+)?)%\*? \((95% CI )?(CI 95% )?(\d+(\.\d+)?)%?\*?-(\d+(\.\d+)?)%?\*?\)/i;
    var found = input.match(re);
    if (found) {
        return {
            avg: parseFloat(found[1]) / 100.0,
            min: parseFloat(found[5]) / 100.0,
            max: parseFloat(found[7]) / 100.0
        };
    } else {
        // try if the string looks like "41.2% (not provided)"
        var re = /(\d+(\.\d+)?)%\*? \(not provided\)/i;
        var found = input.match(re);
        if (found) {
            return {
                avg: parseFloat(found[1]) / 100.0
            };
        } else {
            console.log("Could not match '" + input + "'.");
        }
    }
}

function getSelftestsWithoutId() {
    return jsonSelftests.filter(test => test.id == null).map(test => {
        test.selftest = true;
        test.pei = false;
        let newStudies = {};
        for (const key in test.studies) {
            if (Object.hasOwnProperty.call(test.studies, key)) {
                const study = test.studies[key];
                study.id = currentStudyId++;
                newStudies[study.id] = study;
            }
        }
        test.studies = newStudies;
        test.pei = true;
        test.id = "NO-AT-" + (currentTestId++);
        return test;
    });
}

function compareStrings(a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }

    return 0;
}

const csvAntigenTests = fs.readFileSync("../data/antigentests.csv", { encoding: "latin1" }).replace(/\u0099/g, "\u2122").replace(/\u0096/g, "\u002D");
const jsonSelftests = JSON.parse(fs.readFileSync("../data/selftests.json", { encoding: "utf8" }));
jsonSelftests.sort((a,b) => compareStrings(a.reference, b.reference));
jsonSelftests.sort((a,b) => compareStrings(a.id, b.id));
// selfttest sorted by id, a.k.a. AT-Number, and if there is none, sorted by reference, a.k.a. Aktenzeichen der Sonderzulassung des BfArM
const csvEvaluation = fs.readFileSync("../data/evaluation.csv", { encoding: "utf8" });
const jsonEvaluationNameMapping = JSON.parse(fs.readFileSync("../data/evaluation_name_mapping.json", { encoding: "utf8" }));

const jsonEvaluation = parse(csvEvaluation, {
    on_record: onEvaluationRecord,
    columns: getEvaluationColumnNames,
    delimiter: ";",
});

const jsonAntigenTests = parse(csvAntigenTests, {
    columns: getAntigenTestColumnNames,
    on_record: onAntigenTestRecord,
    skip_empty_lines: true,
    delimiter: ";",
});
jsonAntigenTests.sort((a,b) => compareStrings(a.id, b.id));


jsonAntigenTests.push(...getSelftestsWithoutId());

fs.writeFileSync("../site/public/data/antigentests.json", JSON.stringify(jsonAntigenTests, null, 2));