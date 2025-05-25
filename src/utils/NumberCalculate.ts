export const formatCurrency = (price : number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
}

export const calPriceDiscount = (price: number, discount_percent: number) => {
    return price * (1 - discount_percent/100);
}