import {useParams} from "react-router-dom";

export default function ApartmentDetail() {
    const {slug} = useParams();

    return (
        <div>
            <p className="text-blue-400 text-2xl">Apartment Detail: {slug}</p>
        </div>
    )
}