export interface Company {
    id: string;
    name: string;
    dashboard_url?: string;
}

export interface CompanyCreate {
    name: string;
    dashboard_url?: string;
}
