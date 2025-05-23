


/*
    T is data type Ex: ApartmentManagementType, ApartmentTypeManagementType, ...
    slug: field name of T
 */

export interface TableHeader<T> {
    name: string;
    slug: keyof T;
    sortASC?: boolean;
}

export interface ApartmentManagementType {
    id: number;
    number: number;
    type?: string;
    status?: string;
    bathroom: number;
    bedroom: number;
}

export interface ApartmentTypeManagementType {
    id: number;
    name: string;
    area: number;
    price: string;
}