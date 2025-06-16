export function dateShort(today: Date) {
    return formatMonth(today) + " " + today.getDate() + ", " + today.getFullYear();
}

export function formatDate(today: Date) {
    return today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear();
}

export function formatMonth(today: Date) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[today.getMonth()];
    return month;
}

export function isoDateFormat(date: string) {
    const dateFormat = new Date(date);
    return dateFormat;
}

export function formatToLocalDateTime(date: Date) {
    if (!date) return null;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}