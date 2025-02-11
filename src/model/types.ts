export interface Company {
    companyName: string;
    registrationNumber: string | undefined;
    registeredAddress: string;
    active: boolean;
    type: string;
    incorporatedOn: Date;
}

export interface ForeignCompany extends Company {
    countryOfOrigin: string;
};

export interface LimitedCompany extends Company {
    numberOfShares: number;
    plc: boolean;
};

export interface LimitedLiabilityPartnership extends Company {
    numberOfPartners: number;
};

export interface NonProfitOrganisation extends Company {};