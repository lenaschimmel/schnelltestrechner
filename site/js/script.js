// 7 days should be enough, but sometimes the API returns fewer entries then requested
// also, there seems to be about 15% underreporting for the latest day, which we bypass by using 
// data that is one day older
// const apiEndpoint = "https://api.corona-zahlen.org";
// const apiGermany = "/germany/history/incidence/8";
// const apiStates = "/states/history/incidence/8";
// const apiDistricts = "/districts/history/incidence/8";
const apiGermany = "/data/germany.json";
const apiStates = "/data/states.json";
const apiDistricts = "/data/districts.json";
const apiTests = "/data/antigentests.json";


const RapidTestVueApp = {
    el: '#rapidtest',
    vuetify: new Vuetify({
        icons: {
            iconfont: 'mdi', // default - only for display purposes
        },
    }),
    data() {
        return {
            // showing any symtomps that might lead to PCR testing in Germany 
            // increases odds by 18.8, which is based on some very rough 
            // calculations based on data from the end of february
            anySymptomFactor: 18.8,

            // user selections
            selectedTests: [],
            compareTests: [],
            stateId: null,
            districtId: null,
            incidenceSource: "germany",
            riskProfilePrivate: "1.0",
            riskProfileProfessional: "0.8",
            additionalRiskString: "0",
            confidence: "avg",
            intermediate: false,
            studyId: "manufacturer",
            testsKind: "list",
            testFilterSelf: true,
            testFilterPei: false,
            testFilterStudies: false,

            compareFilterSelf: false,
            compareFilterPei: false,
            compareFilterStudies: false,
            compareFilterSelected: false,

            scrolledToBottom: false,
            expandedPanelsCalc: [0, 1],
            expandedPanelsCompare: [1],
            expandedPanelsInfo: [0, 1],
            expandedPanelsImprint: [0, 1, 2, 3],
            tab: null,

            // symptoms
            sympSmell: false,
            sympTaste: false,
            sympFever: false,
            sympCough: false,
            sympChest: false,
            sympWheez: false,
            sympOther: false,

            // user inputs
            incidenceString: "100",
            sensitivityString: "80,0 %",
            specificityString: "80,0 %",
            testFilter: "",

            // Data from own JSON
            tests: [],
            // Data from third party API JSON
            germany: null,
            states: [],
            districts: [],

            // not actually data
            percentFormatter: null,
            numberFormatter: null,

            riskProfilesPrivate: [
                { "val": "1.0", "name": "Durchschnittliche Person" },
                { "val": "0.015", "name": "Lebt allein, Kontakte nur beim Einkaufen" },
                { "val": "0.3", "name": "Ein enger Kontakt mit unbekanntem Risiko" },
                { "val": "1.1", "name": "Vier enge Kontakte mit unbekanntem Risiko" },
                { "val": "2.5", "name": "Zehn enge Kontakte mit unbekanntem Risiko" },
                { "val": "15.0", "name": "Hat kürzlich eine Bar besucht" },
            ],
            riskProfilesProfessional: [
                { "val": "0.0", "name": "Home-Office, Arbeitslos, etc." },
                { "val": "0.1", "name": "Risikoarmer Beruf" },
                { "val": "0.4", "name": "Produktion" },
                { "val": "0.5", "name": "Verkauf" },
                { "val": "0.8", "name": "Büro" },
                { "val": "1.3", "name": "Kita / Kindergarten" },
                { "val": "1.8", "name": "Reinigungskraft" },
                { "val": "2.2", "name": "Grundschul-Lehrkraft" },
                { "val": "3.2", "name": "Pflege- und Gesundsheitsberuf" },
            ],
        }
    },
    created() {
        this.percentFormatter = new Intl.NumberFormat('de-DE', { style: 'percent', minimumSignificantDigits: 2, maximumSignificantDigits: 4 });
        this.numberFormatter = new Intl.NumberFormat('de-DE', { style: 'decimal', minimumFractionDigits: 1, maximumFractionDigits: 1 });
        window.addEventListener('scroll', this.handleScroll);
        this.fetchData();
        document.getElementById("rapidtest").classList.remove("hidden");
        document.getElementById("loading").classList.add("hidden");
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        fetchData() {
            // local sorting function
            byName = function (a, b) {
                // straigt from developer.mozilla.org
                var nameA = a.name.toUpperCase(); // Groß-/Kleinschreibung ignorieren
                var nameB = b.name.toUpperCase(); // Groß-/Kleinschreibung ignorieren
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            };
            byId = function (a, b) {
                if (a.id < b.id) {
                    return -1;
                }
                if (a.id > b.id) {
                    return 1;
                }
                return 0;
            };

            fetch(apiTests)
                .then(response => response.json())
                .then(data => {
                    this.tests = data;
                    this.tests.sort(byName);
                    // Disable tests which have no studies. This works, but usability is bad.
                    // this.tests = this.tests.map(test => { if (Object.keys(test.studies).length == 0) { test.disabled = true; } return test; });
                })
                .catch(error => console.log(error));
            fetch(apiGermany)
                .then(response => response.json())
                .then(root => {
                    this.germany = root.data;
                })
                .catch(error => console.log(error));
            fetch(apiStates)
                .then(response => response.json())
                .then(root => {
                    this.states = Object.values(root.data).sort(byName);
                })
                .catch(error => console.log(error));
            fetch(apiDistricts)
                .then(response => response.json())
                .then(root => {
                    this.districts = Object.values(root.data).sort(byName);
                })
                .catch(error => console.log(error));;
        },
        formatPercent(value) {
            // The percentFormatter will always display four significant digits. For very small values p,
            // percentFormatter.format(1-p) will already round up to "100%" while percentFormatter.format(p)
            // will still show 0.00000.. with many zeros, followed by four significant digits.
            // These small numbers are not practically useful, so let's round them down to 0 manually.
            // See the comment in bayesFactorPos() for a related issue.
            if (value < 0.0000015)
                return this.percentFormatter.format(0);
            else
                return this.percentFormatter.format(value);
        },
        formatNumber(value) {
            return this.numberFormatter.format(value);
        },
        getTestDisplayName(test) {
            if (test.shops && test.shops.length > 0) {
                return test.id + " - " + test.name + " 🛒 (erhältlich bei " + test.shops.join(", ") + ")";
            }
            return test.id + " - " + test.name;
        },
        getStudyDisplayName(study) {
            if (study.quadas) {
                return study.author + " (" + study.quadas + ")";
            } else if (study.author == "manufacturer")
                return "Herstellerangaben";
            else {
                return study.author;
            }
        },
        handleScroll() {
            this.scrolledToBottom = ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100);
        },
        getStudyColor(study) {

            if (study.author == "manufacturer") return "#1976D2";
            if (study.quadas == "low concern") return "#388E3C";
            if (study.quadas == "intermediate concern") return "#FBC02D";
            if (study.quadas == "high concern") return "#D32F2F";
            return "black";
        },
        getDataCircles(studiesObject) {
            numMax = function (num) {
                if (num > 9)
                    return "9-plus";
                else
                    return "" + num;
            }

            let studies = Object.values(studiesObject);
            let count = studies.length;
            let manCount = studies.filter(study => study.author.startsWith("manufacturer")).length;
            let lcCount = studies.filter(study => study.quadas == "low concern").length;
            let icCount = studies.filter(study => study.quadas == "intermediate concern").length;
            let hcCount = studies.filter(study => study.quadas == "high concern").length;
            let nonManCount = count - manCount;
            let ucCount = nonManCount - (lcCount + icCount + hcCount);
            let array = [];

            if (manCount > 0) array.push({ "icon": "mdi-alpha-h-circle", "color": "blue darken-2" });
            if (lcCount > 0) array.push({ "icon": "mdi-numeric-" + numMax(lcCount) + "-circle", "color": "green darken-2" });
            if (icCount > 0) array.push({ "icon": "mdi-numeric-" + numMax(icCount) + "-circle", "color": "yellow darken-2" });
            if (hcCount > 0) array.push({ "icon": "mdi-numeric-" + numMax(hcCount) + "-circle", "color": "red darken-2" });
            if (ucCount > 0) array.push({ "icon": "mdi-numeric-" + numMax(ucCount) + "-circle", "color": "black" });

            if (array.length == 0) array.push({ "icon": "mdi-numeric-0-circle-outline", "color": "grey darken-2" });

            return array;
        },
        getDataText(studiesObject) {
            let studies = Object.values(studiesObject);
            let count = studies.length;
            let manCount = studies.filter(study => study.author.startsWith("manufacturer")).length;
            let lcCount = studies.filter(study => study.quadas == "low concern").length;
            let icCount = studies.filter(study => study.quadas == "intermediate concern").length;
            let hcCount = studies.filter(study => study.quadas == "high concern").length;
            let nonManCount = count - manCount;
            let ucCount = nonManCount - (lcCount + icCount + hcCount);
            

            let text = "";

            if (manCount > 0) text += manCount + " Hersteller-Angabe(n) vorhanden. ";
            if (nonManCount > 0) text += nonManCount + " Studie(n), darunter ";
            if (lcCount > 0) text += lcCount + " mit hoher Qualität, ";
            if (icCount > 0) text += icCount + " mit mittlerer Qualität, ";
            if (hcCount > 0) text += hcCount + " mit geringer Qualität, ";
            if (ucCount > 0) text += ucCount + " mit unklarer Qualität, ";
            if (nonManCount > 0) text += " vorhanden.";

            if (text == "") text = "Keine Daten vorhanden.";

            return text;
        },
        getAttribCircles(test) {
            let array = [];
            if (!test.selftest) array.push({ "icon": "mdi-doctor", "color": "red darken-2" });
            if (test.selftest) array.push({ "icon": "mdi-account", "color": "green darken-2" });
            if (test.pei) array.push({ "icon": "mdi-certificate", "color": "blue darken-2" });
            if (test.shops && test.shops.length > 0) array.push({ "icon": "mdi-cart", "color": "purple darken-2" });

            return array;
        },
        getAttribText(test) {
            let text = "";

            if (!test.selftest) text += "Profi-Test. ";
            if (test.selftest) text += "Selbst-Test. ";
            if (test.pei) text += "Vom PEI evaluiert. ";
            if (test.shops && test.shops.length > 0) text += "Im Einzelhandel erhältlich bei: " + test.shops.join(", ");

            return text;
        },
        testMatchesFiler(test) {
            if (this.testFilterSelf && !test.selftest)
                return false;

            if (this.testFilterPei && !test.pei)
                return false;

            let textMatch = false;
            let filter = this.testFilter.toLowerCase();
            if (this.testFilter == "") {
                textMatch = true;
            } else {
                textMatch |= (test.reference && test.reference.toLowerCase().includes(filter));
                textMatch |= (test.id && test.id.toLowerCase().includes(filter));
                textMatch |= (test.name && test.name.toLowerCase().includes(filter));
                textMatch |= (test.manufacturer && test.manufacturer.toLowerCase().includes(filter));
                textMatch |= (test.tradename && test.tradename.some(t => t.toLowerCase().includes(filter)));
                textMatch |= (test.distributors && test.distributors.some(t => t.toLowerCase().includes(filter)));
            }

            return textMatch;
        },
        testMatchesCompareFiler(test) {
            if (this.compareFilterSelf && !test.selftest)
                return false;

            if (this.compareFilterPei && !test.pei)
                return false;

            if (this.compareFilterStudies && ! Object.values(test.studies).some(study => study.author != "manufacturer"))
                return false;

            if (this.compareFilterSelected && !this.compareTests.includes(test))
                return false;

            return true;
        },
        studyTitle(study) {
            if (study.author == "manufacturer") {
                if (study.comment && study.comment.length > 0)
                    return "Angaben des Herstellers (" + study.comment + ")";
                else
                    return "Angaben des Herstellers";
            } else {
                if (study.comment && study.comment.length > 0)
                    return "Studie von " + study.author + ", (" + study.comment + ", n = " + study.sampleSize + ", " + study.quadas + ")";
                else
                    return "Studie von " + study.author + ", (n = " + study.sampleSize + ", " + study.quadas + ")";
            }
        }
    },
    watch: {
        "selectedTest": function (newVal, oldVal) {
            if (newVal == null) {
                this.studyId = null;
            } else if (newVal != oldVal) {
                let studies = Object.values(newVal.studies).filter(study => study.author == "manufacturer");
                if (studies.length > 0)
                    this.studyId = studies[0].id;
                else
                    this.studyId = null;
            }
        }
    },
    computed: {
        selectedTest() {
            if (this.selectedTests.length > 0)
                return this.selectedTests[0];
            else
                return null;
        },
        visibleTests() {
            if (!this.tests)
                return [];

            return this.tests.filter(test => this.testMatchesFiler(test));
        },
        visibleCompareTests() {
            if (!this.tests)
                return [];

            return this.tests.filter(test => this.testMatchesCompareFiler(test));
        },
        studies() {
            if (this.selectedTest) {
                return Object.values(this.selectedTest.studies);
            }
            return [];
        },
        sensitivity() {
            if (this.testsKind == "input") {
                return parseFloat(this.sensitivityString.replace(",", ".").replace("%", "")) / 100.0;
            } else {
                if (this.selectedTest && this.selectedTest.studies[this.studyId]) {
                    return this.selectedTest.studies[this.studyId].sensitivity[this.confidence];
                } else {
                    return Number.NaN;
                }
            }
        },
        specificity() {
            if (this.testsKind == "input") {
                return parseFloat(this.specificityString.replace(",", ".").replace("%", "")) / 100.0;
            } else {
                if (this.selectedTest && this.selectedTest.studies[this.studyId]) {
                    return this.selectedTest.studies[this.studyId].specificity[this.confidence];
                } else {
                    return Number.NaN;
                }
            }
        },
        selectedState() {
            if (this.stateId) {
                return this.states.filter(s => s.id == this.stateId)[0];
            } else {
                return null;
            }
        },
        selectedDistrict() {
            if (this.districtId) {
                return this.districts.filter(d => d.ags == this.districtId)[0];
            } else {
                return null;
            }
        },
        incidence() {
            if (this.incidenceSource == "input") {
                return parseFloat(this.incidenceString.replace(",", "."));
            } else if (this.incidenceSource == "germany" && this.germany) {
                return this.germany[6].weekIncidence;
            } else if (this.incidenceSource == "state" && this.selectedState) {
                return this.selectedState.history[6].weekIncidence;
            } else if (this.incidenceSource == "district" && this.selectedDistrict) {
                return this.selectedDistrict.history[6].weekIncidence;
            } else {
                return 0.0;
            }
        },
        incidencePrev() {
            if (this.incidenceSource == "input") {
                return parseFloat(this.incidenceString.replace(",", "."));
            } else if (this.incidenceSource == "germany" && this.germany) {
                return this.germany[0].weekIncidence;
            } else if (this.incidenceSource == "state" && this.selectedState) {
                return this.selectedState.history[0].weekIncidence;
            } else if (this.incidenceSource == "district" && this.selectedDistrict) {
                return this.selectedDistrict.history[0].weekIncidence;
            } else {
                return 0.0;
            }
        },
        incidenceAdjusted() {
            // see https://www.microcovid.org/paper/7-basic-method step 3
            let delayFactor = this.incidence / this.incidencePrev;
            if (delayFactor > 2.0) delayFactor = 2.0;
            let underReportingFacotr = 5.0; // estimated to be between 4 and 6 by rki, see 
            // https://www.rki.de/DE/Content/Infekt/EpidBull/Archiv/2020/Ausgaben/50_20.pdf?__blob=publicationFile 
            // on page 3
            return this.incidence * underReportingFacotr * delayFactor;
        },
        fpr() {
            return 1.0 - this.specificity;
        },
        fnr() {
            return 1.0 - this.sensitivity;
        },
        bayesFactorPos() {
            // If the false positive rate is 0, the bayes facotr would be infinity. This will break other computetions later.
            // Using a hight, finite value kinda fixes it. We used to return 9999 here, which was so far from infinity that
            // the result was useless. Using 99,999,999 instead reduces the error so much that it disappears from the
            // result display due to rounding - at least for true-positives which will be 100%.
            // It would still show 0.0001444 % false-positives, which will not be rounded down to 0 because of the 
            // way small percentages are formatted (four significant digits).
            if (this.fpr > 0)
                return Math.min(99999999, this.sensitivity / this.fpr);
            else
                return 99999999;
        },
        bayesFactorNeg() {
            return this.fnr / this.specificity;
        },
        priorProb() {
            let riskFactors = (parseFloat(this.riskProfilePrivate) + parseFloat(this.riskProfileProfessional)) / 1.8;
            let additionalRisk = parseFloat(this.additionalRiskString) / 1000000.0;
            if (Number.isNaN(additionalRisk)) additionalRisk = 0.0;
            let prior = this.incidenceAdjusted / 100000.0 * riskFactors + additionalRisk;
            if (prior > 0.999) prior = 0.999; // 1.00 would give computational erros for updates probabilities
            return prior;
        },
        anySymptoms() {
            return this.sympSmell || this.sympTaste || this.sympFever || this.sympCough || this.sympWheez || this.sympChest || this.sympOther;
        },
        ruleScore() {
            let score = 0.0;
            if (this.sympSmell || this.sympTaste) score += 2;
            if (this.sympFever && this.sympCough) score += 1;
            if (this.sympWheez || this.sympChest) score += -1;
            return score;
        },
        ruleLR() {
            switch (this.ruleScore) {
                case 3: return 15.0;
                case 2: return 4.2;
                case 1: return 1.2;
                case 0: return 0.7;
                case -1: return 0.1;
            };
            return 0.0;
        },
        priorProbSymptoms() {
            let priorOdds = this.priorProb / (1.0 - this.priorProb);
            let updatedOddsPos = priorOdds;
            if (this.anySymptoms) {
                updatedOddsPos = priorOdds * this.ruleLR * this.anySymptomFactor;
            }
            return updatedOddsPos / (1.0 + updatedOddsPos);
        },
        updatedProbPos() {
            let priorOdds = this.priorProbSymptoms / (1.0 - this.priorProbSymptoms);
            let updatedOddsPos = priorOdds * this.bayesFactorPos;
            return updatedOddsPos / (1.0 + updatedOddsPos);
        },
        updatedProbNeg() {
            let priorOdds = this.priorProbSymptoms / (1.0 - this.priorProbSymptoms);
            let updatedOddsNeg = priorOdds * this.bayesFactorNeg;
            return updatedOddsNeg / (1.0 + updatedOddsNeg);
        },
        fixedFooter() {
            return this.$screen.height > 750;
        },
        resultValid() {
            return !Number.isNaN(this.priorProbSymptoms) && !Number.isNaN(this.sensitivity) && !Number.isNaN(this.specificity);
        },
        testSelectSuccess() {
            if (!Number.isNaN(this.sensitivity) && !Number.isNaN(this.specificity))
                return this.formatPercent(this.sensitivity) + ' Sensitivität, ' + this.formatPercent(this.specificity) + ' Spezifität';
            else
                return null;
        },
        testSelectError() {
            if (!Number.isNaN(this.sensitivity) && !Number.isNaN(this.specificity))
                return null;

            if (!this.selectedTest)
                return "Bitte einen Test auswählen";

            return "Keine Daten für diesen Test verfügbar";
        },
        tabs() {
            if (this.$vuetify.breakpoint.xsOnly)
                return [
                    { "id": "calc", "title": 'Rechner' },
                    { "id": "compare", "title": 'Vergleich' },
                    { "id": "info", "title": 'Infos' },
                    { "id": "imprint", "title": 'Impressum' },
                ];
            else
                return [
                    { "id": "calc", "title": 'Rechner' },
                    { "id": "compare", "title": 'Tests vergleichen' },
                    { "id": "info", "title": 'Weitere Infos' },
                    { "id": "imprint", "title": 'Impressum / Datenschutz' },
                ];
        },
        testHeaders() {
            if (this.$vuetify.breakpoint.xsOnly)
                return [
                    { text: 'Hersteller und Name', value: 'manufacturer_name' },
                    { text: 'Merkmale', value: 'attrib_and_studies', sortable: false },
                ]
            else
                return [
                    { text: 'Hersteller', value: 'manufacturer' },
                    { text: 'Name', value: 'name' },
                    { text: 'Merkmal', value: 'attrib', sortable: false },
                    { text: 'Daten', value: 'studies', sortable: false },
                ]
        },
        compareHeaders() {
            return [
                { text: 'Hersteller und Name', value: 'manufacturer_name' },
                { text: 'Sensitivität', value: 'sensitivity', sortable: false, width: "210px" },
                { text: 'Spezifität', value: 'specificity', sortable: false, width: "210px" },
            ]

        },
    }
}

var app = new Vue(RapidTestVueApp);
