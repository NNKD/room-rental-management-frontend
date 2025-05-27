export function debounce<T extends unknown[]>(callback: (...args: T) => void, delay: number) {
    let timeout: ReturnType<typeof setTimeout> | null;
    return (...args: T)=> {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => {
            callback(...args)
        }, delay)
    }
}
