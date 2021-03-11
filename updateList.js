const fs = require('fs');
const parse = require('csv-parse/lib/sync');

input = fs.readFileSync("antigentests.csv", {encoding: "latin1"});
selftests = JSON.parse(fs.readFileSync("selftests.json", {encoding: "utf8"}));

function getColumnNames(firstLine) {
    return firstLine.map(convertColumnName);
}

function convertColumnName(origName) {
    switch(origName) {
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

bools = {"Ja": true, "Nein":false,"":undefined};

function onRecord(record, context) {
    record.pei = bools[record.pei];
    record.sensitivity = {
        avg: parseFloat((record.sensitivityAvg + "").replace(",", ".")) / 100.0,
        min: parseFloat(record.sensitivityRange.split("-")[0]) / 100.0,
        max: parseFloat(record.sensitivityRange.split("-")[1]) / 100.0
    };
    record.specificity = {
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

    let matchingSelftests = selftests.filter(selftest => selftest.id == record.id);

    record.selftest = (matchingSelftests.length == 1);
    if (record.selftest) {
        record.shops = matchingSelftests[0].available;
    } else {
        record.shops = [];
    }

    return record;
}

const records = parse(input, {
  columns: getColumnNames,
  skip_empty_lines: true,
  delimiter: ";",
  on_record: onRecord,
});

console.log(records);

fs.writeFileSync("antigentests.json", JSON.stringify(records, null, 2));