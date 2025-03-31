import {Link} from "react-router-dom";

export default function ApartmentList() {
    return (
        <div>
            <p className="text-amber-800 text-2xl">Apartment List</p>
            <Link className="underline" to="/apartment/can-ho-101">Go to Apartment Detail 101</Link>
        </div>
    )
}