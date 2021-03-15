const apiEndpoint = "https://api.corona-zahlen.org";
// 7 days should be enough, but sometimes the API returns fewer entries then requested
// also, there seems to be about 15% underreporting for the latest day, which we bypass by using 
// data that is one day older
const apiGermany = "/germany/history/incidence/8"; 
const apiStates = "/states/history/incidence/8";
const apiDistricts = "/districts/history/incidence/8";

const HelloVueApp = {
    data() {
        return {
            // showing any symtomps that might lead to PCR testing in Germany 
            // increases odds by 18.8, which is based on some very rough 
            // calculations based on data from the end of february
            anySymptomFactor: 18.8,

            // user selections
            testId: null,
            stateId: null,
            districtId: null,
            testsKind: "self",
            incidenceSource: "germany",
            riskProfilePrivate: "1.0",
            riskProfileProfessional: "0.8",
            additionalRiskString: "0",
            confidence: "avg",
            intermediate: false,
            studyId: "manufacturer",

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

            // Data from own JSON
            tests: [],
            // Data from third party API JSON
            germany: null,
            states: [],
            districts: [],

            // not actually data
            percentFormatter: null,
            numberFormatter: null,
        }
    },
    created() {
        this.percentFormatter = new Intl.NumberFormat('de-DE', { style: 'percent', minimumSignificantDigits: 2, maximumSignificantDigits: 4 });
        this.numberFormatter = new Intl.NumberFormat('de-DE', { style: 'decimal', minimumFractionDigits: 1, maximumFractionDigits: 1 });
        this.fetchData();
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

            fetch('./antigentests.json')
                .then(response => response.json())
                .then(data => {
                    this.tests = data;
                    this.tests.sort(byId);
                })
                .catch(error => console.log(error));
            fetch(apiEndpoint + apiGermany)
                .then(response => response.json())
                .then(root => {
                    console.log("German root: " + root);
                    this.germany = root.data;
                })
                .catch(error => console.log(error));
            fetch(apiEndpoint + apiStates)
                .then(response => response.json())
                .then(root => {
                    this.states = Object.values(root.data).sort(byName);
                })
                .catch(error => console.log(error));
            fetch(apiEndpoint + apiDistricts)
                .then(response => response.json())
                .then(root => {
                    this.districts = Object.values(root.data).sort(byName);
                })
                .catch(error => console.log(error));;
        },
        formatPercent(value) {
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
    },
    watch: {
         "selectedTest" : function (newVal, oldVal){
             if (newVal != oldVal) {
                 this.studyId = Object.values(newVal.studies).filter(study => study.author == "manufacturer")[0].id;
             }
         }
     },
    computed: {
        visibleTests() {
            if (this.tests && this.testsKind == "self") {
                return this.tests.filter(test => test.selftest);
            } else if (this.tests && this.testsKind == "pei") {
                return this.tests.filter(test => test.pei);
            } else {
                return this.tests;
            }
        },
        studies() {
            if (this.selectedTest) {
                return this.selectedTest.studies;
            }
            return [];
        },
        selectedTest() {
            if (this.testId) {
                let matchingTests = this.tests.filter(t => t.id == this.testId);
                if (matchingTests.length == 1) {
                    return matchingTests[0];
                }
            }
            return null;
        },
        sensitivity() {
            if (this.testsKind == "input") {
                return parseFloat(this.sensitivityString.replace(",", ".").replace("%", "")) / 100.0;
            } else {
                if (this.selectedTest && this.selectedTest.studies[this.studyId]) {
                    return this.selectedTest.studies[this.studyId].sensitivity[this.confidence];
                } else {
                    return 0.8;
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
                    return 0.8;
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
                console.log("Germany: " + JSON.stringify( this.germany));
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
            if (this.fpr > 0)
                return this.sensitivity / this.fpr;
            else
                return 9999;
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
            return this.sympSmell || this.sympTaste || this.sympFever || this.sympCough || this.sympWheez || this.sympChest || this.sympOther;
        },
        ruleScore() {
            let score = 0.0;
            if (this.sympSmell || this.sympTaste) score +=  2;
            if (this.sympFever && this.sympCough) score +=  1;
            if (this.sympWheez || this.sympChest) score += -1;
            return score;
        },
        ruleLR() {
            switch(this.ruleScore) {
                case  3: return 15.0;
                case  2: return  4.2;
                case  1: return  1.2;
                case  0: return  0.7;
                case -1: return  0.1;
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
    }
}

Vue.createApp(HelloVueApp).mount('#hello-vue')