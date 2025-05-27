/*
    T is data type Ex: ApartmentManagementType, ApartmentTypeManagementType, ...
    slug: field name of T
    sortASC = true => has sort in column
    width: width of column (percent %). Ex: width: 10, ...
    center = true => data text center
 */

export interface TableHeader<T> {
    name: string;
    slug: keyof T;
    sortASC?: boolean;
    width?: number;
    center?: boolean;
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
export interface ApartmentPriceServiceType {
    id: number;
    name: string;
    description: string;
    price: number;
    unit: string;
}

export interface ServiceType {
    id: number;
    name: string;
    description: string;
    price: string;
    unit: string;
}