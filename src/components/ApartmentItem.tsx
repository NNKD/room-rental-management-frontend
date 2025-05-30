import {ApartmentListItem} from "../types/Apartment.ts";
import {formatCurrency} from "../utils/NumberCalculate.ts";
import {Link} from "react-router-dom";

export default function ApartmentItem({ apartment }: { apartment: ApartmentListItem }) {

    return (
        <Link
            to={`/apartments/${apartment.slug}`}
            className="w-full mx-auto rounded shadow-[0_0_4px_2px_#ddd] select-none hover:shadow-[0_0_6px_4px_#bbb] transition-all duration-300 ease-in-out flex flex-col h-full"
        >
            <div className="overflow-hidden rounded-t aspect-[4/3] flex-shrink-0">
                <img
                    loading="lazy"
                    src={(apartment.images[0].url || "")}
                    className="w-full h-full object-cover rounded-t hover:scale-125 transition-all duration-300 ease-in-out"
                    alt={`${apartment.name}-image`}
                />

            </div>
            <div className="p-4 flex-grow flex flex-col justify-evenly gap-2">
                <h2 className="font-bold text-xl leading-[1]">{apartment.brief || "No brief available"}</h2>
                <p className="text-base text-lightGreen font-bold">
                    {formatCurrency(apartment.price || 0)}
                </p>
                <p className="text-base">{apartment.name || "Unnamed Apartment"}</p>
            </div>
        </Link>
    );
}