import express from 'express';
import path from 'path';
import nunjucks from 'nunjucks';
import * as process from "node:process";

import { getCompanies, setupCompany } from './lib/requests';
import type { Company } from './model/types';

const app = express();
const port = Number.parseInt(process.env.PORT || "3000");
const host = process.env.HOST || '0.0.0.0';

// Setup Nunjucks templating engine
nunjucks.configure(
    ['node_modules/govuk-frontend/dist', 'views'],
    {
        autoescape: true,
        express: app,
        watch: true
    }
);

app.set('view engine', 'njk'); //tell express that we're using the Nunjucks view engine

// Middleware: this is necessary to parse request body, otherwise it remains undefined
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files from GOV.UK Frontend
app.use('/govuk', express.static(path.join('node_modules', 'govuk-frontend', 'dist', 'govuk')));
app.use('/assets', express.static(path.join('node_modules', 'govuk-frontend', 'dist', 'govuk', 'assets')));

// Include custom assets if needed
app.use(express.static('public'));

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
        const companies = await getCompanies();
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
    } catch (error) {
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

        const newCompany: Company = {
            companyName: req.body.companyName,
            registrationNumber: "999999999",
            registeredAddress: req.body.addressTown,
            active: isActive,
            incorporatedOn: new Date(),
        };

        console.log('New company: ', newCompany);

        await setupCompany(newCompany);
        res.redirect('/companies');

    } catch(error) {
        console.error("Error adding company", error);
        res.status(500).send("OH NO - Internal server error")

    }
});

// Start the server
app.listen(port, host, () => {
    console.log(`Application is running on http://${host}:${port}`);
});
