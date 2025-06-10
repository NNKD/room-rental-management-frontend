import {useNotice} from "../hook/useNotice.ts";
import {MdError} from "react-icons/md";
import {IoIosClose} from "react-icons/io";
import {useEffect} from "react";

export default function NoticeUI() {
    const {message, setMessage, type} = useNotice();

    // Hide after 5s
    useEffect(() => {
        if (message != "") {
            const hideTime = setTimeout(() => {
                setMessage("");
            }, 5000)
            return () => clearTimeout(hideTime)
        }
    }, [message]);

    return message != "" ? (
        <div
            className="fixed top-[5%] right-[5%] z-[1000] w-fit flex items-center justify-between py-2 pl-2 pr-1 gap-4 bg-white border rounded">

            <MdError
                className={`text-xl ${type == "error" ? "text-red-500" : 
                                    (type == "warning" || type == "alert" ? "text-yellow-400" :
                                    (type == "success") ? "text-green-400" :   "text-blue-500")}`}/>
            <p className="text-xl">
                {message}
            </p>

            <div className="p-1 text-zinc-500 cursor-pointer hover:text-black transition-all duration-300"
                 onClick={() => setMessage("")}>
                <IoIosClose className="text-3xl"/>
            </div>
        </div>
    ) : ""
}