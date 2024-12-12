import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3023;

// figuring out .env file

const apiKey = "";
const apiURL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// object includes name of base currency, name of comparison currency, base rate, comparison rate
let comparison = {
    compareName1: '',
    compareName2: '',
    compare1: 0,
    compare2: 0,
    compareAmount: 0
}

// function to find the comparison
function compareEquation(rate1, rate2, amount) {
    const baseAmount = amount / rate1;
    const comparedAmount = baseAmount * rate2;
    return [amount, comparedAmount];
}

app.get("/", async (req, res) => {
    try {
      const result = await axios.get(apiURL);
      let arrayTopTen = [
        // place, name, rate
        { place: "United States of America", name: "USD", rate: result.data.conversion_rates.USD },
        { place: "European Union", name: "EUR", rate: result.data.conversion_rates.EUR },
        { place: "Japan", name: "JPY", rate: result.data.conversion_rates.JPY },
        { place: "United Kingdom", name: "GBP", rate: result.data.conversion_rates.GBP },
        { place: "People's Republic of China", name: "CNY", rate: result.data.conversion_rates.CNY },
        { place: "Australia", name: "AUD", rate: result.data.conversion_rates.AUD },
        { place: "Canada", name: "CAD", rate: result.data.conversion_rates.CAD },
        { place: "Switzerland & Liechtenstein", name: "CHF", rate: result.data.conversion_rates.CHF },
        { place: "Hong Kong", name: "HKD", rate: result.data.conversion_rates.HKD },
        { place: "Republic of Singapore", name: "SGD", rate: result.data.conversion_rates.SGD }
    ];

    // array of all exchange rates with USD
    let arrayOfAll = [];
    // get data add the iso code, rate, and country to the array
    Object.entries(result.data.conversion_rates).forEach(function([key, value]) {
        const country = currencyToCountry[key] || "Unknown Country";
        arrayOfAll.push({ currencyCode: key, rate: value, country: country });
    });
    
    let compareArray = compareEquation(comparison.compare1, comparison.compare2, comparison.compareAmount);
    compareArray.push(comparison.compareName1);
    compareArray.push(comparison.compareName2);
    
    res.render("index.ejs", { 
        data: result.data, 
        arrayTopTen: arrayTopTen,
        compareArray: compareArray,
        arrayOfAll: arrayOfAll
    });
    } catch (error) {
      console.error("Failed to make request:", error.message);
      res.render("index.ejs", {
        error: error.message,
      });
    }
});

app.post("/compare", async (req, res) => {
    try {
        const result = await axios.get(apiURL)
        let arrayTopTen = [
            // most common place(s) of utilization, iso code, exchange rate
            { place: "United States of America", name: "USD", rate: result.data.conversion_rates.USD },
            { place: "European Union", name: "EUR", rate: result.data.conversion_rates.EUR },
            { place: "Japan", name: "JPY", rate: result.data.conversion_rates.JPY },
            { place: "United Kingdom", name: "GBP", rate: result.data.conversion_rates.GBP },
            { place: "People's Republic of China", name: "CNY", rate: result.data.conversion_rates.CNY },
            { place: "Australia", name: "AUD", rate: result.data.conversion_rates.AUD },
            { place: "Canada", name: "CAD", rate: result.data.conversion_rates.CAD },
            { place: "Switzerland & Liechtenstein", name: "CHF", rate: result.data.conversion_rates.CHF },
            { place: "Hong Kong Special Administrative Region", name: "HKD", rate: result.data.conversion_rates.HKD },
            { place: "Republic of Singapore", name: "SGD", rate: result.data.conversion_rates.SGD }
        ];

        // comparison object includes: base currency, comparison, and each of the names
        comparison.compareName1 = arrayTopTen[parseInt(req.body["compare-1"])].name;
        comparison.compareName2 = arrayTopTen[parseInt(req.body["compare-2"])].name;
        comparison.compare1 = arrayTopTen[parseInt(req.body["compare-1"])].rate;
        comparison.compare2 = arrayTopTen[parseInt(req.body["compare-2"])].rate;
        comparison.compareAmount = req.body["compare-amount"];
        
        // redirect afterwards
        res.redirect("/");
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
            error: error.message,
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const currencyToCountry = {
    USD: "United States",
    AED: "United Arab Emirates",
    AFN: "Afghanistan",
    ALL: "Albania",
    AMD: "Armenia",
    ANG: "Netherlands Antilles",
    AOA: "Angola",
    ARS: "Argentina",
    AUD: "Australia",
    AWG: "Aruba",
    AZN: "Azerbaijan",
    BAM: "Bosnia and Herzegovina",
    BBD: "Barbados",
    BDT: "Bangladesh",
    BGN: "Bulgaria",
    BHD: "Bahrain",
    BIF: "Burundi",
    BMD: "Bermuda",
    BND: "Brunei",
    BOB: "Bolivia",
    BRL: "Brazil",
    BSD: "Bahamas",
    BTN: "Bhutan",
    BWP: "Botswana",
    BYN: "Belarus",
    BZD: "Belize",
    CAD: "Canada",
    CDF: "Democratic Republic of the Congo",
    CHF: "Switzerland",
    CLP: "Chile",
    CNY: "China",
    COP: "Colombia",
    CRC: "Costa Rica",
    CUP: "Cuba",
    CVE: "Cape Verde",
    CZK: "Czech Republic",
    DJF: "Djibouti",
    DKK: "Denmark",
    DOP: "Dominican Republic",
    DZD: "Algeria",
    EGP: "Egypt",
    ERN: "Eritrea",
    ETB: "Ethiopia",
    EUR: "Eurozone",
    FJD: "Fiji",
    FKP: "Falkland Islands",
    FOK: "Faroe Islands",
    GBP: "United Kingdom",
    GEL: "Georgia",
    GGP: "Guernsey",
    GHS: "Ghana",
    GIP: "Gibraltar",
    GMD: "Gambia",
    GNF: "Guinea",
    GTQ: "Guatemala",
    GYD: "Guyana",
    HKD: "Hong Kong",
    HNL: "Honduras",
    HRK: "Croatia",
    HTG: "Haiti",
    HUF: "Hungary",
    IDR: "Indonesia",
    ILS: "Israel",
    IMP: "Isle of Man",
    INR: "India",
    IQD: "Iraq",
    IRR: "Iran",
    ISK: "Iceland",
    JEP: "Jersey",
    JMD: "Jamaica",
    JOD: "Jordan",
    JPY: "Japan",
    KES: "Kenya",
    KGS: "Kyrgyzstan",
    KHR: "Cambodia",
    KID: "Kiribati",
    KMF: "Comoros",
    KRW: "South Korea",
    KWD: "Kuwait",
    KYD: "Cayman Islands",
    KZT: "Kazakhstan",
    LAK: "Laos",
    LBP: "Lebanon",
    LKR: "Sri Lanka",
    LRD: "Liberia",
    LSL: "Lesotho",
    LYD: "Libya",
    MAD: "Morocco",
    MDL: "Moldova",
    MGA: "Madagascar",
    MKD: "North Macedonia",
    MMK: "Myanmar",
    MNT: "Mongolia",
    MOP: "Macau",
    MRU: "Mauritania",
    MUR: "Mauritius",
    MVR: "Maldives",
    MWK: "Malawi",
    MXN: "Mexico",
    MYR: "Malaysia",
    MZN: "Mozambique",
    NAD: "Namibia",
    NGN: "Nigeria",
    NIO: "Nicaragua",
    NOK: "Norway",
    NPR: "Nepal",
    NZD: "New Zealand",
    OMR: "Oman",
    PAB: "Panama",
    PEN: "Peru",
    PGK: "Papua New Guinea",
    PHP: "Philippines",
    PKR: "Pakistan",
    PLN: "Poland",
    PYG: "Paraguay",
    QAR: "Qatar",
    RON: "Romania",
    RSD: "Serbia",
    RUB: "Russia",
    RWF: "Rwanda",
    SAR: "Saudi Arabia",
    SBD: "Solomon Islands",
    SCR: "Seychelles",
    SDG: "Sudan",
    SEK: "Sweden",
    SGD: "Singapore",
    SHP: "Saint Helena",
    SLE: "Sierra Leone",
    SLL: "Sierra Leone",
    SOS: "Somalia",
    SRD: "Suriname",
    SSP: "South Sudan",
    STN: "São Tomé and Príncipe",
    SYP: "Syria",
    SZL: "Eswatini",
    THB: "Thailand",
    TJS: "Tajikistan",
    TMT: "Turkmenistan",
    TND: "Tunisia",
    TOP: "Tonga",
    TRY: "Turkey",
    TTD: "Trinidad and Tobago",
    TVD: "Tuvalu",
    TWD: "Taiwan",
    TZS: "Tanzania",
    UAH: "Ukraine",
    UGX: "Uganda",
    UYU: "Uruguay",
    UZS: "Uzbekistan",
    VES: "Venezuela",
    VND: "Vietnam",
    VUV: "Vanuatu",
    WST: "Samoa",
    XAF: "Central African CFA Franc",
    XCD: "East Caribbean Dollar",
    XDR: "International Monetary Fund",
    XOF: "West African CFA Franc",
    XPF: "CFP franc",
    YER: "Yemen",
    ZAR: "South Africa",
    ZMW: "Zambia",
    ZWL: "Zimbabwe"
};