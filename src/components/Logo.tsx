import {PiBuildingApartmentBold} from "react-icons/pi";

export default function Logo({textColor}:{textColor:string}) {
    return (
        <div className="flex items-center gap-4">
            <PiBuildingApartmentBold className={`w-8 h-8 md:w-10 md:h-10 ${textColor}`}/>
            <h1 className={`text-xl md:text-2xl font-semibold ${textColor}`}>Name site</h1>
        </div>
    )
}