import {IoClose} from "react-icons/io5";

export default function ModalZoomImage({image, setImage}: {image: string, setImage: (src: string) => void}) {
    return (
        <div className="fixed flex items-center justify-center top-0 left-0 right-0 bottom-0 bg-black/30 z-50 select-none">
            <div className="w-full">
                <div className="absolute top-2 right-2 p-1  rounded-[50%] hover:bg-main hover:bg-lightGreen border-2 text-white  transition-all ease-in cursor-pointer" onClick={() => setImage("")}>
                    <IoClose className="text-3xl"/>
                </div>
                <div className="w-full mx-auto max-w-[85vw] max-h-[60vh] sm:max-w-[50vw] lg:max-h-[90vh] overflow-y-auto overflow-x-hidden bg-white p-1 relative rounded-lg" onClick={(e) => e.stopPropagation()}>
                    <img src={image} className="w-full object-contain" alt=""/>
                </div>
            </div>
        </div>
    )
}