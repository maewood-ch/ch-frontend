"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const process = __importStar(require("node:process"));
const requests_1 = require("./lib/requests");
const app = (0, express_1.default)();
const port = Number.parseInt(process.env.PORT || "3000");
const host = process.env.HOST || '0.0.0.0';
// Setup Nunjucks templating engine
nunjucks_1.default.configure(['node_modules/govuk-frontend/dist', 'views'], {
    autoescape: true,
    express: app,
    watch: true
});
app.set('view engine', 'njk'); //tell express that we're using the Nunjucks view engine
// Middleware: this is necessary to parse request body, otherwise it remains undefined
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Middleware to serve static files from GOV.UK Frontend
app.use('/govuk', express_1.default.static(path_1.default.join('node_modules', 'govuk-frontend', 'dist', 'govuk')));
app.use('/assets', express_1.default.static(path_1.default.join('node_modules', 'govuk-frontend', 'dist', 'govuk', 'assets')));
// Include custom assets if needed
app.use(express_1.default.static('public'));
// Home route for homepage
app.get('/', (req, res) => {
    res.render('index', {
        page: 'home',
        heading: 'Companies House Registry',
        description: 'A basic company registry for Companies House.'
    });
});
// Basic route for about
app.get('/about', (req, res) => {
    res.render('about', {
        page: "about",
        heading: 'The Companies House Junior Devs',
        description: 'Get to know the new team of Junior Devs at Companies House!'
    });
});
// Route for companies
app.get('/companies', async (req, res) => {
    try {
        const companies = await (0, requests_1.getCompanies)();
        let rows = companies.map(company => [
            { text: company.companyName },
            { text: company.registrationNumber },
            { text: company.active },
            { text: company.incorporatedOn },
        ]);
        res.render('companies', {
            page: "companies",
            heading: 'All Companies',
            description: 'A list of all the companies registered at Companies House.',
            rows: rows
        });
    }
    catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.get('/new', (req, res) => {
    res.render('new', {
        page: "new",
        heading: 'Add a new company',
        description: 'Register your company details with Companies House'
    });
});
// rooute to add new company
app.post('/companies', async (req, res) => {
    try {
        console.log("req.body", req.body);
        const isActive = req.body.active === "true" ? true : false;
        const newCompany = {
            companyName: req.body.companyName,
            registrationNumber: "999999999",
            registeredAddress: req.body.addressTown,
            active: isActive,
            incorporatedOn: new Date(),
        };
        console.log('New company: ', newCompany);
        await (0, requests_1.setupCompany)(newCompany);
        res.redirect('/companies');
    }
    catch (error) {
        console.error("Error adding company", error);
        res.status(500).send("OH NO - Internal server error");
    }
});
// Start the server
app.listen(port, host, () => {
    console.log(`Application is running on http://${host}:${port}`);
});
