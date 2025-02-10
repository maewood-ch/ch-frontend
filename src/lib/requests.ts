import type { Company, ForeignCompany, LimitedCompany, LimitedLiabilityPartnership, NonProfitOrganisation } from "../model/types";
import axios, { Axios, AxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:80/companies";
let config: AxiosRequestConfig<Company> = {
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
}

function validate(company: Company) {
    if (!company.companyName || !company.registrationNumber) {
        throw Error("Invalid company");
    }
}

export function getCompanies() {
    return axios.get<Company[]>("", config)
        .then(response => {
            let companies: Company[] = response.data;
            for (let company of companies) {
                validate(company);
            }
            return companies;
        })
        .catch(error => {
            console.error(error.message)
            throw error;
        });
}

export function getCompany(companyNumber: number) {
    if (companyNumber < 100000000 || companyNumber > 999999999) {
        return Promise.reject(new Error("Invalid company number"));
    }
    return axios.get<Company>(`/${companyNumber}`, config)
        .then(response => {
            let company: Company = response.data;
            validate(company);
            return company;
        })
        .catch(error => {
            console.error(error.message)
            throw error;
        });
}

export function setupCompany(company: Company) {
    company.registrationNumber = "";
    return axios.post<Company>("", company, config)
        .then(response => {
            let company: Company = response.data;
            validate(company);
            return company;
        })
        .catch(error => {
            console.error(error.message)
            throw error;
        });
}

export function modifyCompany(companyNumber: number, company: Company) {
    if (companyNumber < 100000000 || companyNumber > 999999999) {
        return Promise.reject(new Error("Invalid company number"));
    }
    return axios.put<Company>(`/${companyNumber}`, company, config)
        .then(response => {
            let company: Company = response.data;
            validate(company);
            return company;
        })
        .catch(error => {
            console.error(error.message)
            throw error;
        });
}

export function patchCompany(companyNumber: number, company: Company) {
    if (companyNumber < 100000000 || companyNumber > 999999999) {
        return Promise.reject(new Error("Invalid company number"));
    }
    return axios.put<Company>(`/${companyNumber}`, company, config)
        .then(response => {
            let company: Company = response.data;
            validate(company);
            return company;
        })
        .catch(error => {
            console.error(error.message)
            throw error;
        });
}

export function strikeOffCompany(companyNumber: number) {
    if (companyNumber < 100000000 || companyNumber > 999999999) {
        return Promise.reject(new Error("Invalid company number"));
    }
    return axios.delete<Company>(`/${companyNumber}`, config)
        .then(response => {

        })
        .catch(error => {
            console.error(error.message)
            throw error;
        });
}

// let company = getCompany(637399827)
// company.then(company => console.log(`Found company:\n${JSON.stringify(company, null, 2)}`));