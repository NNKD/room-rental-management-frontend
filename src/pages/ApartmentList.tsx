import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import {useEffect, useRef, useState} from "react";
import Search from "../components/Search.tsx";
import ApartmentItem from "../components/ApartmentItem.tsx";
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight
} from "react-icons/md";
import axios from "axios";
import {envVar} from "../utils/EnvironmentVariables.ts";
import {ApartmentListItem} from "../types/Apartment.ts";
import SkeletonApartmentItem from "../components/skeleton-loading/SkeletonApartmentItem.tsx";
import {PageType} from "../types/PageList.ts";
import {useSearchParams} from "react-router-dom";

export default function ApartmentList() {
    // use to get request param (?page=1&name="p"&....)
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1");
    const name = searchParams.get("name");
    const type = searchParams.get("type");
    const bedroom = searchParams.get("bedroom");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const sort = searchParams.get("sort");

    // Pass set to search to get Value
    const [nameSearch, setNameSearch] = useState("")
    const [typeSearch, setTypeSearch] = useState("")
    const [bedroomSearch, setBedroomSearch] = useState("")
    const [priceSearch, setPriceSearch] = useState("")

    const [apartments, setApartments] = useState<ApartmentListItem[]>([])
    const [pages, setPages] = useState<PageType<ApartmentListItem> | null>(null)

    const [pageArray, setPageArray] = useState<number[]>([])
    const [loading, setLoading] = useState(true)

    const abortControllerRef = useRef<AbortController | null>(null);

    // Save param on url when refresh
    useEffect(() => {
        setNameSearch(name || "");
        setTypeSearch(type || "");
        setBedroomSearch(bedroom || "");
        if (priceMin && priceMax) {
            const min = (parseInt(priceMin) / 1000000).toString();
            const max = priceMax === "0" ? "0" : (parseInt(priceMax) / 1000000).toString();
            setPriceSearch(`${min}-${max}`);
        } else {
            setPriceSearch("");
        }
    }, []);


    useEffect(() => {
        handleSetSearchParams()
    }, [nameSearch, typeSearch, bedroomSearch, priceSearch])

    // name, type, bedroom, price, sort, currentPage change call get apartments
    useEffect(() => {
        handleGetApartments()
    }, [searchParams])

    // Set param to SearchParam
    const handleSetSearchParams = () => {
        // min max = 0, 5, 10, ... 50 => * 1000000
        let min = "", max = "" ;
        if (priceSearch.includes("-")) {
            min = priceSearch.split("-")[0];
            const minNumber = Number(min)
            min = (minNumber * 1000000) + ""
            max = priceSearch.split("-")[1];
            if (Number(max) == 0) {
                max = "" // set = "" to remove priceMax from param
            }else {
                const maxNumber = Number(max)
                max = (maxNumber * 1000000) + ""
            }
        }

        // Change searchParam to Object to get current param
        const currentParams = Object.fromEntries(searchParams.entries())

        const updateParams = {
            ...currentParams,
            page: "1",
            name: nameSearch,
            type: typeSearch,
            bedroom: bedroomSearch,
            priceMin: min,
            priceMax: max,
        }

        // Change object => Object[] [key, value] => Check value = "" => remove [key, value] from searchParams
        const filteredParams = Object.fromEntries(
            Object.entries(updateParams).filter(([, v]) => v !== "")
        );

        setSearchParams(filteredParams)
    }

    // Get list with filter, sort option
    const handleGetApartments = async () => {
        setLoading(true)

        // Check if exist => remove (remove previous request)
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        abortControllerRef.current = new AbortController();

        try {
            const response = await axios.get(`${envVar.API_URL}/apartments`, {
                // Check remove [key, value] param == null or undefined
                params: Object.fromEntries( // make Object[] [key, value] => Object {page: 1, ...}
                    Object.entries({ // make params => Object[] [key, value] == [ [page, 1], [name, null],..]
                        page: currentPage,
                        name,
                        type,
                        bedroom,
                        priceMin,
                        priceMax,
                        sort
                    }).filter(([, v]) => v !== null && v !== undefined)
                ),
                signal: abortControllerRef.current.signal // add signal in request => can cancel request when needed
            });

            if (response.status == 200 && response.data.status == "success" && response.data.statusCode == 200) {
                console.log(response.data.data)
                setPages(response.data.data)
            }

        }catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setApartments(pages?.list || [])
        if (pages) {
            handleShowPage()
            setLoading(false)
        }
    }, [pages]);


    // Calculation page number to show 3 number
    const handleShowPage = () => {
        const startPage = Math.max(1, currentPage - 1)
        const endPage = Math.min(currentPage + 1, (pages?.totalPages || currentPage))
        setPageArray(Array.from({length: endPage - startPage + 1}, (_, index) => startPage + index))
    }

    /*
    Handle page on click. Type:
    -2: double left arrow (to first page). PageNumber = 0
    -1: single left arrow (to previous page). PageNumber = 0
    0: to page number. Click on number
    1: single right arrow (to next page). PageNumber = 0
    2: double right arrow (to last page). PageNumber = 0
     */

    const handleChangePage = (type: number, pageNumber: number) => {
        let newPage = currentPage;
        switch (type) {
            case -2:
                newPage = 1;
                break
            case -1:
                newPage = currentPage - 1 ;
                break
            case 1:
                newPage = currentPage + 1;
                break
            case 2:
                newPage = (pages?.totalPages || currentPage);
                break
            default:
                newPage = (pageNumber ?? 1)
                break
        }

        // change searchParam to Object to get current param
        const currentParams = Object.fromEntries(searchParams.entries());

        const updateParams = {
            ...currentParams,
            page: newPage.toString()
        }

        setSearchParams(updateParams);
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>

            <div className="flex-grow p-8 md:p-12">
                <Search namePrevalue={nameSearch} typePrevalue={typeSearch} bedroomPrevalue={bedroomSearch} pricePrevalue={{name: "", value: priceSearch}}
                        setName={setNameSearch} setType={setTypeSearch} setBedroom={setBedroomSearch} setPrice={setPriceSearch}/>

                <div className="flex items-center justify-between w-full border-t border-lightGray mt-8 pt-8">
                    <p className="text-xl">{pages?.totalElements} kết quả</p>
                    <div className="border outline-none border-darkGray rounded py-4 lg:py-2 px-4">
                        <select className="outline-none pr-2 text-darkGray select-none cursor-pointer" defaultValue="" onChange={(e) => setSearchParams({sort: e.target.value})}>
                            <option value="" disabled>Sắp xếp</option>
                            <option value="asc" className="text-black">Giá tăng dần</option>
                            <option value="desc" className="text-black">Giá giảm dần</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 gap-y-12 mt-6 justify-between">

                    {loading ? Array(6).fill(0).map((_, index) => (
                        <SkeletonApartmentItem key={index}/>
                    )) : (
                        apartments.length > 0 ? (
                            apartments.map((apartment: ApartmentListItem) => (
                                <ApartmentItem key={apartment.slug} apartment={apartment} />
                            ))
                        ) : (
                            <div>
                                <p>Không có kết quả phù hợp</p>
                            </div>
                        )
                    )}

                </div>

                {pages?.totalElements != 0 ? (
                    <div className="flex flex-wrap mt-8 gap-3 md:gap-6 mx-auto w-fit select-none">

                        {/*
                        Show pagination
                        text-lightGray, border-lightGray == disabled => pointer-events-none (prevent event)
                    */}

                        <MdKeyboardDoubleArrowLeft
                            className={`w-[30px] h-[30px] md:w-[36px] md:h-[36px] text-3xl md:text-4xl border-2
                                    ${currentPage == 1 ? "text-lightGray border-lightGray pointer-events-none" : "text-lightGreen border-lightGreen cursor-pointer hover:bg-lightGreen hover:text-white duration-300 ease-in-out"}`}
                            onClick={() => handleChangePage(-2, 0)}/>

                        <MdKeyboardArrowLeft
                            className={`w-[30px] h-[30px] md:w-[36px] md:h-[36px] text-3xl md:text-4xl border-2
                                    ${currentPage == 1 ? "text-lightGray border-lightGray pointer-events-none" : "text-lightGreen border-lightGreen cursor-pointer hover:bg-lightGreen hover:text-white duration-300 ease-in-out"}`}
                            onClick={() => handleChangePage(-1, 0)}/>

                        {pageArray.map((pageNumber: number) => (
                            <span key={pageNumber}
                                  className={`w-[30px] h-[30px] md:w-[36px] md:h-[36px] text-xl md:text-2xl border-2 text-center
                                    ${currentPage == pageNumber ? "text-white border-lightGreen bg-lightGreen pointer-events-none" : "text-lightGreen border-lightGreen cursor-pointer hover:bg-lightGreen hover:text-white duration-300 ease-in-out"}`}
                                  onClick={() => handleChangePage(0, pageNumber)}>
                            {pageNumber}
                        </span>
                        ))}

                        <MdKeyboardArrowRight
                            className={`w-[30px] h-[30px] md:w-[36px] md:h-[36px] text-3xl md:text-4xl border-2
                                    ${currentPage == pages?.totalPages ? "text-lightGray border-lightGray pointer-events-none" : "text-lightGreen border-lightGreen cursor-pointer hover:bg-lightGreen hover:text-white duration-300 ease-in-out"}`}
                            onClick={() => handleChangePage(1, 0)}/>

                        <MdKeyboardDoubleArrowRight
                            className={`w-[30px] h-[30px] md:w-[36px] md:h-[36px] text-3xl md:text-4xl border-2
                                    ${currentPage == pages?.totalPages ? "text-lightGray border-lightGray pointer-events-none" : "text-lightGreen border-lightGreen cursor-pointer hover:bg-lightGreen hover:text-white duration-300 ease-in-out"}`}
                            onClick={() => handleChangePage(2, 0)}/>

                    </div>
                ) : ""}



            </div>

            <Footer/>
        </div>
    )
}