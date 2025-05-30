import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { ChangeEvent, useEffect, useMemo, useState, Dispatch, SetStateAction } from "react";
import { debounce } from "../utils/Debounce.ts";

// Định nghĩa kiểu cho FilterDataResponse dựa trên backend
interface FilterDataResponse {
    minBedroom: number;
    maxBedroom: number;
    types: { id: number; name: string }[];
}

// Định nghĩa kiểu props cho Search component
interface SearchProps {
    namePrevalue?: string;
    typePrevalue?: string;
    bedroomPrevalue?: string;
    pricePrevalue?: { name: string; value: string };
    setName?: Dispatch<SetStateAction<string>>;
    setType?: Dispatch<SetStateAction<string>>;
    setBedroom?: Dispatch<SetStateAction<string>>;
    setPrice?: Dispatch<SetStateAction<string>>;
}

export default function Search({
                                   namePrevalue,
                                   typePrevalue,
                                   bedroomPrevalue,
                                   pricePrevalue,
                                   setName,
                                   setType,
                                   setBedroom,
                                   setPrice,
                               }: SearchProps) {
    const [bedrooms, setBedrooms] = useState<number[]>([]);
    const [types, setTypes] = useState<string[]>([]);

    const debounceSearch = useMemo(() => {
        return debounce((name: string) => setName?.(name), 500);
    }, [setName]);

    const priceRanges = [
        { name: "Tất cả", value: "0-0" },
        { name: "Dưới 5", value: "0-5" },
        { name: "5 - 10", value: "5-10" },
        { name: "10 - 20", value: "10-20" },
        { name: "20 - 30", value: "20-30" },
        { name: "30 - 40", value: "30-40" },
        { name: "Trên 50", value: "50-0" },
    ];

    useEffect(() => {
        handleGetFilter();
    }, []);

    const handleGetFilter = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/apartments/filters`);

            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                const { minBedroom, maxBedroom, types } = response.data.data as FilterDataResponse;
                // Đảm bảo types là danh sách các tên loại căn hộ (Studio, Duplex, v.v.)
                setTypes(types.map((type) => type.name));
                // Tạo mảng số phòng ngủ từ min đến max
                const bedroomArray = Array.from(
                    { length: maxBedroom - minBedroom + 1 },
                    (_, i) => minBedroom + i
                );
                setBedrooms(bedroomArray);
            }
        } catch (error) {
            console.error("Lỗi lấy filter:", error);
        }
    };

    const handleChangeTextInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        debounceSearch(value);
    };

    const handleReset = () => {
        setName?.("");
        setType?.("");
        setBedroom?.("");
        setPrice?.("");
    };

    return (
        <div className="flex items-center gap-4 flex-wrap">
            <div className={`flex flex-col lg:flex-row gap-4 ${setName ? "flex-grow" : ""} ${setPrice && setBedroom ? "" : "w-full lg:w-fit"}`}>
                {setName && (
                    <input
                        placeholder="Tìm kiếm theo tên"
                        value={namePrevalue || ""}
                        className="border bg-transparent border-darkGray rounded py-4 lg:py-2 px-4 outline-none flex-grow"
                        onChange={handleChangeTextInput}
                    />
                )}

                {setType && (
                    <div className="border outline-none border-darkGray rounded py-4 lg:py-2 px-4">
                        <select
                            value={typePrevalue || ""}
                            onChange={(e) => setType?.(e.target.value)}
                            className="outline-none bg-transparent pr-2 text-darkGray w-full select-none cursor-pointer"
                        >
                            <option value="" disabled>
                                Loại căn hộ
                            </option>
                            <option value="">Tất cả</option>
                            {types.map((type, index) => (
                                <option key={index} value={type} className="text-black">
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className={`flex flex-col lg:flex-row gap-4 ${setName ? "lg:w-min flex-grow" : ""}`}>
                {setBedroom && (
                    <div className="border outline-none border-darkGray rounded py-4 lg:py-2 px-4">
                        <select
                            value={bedroomPrevalue || ""}
                            onChange={(e) => setBedroom?.(e.target.value)}
                            className="outline-none bg-transparent pr-2 text-darkGray w-full select-none cursor-pointer"
                        >
                            <option value="" disabled>
                                Số phòng ngủ
                            </option>
                            <option value="">Tất cả</option>
                            {bedrooms.map((numberBed, index) => (
                                <option key={index} value={numberBed.toString()} className="text-black">
                                    {numberBed} phòng ngủ
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {setPrice && (
                    <div className="border outline-none border-darkGray rounded py-4 lg:py-2 px-4">
                        <select
                            value={pricePrevalue?.value || ""}
                            onChange={(e) => setPrice?.(e.target.value)}
                            className="outline-none bg-transparent pr-2 text-darkGray w-full select-none cursor-pointer"
                        >
                            <option value="" disabled>
                                Giá (triệu đồng)
                            </option>
                            {priceRanges.map((range, index) => (
                                <option key={index} value={range.value} className="text-black">
                                    {range.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="flex gap-4">
                <div className="bg-lightGreen text-white w-full lg:w-fit flex items-center justify-center py-4 lg:py-2 px-4 gap-2 rounded select-none cursor-pointer hover:bg-lightGreenHover transition-all duration-300 ease-in-out">
                    <CiSearch className="text-xl" />
                    <span className="font-semibold text-base">Tìm kiếm</span>
                </div>
                <button
                    onClick={handleReset}
                    className="border border-darkGray rounded py-4 lg:py-2 px-4 text-darkGray hover:bg-darkGray hover:text-white transition-all duration-300 ease-in-out"
                >
                    Xóa bộ lọc
                </button>
            </div>
        </div>
    );
}