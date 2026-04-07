import {Company} from "@/types/company";

export interface Account {
    id: string;
    company: Company;
    company_identifier: string;
    size_k: number;
    balance?: number;
    active: boolean;
}

// Type specifically for updates (flat, no nested company)
export interface AccountUpdate {
    company_identifier?: string;
    size_k?: number;
    balance?: number;
}

export interface AccountCreate {
    company_id:  string;
    company_identifier: string;
    size_k: number;
}