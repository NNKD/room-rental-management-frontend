export interface ApartmentListItem {
    id: number;
    name: string;
    slug: string;
    brief: string;
    price: number;
    images: ApartmentImage[];
}

export interface ApartmentImage {
    url: string;
}

export interface ApartmentDiscount {
    discount_percent: number;
    duration_month: number;
}

export interface ApartmentDetailType {
    name: string;
    slug: string;
    brief: string;
    description: string;
    price: number;
    width: number;
    height: number;
    floor: number;
    balcony: number;
    terrace: number;
    furniture: string;
    bedrooms: number;
    kitchens: number;
    bathrooms: number;
    type: string;
    discounts: ApartmentDiscount[];
    images: ApartmentImage[];
}

export interface UserApartmentDetailType {
    rentalContractName: string;
    rentalContractPrice: number;
    rentalContractStatus: string;
    rentalContractStartDate: string;
    rentalContractEndDate: string;
    rentalContractCreatedAt: string;
    apartmentName: string;
    apartmentType: string;
    apartmentFloor: number;
    apartmentWidth: number;
    apartmentHeight: number;
    apartmentBalcony: number;
    apartmentTerrace: number;
    userFullName: string;
    userPhone: string;
    userEmail: string;
}