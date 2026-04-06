import {Company} from "@/types/company";

export interface Account {
    id: string;
    company: Company;
    company_identifier: string;
    size_k: number;
    balance?: number;
    active: boolean;
}