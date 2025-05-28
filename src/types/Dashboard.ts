import {ReactNode} from "react";

/*
    T is data type Ex: ApartmentManagementType, ApartmentTypeManagementType, ...
    slug: field name of T
    sortASC = true => has sort in column
    center = true => data text center
    isCurrency = true => formatNumberCurrency(data)
 */
export interface TableHeader<T> {
    name: string;
    slug: keyof T;
    sortASC?: boolean;
    center?: boolean;
    isCurrency?: boolean;
}

export interface ApartmentManagementType {
    name: string;
    slug: ReactNode;
    price: number;
    type: string;
    status: string;
    user: ReactNode;
    userEmail: string;
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