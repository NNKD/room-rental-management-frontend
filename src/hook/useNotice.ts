import {useContext} from "react";
import {NoticeContext} from "../contexts/NoticeContext.tsx";

export const useNotice = () => {
    const context = useContext(NoticeContext);
    if (!context) {
        console.error("Notice context null");

        return {message: "", setMessage: () => {}, type: "", setType: () => {}};
    }
    return context;
}