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
