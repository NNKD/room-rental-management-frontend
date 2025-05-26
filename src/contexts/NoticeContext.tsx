import {createContext, ReactNode, useState} from "react";
import {NoticeContextType, NoticeType} from "../types/Context.ts";

export const NoticeContext = createContext<NoticeContextType | null>(null)

export function NoticeProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState("")
    const [type, setType] = useState<NoticeType>(NoticeType.INFO)
    return (
        <NoticeContext.Provider value={{message, setMessage, type, setType}}>
            {children}
        </NoticeContext.Provider>
    )
}