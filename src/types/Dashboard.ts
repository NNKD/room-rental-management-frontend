import {JSX, ReactNode} from "react";

export interface TableHeader<T> {
    name: string;
    slug: keyof T;
    sortASC?: boolean;
    center?: boolean;
    isCurrency?: boolean;
    render?: (row: T) => string | JSX.Element;
}
export interface RentalContractResponse {
    id: number;
    name: string;
    description?: string;
    price: number;
    status: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    userId: number;
    fullname: string;
    phone: string;
    email: string;
    apartmentId: number;
}

export interface UserResponse {
    id: number;
    email: string;
    username: string;
    fullname: string;
    phone: string;
    role: number;
    totalRentalContracts: number;
}

export interface ApartmentListResponse {
    id: number;
    name: string;
    slug: string;
    type: string;
    bedroom: number;
    price: number;
}

export interface ApartmentManagementType {
    id?: number;
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
    information: ApartmentInformationDTO;
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
    id?: number;
    url: string;
}

export interface ServiceDTO {
    id: number;
    name: string;
    description: string;
    price: number;
    rawPrice: number;
    unit: string;
}

export interface UserManagementDTO {
    id: number;
    email: string;
    username: string;
    fullname: string;
    phone: string;
    role: number;
    totalRentalContracts: number;
}

export interface ServiceDetailDTO {
    name: string;
    quantity: number;
    price: number;
    totalPrice: number;
}

export interface BillResponseDTO {
    id: number;
    name: string;
    rentalAmount: number;
    serviceDetails: ServiceDetailDTO[];
    totalAmount: number;
    createdAt: string;
    dueDate: string;
    status: string;
}
export interface ApartmentDetailDashboardType {
    id: number;
    name: string;
    description: string;
    price: string; // Đã format bằng formatCurrency
    type: string;
    status: string;
    user: string | null;
    images: string[];
    services: {
        name: string;
        price: string; // Đã format bằng formatCurrency
        unit: string;
    }[];
}