const apiEndpoint = "https://api.corona-zahlen.org";
const apiGermany = "/germany/history/incidence/8";
const apiStates = "/states";
const apiDistricts = "/districts";

const HelloVueApp = {
    data() {
        return {
            // user selections
            testId: null,
            stateId: null,
            districtId: null,
            testsKind: "self",
            incidenceSource: "germany",
            riskProfilePrivate: "1.0",
            riskProfileProfessional: "0.8",

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
            };

            fetch('./antigentests.json')
                .then(response => response.json())
                .then(data => this.tests = data)
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
                return test.name + " 🛒 (erhältlich bei " + test.shops.join(", ") + ")";
            }
            return test.name;
        },
    },
    /* watch: {
         "selectedTest" : function (val){
             if (val) {
                 this.sensitivity = val.sensitivity.avg;
                 this.specificity = val.specificity.avg;
             }
         }
     }, */
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
                if (this.selectedTest) {
                    return this.selectedTest.sensitivity.avg;
                } else {
                    return 0.8;
                }
            }
        },
        specificity() {
            if (this.testsKind == "input") {
                return parseFloat(this.specificityString.replace(",", ".").replace("%", "")) / 100.0;
            } else {
                if (this.selectedTest) {
                    return this.selectedTest.specificity.avg;
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
                return this.selectedState.weekIncidence;
            } else if (this.incidenceSource == "district" && this.selectedDistrict) {
                return this.selectedDistrict.weekIncidence;
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
                return this.selectedState.weekIncidence;
            } else if (this.incidenceSource == "district" && this.selectedDistrict) {
                return this.selectedDistrict.weekIncidence;
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
            return this.incidenceAdjusted / 100000.0 * (parseFloat(this.riskProfilePrivate) + parseFloat(this.riskProfileProfessional)) / 1.8;
        },
        updatedProbPos() {
            let priorOdds = this.priorProb / (1.0 - this.priorProb);
            let updatedOddsPos = priorOdds * this.bayesFactorPos;
            return updatedOddsPos / (1.0 + updatedOddsPos);
        },
        updatedProbNeg() {
            let priorOdds = this.priorProb / (1.0 - this.priorProb);
            let updatedOddsNeg = priorOdds * this.bayesFactorNeg;
            return updatedOddsNeg / (1.0 + updatedOddsNeg);
        },
    }
}

Vue.createApp(HelloVueApp).mount('#hello-vue')