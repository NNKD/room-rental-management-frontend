
export interface ApartmentListItem {
    id: number;
    name: string;
    slug: string;
    brief: string;
    price: number;
    image: string;
}
export interface ApartmentResponse {
    id: number;
    name: string;
    slug: string;
    brief: string;
    description: string;
    hot: number;
    price: number;
    typeId: number;
    statusId: number;
    image?: string; // Nếu backend có trả về image
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