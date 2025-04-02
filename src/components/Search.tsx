import {searchBathroomOption, searchBedroomOption, searchTypeOption} from "../data.ts";
import {CiSearch} from "react-icons/ci";

/*
    setName, setType, setBedroom, setBathroom => set in useState
    showName: show or hide input search by name. Value: true | false
 */

export default function Search({setName, setType, setBedroom, setBathroom, showName}:
                               {setName?: (value: string) => void,
                               setType: (value: string) => void,
                               setBedroom: (value: string) => void,
                               setBathroom: (value: string) => void,
                               showName: boolean}) {

    return (
        <div className="flex items-center gap-4 flex-wrap">
            <div className={`flex flex-col lg:flex-row gap-4 ${showName ? "flex-grow" : ""}`}>

                {showName ? (
                    <input placeholder="Search by name" className="border border-darkGray rounded py-4 lg:py-2 px-4 outline-none lg:flex-grow" onChange={(e) => setName?.(e.target.value)}/>
                ) : ("")}


                <div className="border outline-none border-darkGray rounded py-4 lg:py-2 px-4">
                    <select className="outline-none pr-2 text-darkGray w-full select-none cursor-pointer" defaultValue="" onChange={(e) => setType(e.target.value)}>
                        <option value="" disabled>Loại căn hộ</option>

                        {searchTypeOption.map((option, index) => (
                            <option key={index} value={option.value} className="text-black">{option.name}</option>
                        ))}

                    </select>
                </div>
            </div>

            <div className={`flex flex-col lg:flex-row gap-4 ${showName ? "lg:w-min flex-grow" : ""}`}>
                <div className="border outline-none border-darkGray rounded py-4 lg:py-2 px-4">
                    <select className="outline-none pr-2 text-darkGray w-full select-none cursor-pointer" defaultValue="" onChange={(e) => setBedroom(e.target.value)}>
                        <option value="" disabled>Số phòng ngủ</option>

                        {searchBedroomOption.map((option, index) => (
                            <option key={index} value={option.value} className="text-black">{option.name}</option>
                        ))}

                    </select>
                </div>

                <div className="border outline-none border-darkGray rounded py-4 lg:py-2 px-4">
                    <select className="outline-none pr-2 text-darkGray w-full select-none cursor-pointer" defaultValue="" onChange={(e) => setBathroom(e.target.value)}>
                        <option value="" disabled>Số phòng tắm</option>

                        {searchBathroomOption.map((option, index) => (
                            <option key={index} value={option.value} className="text-black">{option.name}</option>
                        ))}

                    </select>
                </div>
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