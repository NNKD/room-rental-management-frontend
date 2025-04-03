import {ApartmentListItem} from "../type.ts";
import {formatCurrency} from "../utils/NumberFormat.ts";
import {Link} from "react-router-dom";

export default function ApartmentItem({apartment}: {apartment: ApartmentListItem}) {
    return (
        <Link to={`/apartment/${apartment.slug}`}
              className="w-fit mx-auto rounded shadow-[0_0_4px_2px_#ddd]
                        hover:shadow-[0_0_6px_4px_#bbb] transition-all duration-300 ease-in-out">
            <img src={apartment.image} className="rounded-t" alt={`${apartment.name}-image`}/>
            <div className="p-4">
                <h2 className="font-bold text-xl leading-[1]">{apartment.brief}</h2>
                <p className="text-base text-lightGreen font-bold my-2">{formatCurrency(apartment.price)}</p>
                <p className="text-base">{apartment.name}</p>
            </div>
        </Link>
    )
}