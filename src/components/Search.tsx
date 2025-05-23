import {CiSearch} from "react-icons/ci";
import axios from "axios";
import {envVar} from "../utils/EnvironmentVariables.ts";
import {useEffect, useState} from "react";

/*
    setName, setType, setBedroom, setPrice => set in useState, is not required. If it has => show element
 */

export default function Search({setName, setType, setBedroom, setPrice}:
                               {setName?: (value: string) => void,
                               setType?: (value: string) => void,
                               setBedroom?: (value: string) => void,
                               setPrice?: (value: string) => void}) {

    const [bedrooms, setBedrooms] = useState<number[]>([]) // show dropdown
    const [types, setTypes] = useState<string[]>([]) // show dropdown


    const priceRanges = [
        {name: "Tất cả", value: "0-0"},
        {name: "Dưới 5", value: "0-5"},
        {name: "5 - 10", value: "5-10"},
        {name: "10 - 20", value: "10-20"},
        {name: "20 - 30", value: "20-30"},
        {name: "30 - 40", value: "30-40"},
        {name: "Trên 50", value: "50-0"},
    ]

    useEffect(() => {
        handleGetFilter()
    }, [])

    const handleGetFilter = async () => {
        try {
            const response = await axios.get(`${envVar.API_URL}/apartments/filters`);

            if (response.status === 200 && response.data.status == "success" && response.data.statusCode == 200) {
                const minBedroom = response.data.data.minBedroom;
                const maxBedroom = response.data.data.maxBedroom;
                setTypes(response.data.data.types.map((type: {name: string}) => type.name));

                // calculate to show bedroom from min -> max
                const bedroomArray = Array.from({length: maxBedroom - minBedroom + 1}, (_, i) => i + 1);
                setBedrooms(bedroomArray)
            }

        }catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="flex items-center gap-4 flex-wrap">
            <div className={`flex flex-col lg:flex-row gap-4 ${setName ? "flex-grow" : ""} ${setPrice && setBedroom ? "" : "w-full lg:w-fit" }`}>

                {setName && (
                    <input placeholder="Search by name" className="border bg-transparent border-darkGray rounded py-4 lg:py-2 px-4 outline-none flex-grow" onChange={(e) => setName?.(e.target.value)}/>
                )}

                {setType && (
                    <div className="border outline-none border-darkGray rounded py-4 lg:py-2 px-4">
                        <select className="outline-none bg-transparent pr-2 text-darkGray w-full select-none cursor-pointer" defaultValue="" onChange={(e) => setType?.(e.target.value)}>
                            <option value="" disabled>Loại căn hộ</option>

                            {types.map((type, index) => (
                                <option key={index} value={type} className="text-black">{type}</option>
                            ))}

                        </select>
                    </div>
                )}

            </div>

            <div className={`flex flex-col lg:flex-row gap-4 ${setName ? "lg:w-min flex-grow" : ""}`}>
                {setBedroom && (
                    <div className="border outline-none border-darkGray rounded py-4 lg:py-2 px-4">
                        <select className="outline-none bg-transparent pr-2 text-darkGray w-full select-none cursor-pointer" defaultValue="" onChange={(e) => setBedroom?.(e.target.value)}>
                            <option value="" disabled>Số phòng ngủ</option>

                            {bedrooms.map((numberBed, index) => (
                                <option key={index} value={numberBed} className="text-black">{numberBed} phòng ngủ</option>
                            ))}

                        </select>
                    </div>
                )}

                {setPrice && (
                    <div className="border outline-none border-darkGray rounded py-4 lg:py-2 px-4">
                        <select className="outline-none bg-transparent pr-2 text-darkGray w-full select-none cursor-pointer" defaultValue="" onChange={(e) => setPrice?.(e.target.value)}>
                            <option value="" disabled>Giá (triệu đồng)</option>

                            {priceRanges.map((range, index) => (
                                <option key={index} value={range.value} className="text-black">{range.name}</option>
                            ))}

                        </select>
                    </div>
                )}

            </div>

            <div className="
            bg-lightGreen text-white w-full lg:w-fit flex items-center justify-center py-4 lg:py-2 px-4 gap-2 rounded
            select-none cursor-pointer hover:bg-lightGreenHover transition-all duration-300 ease-in-out">
                <CiSearch className="text-xl" />
                <span className="font-semibold text-base">Search</span>
            </div>
        </div>
    )
}