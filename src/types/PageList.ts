export interface PageType<T> {
    list: T[]
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}