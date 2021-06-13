const util = require('util');
const fs = require('fs');
const parse = require('csv-parse/lib/sync');
var levenshtein = require('fast-levenshtein');
var latestEvaluationTest = "";
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

function getSelfTestColumnNames(firstLine) {
    return firstLine.map(convertSelfTestColumnName);
}

function convertSelfTestColumnName(origName) {
    switch (origName) {
        case "Aktenzeichen des BfArM": return "reference";
        case "Name des Tests": return "name";
        case "Hersteller": return "manufacturer";
        case "Sensitivität %": return "sensitivityAvg";
        case "Spezifität %": return "specificityAvg";
        case "Spezifität %": return "specificityAvg";
        case "Probennahme": return "sample";
        case "Gebrauchsanweisung": return "instructionsUrl";
        case "Europäischer Bevollmächtigter": return "euRep";
    }
    return origName;
}

bools = { "Ja": true, "Nein": false, "": undefined };

function onAntigenTestRecord(record, context) {
    record.pei = bools[record.pei];
    let manufacturerStudyId = currentStudyId++;
    record.studies = { [manufacturerStudyId]: { "author": "manufacturer", "comment": "via BfArM (" + record.name + ")", "id": manufacturerStudyId, "url": "https://antigentest.bfarm.de/ords/f?p=ANTIGENTESTS-AUF-SARS-COV-2" } };
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
    record.distributors = splitDistributorNames(record.distributors.split(","));
    record.tradename = record.tradename.split(",");

    return record;
}

function onSelfTestRecord(record, context) {
    record.pei = true;
    record.sample = record.sample.split(" / ").map(s => s.toLowerCase().replace("speichel","saliva"));
    let manufacturerStudyId = currentStudyId++;
    record.studies = { [manufacturerStudyId]: { "author": "manufacturer", "comment": "via PEI", "id": manufacturerStudyId, "sample": record.sample, "url": "https://antigentest.bfarm.de/ords/f?p=ANTIGENTESTS-AUF-SARS-COV-2:TESTS-ZUR-EIGENANWENDUNG-DURCH-LAIEN" } };
    record.studies[manufacturerStudyId].sensitivity = {
        avg: parseFloat((record.sensitivityAvg + "").replace(",", ".")) / 100.0,
    };
    record.studies[manufacturerStudyId].specificity = {
        avg: parseFloat((record.specificityAvg + "").replace(",", ".")) / 100.0,
    };
    delete record.sensitivityAvg;
    delete record.specificityAvg;

    record.selftest = true;
    record.shops = [];

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
    // the values "unclear" and "BAL/TW" were removed from this list
    const mapping = {
        "NP": ["np"],
        "NP/OP": ["np","op"],
        "AN": ["nasal"],
        "MT": ["mid-turbinate"],
        "saliva": ["saliva"],
        "OP": ["op"],
        "AN/MT": ["nasal", "mid-turbinate"]
    };

    const nonEmpty = Object.values(record).filter(v => v != "").length;
    if (nonEmpty == 0) {
        return null;
    }

    if (nonEmpty == 1) {
        latestEvaluationName = record.author; // this is the name of the antigen test, but it's saved in the 'author' column
        
        var re = /(.*), ([^\(]*)(\((.*) sampling\))?/i;
        var found = latestEvaluationName.match(re);
        if (found) {
            latestEvaluationTest = {
                manufacturer: found[1],
                name: found[2],
                sample: (found[4] || "").toLowerCase()
            }
        } else {
            latestEvaluationTest = null;
            console.log("NAME unmatched: " + latestEvaluationName);
        }
        return null;
    }

    test = {};
    test.manufacturer = latestEvaluationTest.manufacturer;
    test.name = latestEvaluationTest.name;
    test.sample = mapping[record.sampleType] || [latestEvaluationTest.sample];
    id = currentStudyId++;
    test.studies = {
        [id]: {
            "id": id,
            "sensitivity": parseEvaluationRange(record.sensitivity),
            "specificity": parseEvaluationRange(record.specificity),
            "sample": test.sample,
            "sampleSize": record.sampleSize,
            "author": record.author,
            "quadas": record.quadas,
            "independent": record.independent,
            "url": "https://www.klinikum.uni-heidelberg.de/diagnostics-global-health",
        }
    }


    return test;
}

function onLogisticRecord(record, context) {
    test = {};
    test.manufacturer = record.manufacturer;
    test.name = record.name;
    test.logisticRegression = {
        intercept: parseFloat(record.intercept),
        coef: parseFloat(record.coef),
        test: parseFloat(record.test)
    };
    test.studies = {};

    return test;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function splitDistributorNames(inputNames) {
    const endings = [
        "KG", "Gmbh", "mbH", "AG", "SLR", "BV", "OHG", "UG", "(haftungsbeschraenkt)", "(haftungsbeschränkt)", "Ltd.", "SRL", "e.K.", "B.V.", "GbR"
    ];

    let ret = [];
    for (let name of inputNames) {
        for (const ending of endings) {
            name = name.replaceAll(ending, ending + ",");
        }
        // put back together those endings which may occur alone but also in conjunction
        // fixing obvious misspellings of "GmbH & Co. KG" and "haftungsbeschränkt" while at it
        name = name.replaceAll(", & Co.KG", " & Co. KG");
        name = name.replaceAll(", & Co. KG", " & Co. KG");
        name = name.replaceAll(", & Co KG", " & Co. KG");
        name = name.replaceAll(", + Co. KG", " & Co. KG");        
        name = name.replaceAll(", & CO KG", " & Co. KG");        
        name = name.replaceAll(", & Co. KG", " & Co. KG");        
        name = name.replaceAll(", & CoKG", " & Co. KG");        
        name = name.replaceAll(", &Co. KG", " & Co. KG");
        name = name.replaceAll("Co., Ltd", "Co., Ltd.");
        name = name.replaceAll("Co.,Ltd", "Co., Ltd.");
        name = name.replaceAll("Co., Ltd.", "Co., Ltd.");
        name = name.replaceAll("Co.,Ltd.", "Co., Ltd.");
        name = name.replaceAll("Co.Ltd.", "Co., Ltd.");
        name = name.replaceAll("A. Menarini Diagnostics", "A. Menarini Diagnostics,");
        name = name.replaceAll("Diagenics Group SE", "Diagenics Group SE,");
        name = name.replaceAll("Dr. Grob HealthcareIgefa", "Dr. Grob Healthcare,Igefa");
        name = name.replaceAll("Dropshippers GermanyGeSino GmbH", "Dropshippers Germany,GeSino GmbH");
        name = name.replaceAll("UG, (haftungsbeschraenkt)", "UG (haftungsbeschränkt)");
        name = name.replaceAll("UG, (haftungsbeschränkt)", "UG (haftungsbeschränkt)");
        // console.log(name);
        ret.push(...name.split(",").filter(n => n.length > 0))
    }
    return ret;
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
        } else if (input == "not provided") {
            // nothing
        } else {
            console.log("Could not match '" + input + "'.");
        }
    }
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

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function cleanupNames(tests) {
    for (const test of tests) {
        test.tradename = test.tradename || [];
        test.distributors = test.distributors || [];
        test.sample = test.sample || [];

        test.name = test.name.replaceAll("‐","-");

        // remove sample endings from primary name
        for (const sampleKey in jsonSampleMapping) {
            const sampleValue = jsonSampleMapping[sampleKey];
            if (test.name.toLowerCase().endsWith(sampleKey)) {
                test.sample = [...test.sample, ...sampleValue];
                test.tradename.push(test.name);
                test.name = test.name.substring(0, test.name.length - sampleKey.length);
            }
        }
        test.name = test.name.trim();
        test.tradename.push(test.name);

        // add sample types from all names, withouth changing names
        for (const name of test.tradename) {
            for (const sampleKey in jsonSampleMapping) {
                const sampleValue = jsonSampleMapping[sampleKey];
                if (name.toLowerCase().includes(sampleKey)) {
                    test.sample = [...test.sample, ...sampleValue];
                }
            }
        }

        test.tradename = test.tradename.map(name => name.trim().replaceAll("‐","-")).filter(a => a.length > 0);
        test.distributors = test.distributors.map(name => name.trim()).filter(a => a.length > 0);
    }
}

function testNamesMatch(name1, name2) {
    if (name1.toLowerCase() == name2.toLowerCase()) return true;

    for (const array of jsonTestMapping) {
        if (array.includes(name1.toLowerCase()) && array.includes(name2.toLowerCase())) 
            return true;
    }
    
    l = levenshtein.get(name1.toLowerCase(), name2.toLowerCase()) / Math.min(name1.length, name2.length);
    if (l < 0.3) {
        console.log('   [\n        "' + name1 + '",\n        "' + name2 + '"\n    ],');
    }
    
    return false;
}

function companyNamesMatch(name1, name2) {
    if (name1.toLowerCase() == name2.toLowerCase()) return true;
    for (const array of jsonCompanyMapping) {
        if (array.includes(name1.toLowerCase()) && array.includes(name2.toLowerCase())) 
            return true;
    }

    l = levenshtein.get(name1.toLowerCase(), name2.toLowerCase()) / Math.min(name1.length, name2.length);
    if (l < 0.1) {
        //console.log('   [\n        "' + name1 + '",\n        "' + name2 + '"\n    ],');
    }

    return false;
}

function mergeTests(tests) {
    ret = tests[0];
    if (tests.length > 1) {
        // console.log("Merging " + tests.length + " tests:");
    }
    for (const test of tests) {
        if (tests.length > 1) {
            // console.log(" * " + test.name);
        }
        if (test != ret) {
            ret.id = ret.id || test.id;
            ret.logisticRegression = ret.logisticRegression || test.logisticRegression;
            ret.pei = ret.pei || test.pei;
            ret.selftest = ret.selftest || test.selftest;
            ret.instructionsUrl = ret.instructionsUrl || test.instructionsUrl;
            ret.sample = [ ...(ret.sample || []), ... (test.sample || []) ].filter(onlyUnique);
            ret.studies = { ...ret.studies, ... test.studies };
            ret.tradename = [ ... (ret.tradename || []), ... (test.tradename || []) ].filter(onlyUnique).sort(((a,b) => compareStrings(a.toLowerCase(), b.toLowerCase())));
            ret.distributors = [ ... (ret.distributors || []), ... (test.distributors || []) ].filter(onlyUnique).sort(((a,b) => compareStrings(a.toLowerCase(), b.toLowerCase())));
        }
    }
    delete ret.merged;
    return ret;
}

function fixId(test) {
    if (!test.id) {
        test.id = "NO-AT-" + (currentTestId++);
    }
    return test;
}

const csvAntigenTests = fs.readFileSync("../src_data/antigentests.csv", { encoding: "latin1" }).replace(/\u0099/g, "\u2122").replace(/\u0096/g, "\u002D");
const csvSelfTests = fs.readFileSync("../src_data/selftests.csv", { encoding: "latin1" }).replace(/\u0099/g, "\u2122").replace(/\u0096/g, "\u002D");
const csvEvaluation = fs.readFileSync("../src_data/evaluation.csv", { encoding: "utf8" });
const csvLogistic = fs.readFileSync("../src_data/logistic.csv", { encoding: "utf8" });
const jsonEvaluationNameMapping = JSON.parse(fs.readFileSync("../src_data/evaluation_name_mapping.json", { encoding: "utf8" }));
const jsonSampleMapping = JSON.parse(fs.readFileSync("../src_data/sample.json", { encoding: "utf8" }));
const jsonCompanyMapping = JSON.parse(fs.readFileSync("../src_data/company_mapping.json", { encoding: "utf8" }));
const jsonTestMapping = JSON.parse(fs.readFileSync("../src_data/test_mapping.json", { encoding: "utf8" }));

const jsonEvaluations = parse(csvEvaluation, {
    on_record: onEvaluationRecord,
    columns: getEvaluationColumnNames,
    delimiter: ";",
});

const jsonSelfTests = parse(csvSelfTests, {
    columns: getSelfTestColumnNames,
    on_record: onSelfTestRecord,
    skip_empty_lines: true,
    delimiter: ";",
});

const jsonAntigenTests = parse(csvAntigenTests, {
    columns: getAntigenTestColumnNames,
    on_record: onAntigenTestRecord,
    skip_empty_lines: true,
    delimiter: ";",
});

const jsonLogistic = parse(csvLogistic, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ";",
    on_record: onLogisticRecord,
});

allTests = [];
allTests.push(...jsonSelfTests);
allTests.push(...jsonAntigenTests);
allTests.push(...jsonEvaluations);
allTests.push(...jsonLogistic);
console.log("Added " + jsonSelfTests.length + " self tests, " + jsonEvaluations.length + " studies, " + jsonLogistic.length + " logistic regressions and " + jsonAntigenTests.length + " antigen tests, resulting in " + allTests.length + " tests.")

cleanupNames(allTests);


resultTests = [];

for (const test1 of allTests) {
    if(test1.merged) {
        continue
    }
    merge = [test1];
    test1.merged = true;
    for (const test2 of allTests) {
        if(test2.merged) {
            continue
        }
        if (companyNamesMatch(test1.manufacturer, test2.manufacturer) && test1 != test2) {
            if (testNamesMatch(test1.name, test2.name)) {
                merge.push(test2);
                test2.merged = true;
            }
        }        
    }
    resultTests.push(mergeTests(merge));
}

resultTests = resultTests.map(test => fixId(test));
resultTests.sort((a,b) => compareStrings(a.name, b.name));
resultTests.sort((a,b) => compareStrings(a.manufacturer, b.manufacturer));

console.log("Merged tests, remaining count is " + resultTests.length);

/*
let manufacturers = [];
for (const test of allTests) {
    manufacturers.push(test.manufacturer, ...test.distributors)
}

manufacturers = manufacturers.filter(onlyUnique);
manufacturers.sort();
for (const manufacturer of manufacturers) {
    console.log("'" + manufacturer + "'");
}
*/

// jsonAntigenTests.push(...getSelftestsWithoutId());

fs.writeFileSync("../site/public/data/antigentests.json", JSON.stringify(resultTests, null, 2));