import {FaArrowAltCircleUp} from "react-icons/fa";
import {useEffect, useState} from "react";

export default function GoTop() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        handleVisibility()
        window.addEventListener("scroll", handleVisibility)
        return () => window.removeEventListener("scroll", handleVisibility)
    }, [])

    const handleVisibility = () => {
        if (window.scrollY >= (window.innerHeight / 2) ) {
            setVisible(true)
        }else {
            setVisible(false)
        }
    }
    
    return visible ? (
        <div className="fixed bottom-[15%] right-[5%] rounded-full bg-white z-50 animate-fade-in-500">
            <a href="#" className="text-5xl cursor-pointer text-lightGreen hover:text-lightGreenHover transition-all duration-300 ease-in-out">
                <FaArrowAltCircleUp />
            </a>
        </div>
    ) : ""
}
