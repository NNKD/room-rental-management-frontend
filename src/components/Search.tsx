import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { envVar } from "../utils/EnvironmentVariables.ts";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { debounce } from "../utils/Debounce.ts";
import { useTranslation } from "react-i18next";

export default function Search({
                                   namePrevalue,
                                   typePrevalue,
                                   bedroomPrevalue,
                                   pricePrevalue,
                                   setName,
                                   setType,
                                   setBedroom,
                                   setPrice,
                                   searchBtn,
                               }: {
    namePrevalue?: string;
    typePrevalue?: string;
    bedroomPrevalue?: string;
    pricePrevalue?: { name: string; value: string };
    setName?: (value: string) => void;
    setType?: (value: string) => void;
    setBedroom?: (value: string) => void;
    setPrice?: (value: string) => void;
    searchBtn?: () => void;
}) {
    const [bedrooms, setBedrooms] = useState<number[]>([]);
    const [types, setTypes] = useState<string[]>([]);
    const [localName, setLocalName] = useState("");
    const { t } = useTranslation();

    const debounceSearch = useMemo(() => {
        return debounce((name: string) => setName?.(name), 500);
    }, [setName]);

    useEffect(() => {
        setLocalName(namePrevalue || "");
    }, [namePrevalue]);

    const priceRanges = [
        { name: t("all"), value: "0-0" },
        { name: t("below_5"), value: "0-5" },
        { name: t("5_to_10"), value: "5-10" },
        { name: t("10_to_20"), value: "10-20" },
        { name: t("20_to_30"), value: "20-30" },
        { name: t("30_to_40"), value: "30-40" },
        { name: t("above_50"), value: "50-0" },
    ];

    useEffect(() => {
        handleGetFilter();
    }, []);

    const handleGetFilter = async () => {
        try {
            const response = await axios.get(`${envVar.API_URL}/apartments/filters`);

            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                const minBedroom = response.data.data.minBedroom;
                const maxBedroom = response.data.data.maxBedroom;
                setTypes(response.data.data.types.map((type: { name: string }) => type.name));

                const bedroomArray = Array.from({ length: maxBedroom - minBedroom + 1 }, (_, i) => i + 1);
                setBedrooms(bedroomArray);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeTextInput = (e: ChangeEvent<HTMLInputElement>) => {
        setLocalName(e.target.value);
        debounceSearch(e.target.value);
    };

    return (
        <div className="flex items-center gap-4 flex-wrap">
            <div className={`flex flex-col lg:flex-row gap-4 ${setName ? "flex-grow" : ""} ${setPrice && setBedroom ? "" : "w-full lg:w-fit"}`}>
                {setName && (
                    <input
                        placeholder={t("search_by_name")}
                        value={localName}
                        className="border bg-transparent border-darkGray rounded py-4 lg:py-2 px-4 outline-none flex-grow"
                        onChange={(e) => handleChangeTextInput(e)}
                    />
                )}

                {setType && (
                    <div className="border outline-none border-darkGray rounded py-4 lg:py-2 px-4">
                        <select
                            className="outline-none bg-transparent pr-2 text-darkGray w-full select-none cursor-pointer"
                            defaultValue=""
                            onChange={(e) => setType?.(e.target.value)}
                        >
                            <option value="" disabled>
                                {t("apartment_type")}
                            </option>
                            <option value="" className="text-black">
                                {t("all")}
                            </option>

                            {types.map((type, index) =>
                                typePrevalue === type ? (
                                    <option key={index} value={type} className="text-black" selected>
                                        {type}
                                    </option>
                                ) : (
                                    <option key={index} value={type} className="text-black">
                                        {type}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                )}
            </div>

            <div className={`flex flex-col lg:flex-row gap-4 ${setName ? "lg:w-min flex-grow" : ""}`}>
                {setBedroom && (
                    <div className="border outline-none border-darkGray rounded py-4 lg:py-2 px-4">
                        <select
                            className="outline-none bg-transparent pr-2 text-darkGray w-full select-none cursor-pointer"
                            defaultValue=""
                            onChange={(e) => setBedroom?.(e.target.value)}
                        >
                            <option value="" disabled>
                                {t("number_of_bedrooms")}
                            </option>
                            <option value="" className="text-black">
                                {t("all")}
                            </option>

                            {bedrooms.map((numberBed, index) =>
                                Number(bedroomPrevalue) === numberBed ? (
                                    <option key={index} value={numberBed} className="text-black" selected>
                                        {t("bedroom_count", { count: numberBed })}
                                    </option>
                                ) : (
                                    <option key={index} value={numberBed} className="text-black">
                                        {t("bedroom_count", { count: numberBed })}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                )}

                {setPrice && (
                    <div className="border outline-none border-darkGray rounded py-4 lg:py-2 px-4">
                        <select
                            className="outline-none bg-transparent pr-2 text-darkGray w-full select-none cursor-pointer"
                            defaultValue=""
                            onChange={(e) => setPrice?.(e.target.value)}
                        >
                            <option value="" disabled>
                                {t("price_million_vnd")}
                            </option>

                            {priceRanges.map((range, index) =>
                                pricePrevalue?.value === range.value ? (
                                    <option key={index} value={range.value} className="text-black" selected>
                                        {range.name}
                                    </option>
                                ) : (
                                    <option key={index} value={range.value} className="text-black">
                                        {range.name}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                )}
            </div>

            <div
                className="bg-lightGreen text-white w-full lg:w-fit flex items-center justify-center py-4 lg:py-2 px-4 gap-2 rounded select-none cursor-pointer hover:bg-lightGreenHover transition-all duration-300 ease-in-out"
                onClick={() => searchBtn?.()}
            >
                <CiSearch className="text-xl" />
                <span className="font-semibold text-base">{t("search")}</span>
            </div>
        </div>
    );
}