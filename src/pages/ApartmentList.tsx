import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import {useEffect, useState} from "react";
import Search from "../components/Search.tsx";
import ApartmentItem from "../components/ApartmentItem.tsx";
import {apartmentList} from "../data.ts";
import {ApartmentListItem} from "../type.ts";

export default function ApartmentList() {

    const [name, setName] = useState("")
    const [type, setType] = useState("")
    const [bedroom, setBedroom] = useState("")
    const [bathroom, setBathroom] = useState("")
    const [sort, setSort] = useState("")
    const [apartments, setApartments] = useState(apartmentList)

    useEffect(() => {
        console.log(name, type, bedroom, bathroom)
    }, [name, type, bedroom, bathroom])

    useEffect(() => {
        if (sort != "") {
            console.log(sort)
            handleSortByPrice()
        }
    }, [sort]);

    const handleSortByPrice = () => {
        const copy = [...apartments]
        const sorted = copy.sort((a : ApartmentListItem, b : ApartmentListItem) => sort == "asc" ? (a.price - b.price) : (b.price - a.price))
        setApartments(sorted)
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>

            <div className="flex-grow p-8 md:p-12">
                <Search setName={setName} setType={setType} setBedroom={setBedroom} setBathroom={setBathroom} showName={true}/>

                <div className="flex items-center justify-between w-full border-t border-lightGray mt-8 pt-8">
                    <p className="text-xl">6 kết quả</p>
                    <div className="border outline-none border-darkGray rounded py-4 lg:py-2 px-4">
                        <select className="outline-none pr-2 text-darkGray select-none cursor-pointer" defaultValue="" onChange={(e) => setSort(e.target.value)}>
                            <option value="" disabled>Sắp xếp</option>
                            <option value="asc">Giá tăng dần</option>
                            <option value="desc">Giá giảm dần</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-12 mt-6 justify-between">

                    {apartments.map((apartment: ApartmentListItem) => (
                        <ApartmentItem key={apartment.id} apartment={apartment} />
                    ))}

                </div>
            </div>



            <Footer/>
        </div>
    )
}