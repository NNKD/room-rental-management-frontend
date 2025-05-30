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

// Có trùng, sửa lại sau
export interface ApartmentDTO {
    id?: number;
    name: string;
    slug: string;
    brief: string;
    description: string;
    hot: number;
    price: number;
    type: ApartmentTypeDTO;
    status: ApartmentStatusDTO;
    discounts: ApartmentDiscountDTO[];
    images: ApartmentImageDTO[];
    information: ApartmentInformationDTO
}

export interface ApartmentInformationDTO {
    id?: number;
    width: number;
    height: number;
    floor: number;
    balcony: number;
    terrace: number;
    furniture: string;
    bedrooms: number;
    kitchens: number;
    bathrooms: number;
}

export interface ApartmentTypeDTO {
    id?: number;
    name: string;
    description: string;

}

export interface ApartmentStatusDTO {
    id?: number;
    name: string;
}

export interface ApartmentDiscountDTO {
    id?: number;
    discount_percent: number;
    duration_month: number;
}

export interface ApartmentImageDTO {
    id: number;
    url: string;
}


