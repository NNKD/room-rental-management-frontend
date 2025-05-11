export interface ApartmentListItem {
    id: number;
    name: string;
    slug: string;
    brief: string;
    price: number;
    image: string;
}

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
}

export interface ApartmentTypeManagementType {
    id: number;
    name: string;
    slug?: string;
}