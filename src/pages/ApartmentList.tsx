import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import {useEffect, useState} from "react";
import Search from "../components/Search.tsx";
import ApartmentItem from "../components/ApartmentItem.tsx";


export default function ApartmentList() {

    const [name, setName] = useState("")
    const [type, setType] = useState("")
    const [bedroom, setBedroom] = useState("")
    const [bathroom, setBathroom] = useState("")

    useEffect(() => {
        console.log(name, type, bedroom, bathroom)
    }, [name, type, bedroom, bathroom])

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>

            <div className="flex-grow p-8 md:p-12">
                <Search setName={setName} setType={setType} setBedroom={setBedroom} setBathroom={setBathroom} showName={true}/>

                <div className="grid grid-rows-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-12 mt-20 justify-between">
                    <ApartmentItem />
                    <ApartmentItem />
                    <ApartmentItem />
                    <ApartmentItem />
                    <ApartmentItem />
                </div>
            </div>



            <Footer/>
        </div>
    )
}