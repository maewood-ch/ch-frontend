"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanies = getCompanies;
exports.getCompany = getCompany;
exports.setupCompany = setupCompany;
exports.modifyCompany = modifyCompany;
exports.patchCompany = patchCompany;
exports.strikeOffCompany = strikeOffCompany;
const axios_1 = __importDefault(require("axios"));
const BASE_URL = "http://localhost:80/companies";
let config = {
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
};
function validate(company) {
    if (!company.companyName || !company.registrationNumber) {
        throw Error("Invalid company");
    }
}
function getCompanies() {
    return axios_1.default.get("", config)
        .then(response => {
        let companies = response.data;
        for (let company of companies) {
            validate(company);
        }
        return companies;
    })
        .catch(error => {
        console.error(error.message);
        throw error;
    });
}
function getCompany(companyNumber) {
    if (companyNumber < 100000000 || companyNumber > 999999999) {
        return Promise.reject(new Error("Invalid company number"));
    }
    return axios_1.default.get(`/${companyNumber}`, config)
        .then(response => {
        let company = response.data;
        validate(company);
        return company;
    })
        .catch(error => {
        console.error(error.message);
        throw error;
    });
}
function setupCompany(company) {
    company.registrationNumber = "";
    return axios_1.default.post("", company, config)
        .then(response => {
        let company = response.data;
        validate(company);
        return company;
    })
        .catch(error => {
        console.error(error.message);
        throw error;
    });
}
function modifyCompany(companyNumber, company) {
    if (companyNumber < 100000000 || companyNumber > 999999999) {
        return Promise.reject(new Error("Invalid company number"));
    }
    return axios_1.default.put(`/${companyNumber}`, company, config)
        .then(response => {
        let company = response.data;
        validate(company);
        return company;
    })
        .catch(error => {
        console.error(error.message);
        throw error;
    });
}
function patchCompany(companyNumber, company) {
    if (companyNumber < 100000000 || companyNumber > 999999999) {
        return Promise.reject(new Error("Invalid company number"));
    }
    return axios_1.default.put(`/${companyNumber}`, company, config)
        .then(response => {
        let company = response.data;
        validate(company);
        return company;
    })
        .catch(error => {
        console.error(error.message);
        throw error;
    });
}
function strikeOffCompany(companyNumber) {
    if (companyNumber < 100000000 || companyNumber > 999999999) {
        return Promise.reject(new Error("Invalid company number"));
    }
    return axios_1.default.delete(`/${companyNumber}`, config)
        .then(response => {
    })
        .catch(error => {
        console.error(error.message);
        throw error;
    });
}
// let company = getCompany(637399827)
// company.then(company => console.log(`Found company:\n${JSON.stringify(company, null, 2)}`));
