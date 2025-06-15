import {useParams} from "react-router-dom";

export default function UserApartmentDetail() {
    const {slug}  = useParams()

    return (
        <div>
            {slug}
        </div>
    )
}