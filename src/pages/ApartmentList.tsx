import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import {useEffect, useState} from "react";
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

export default function ApartmentList() {

    const [name, setName] = useState("")
    const [type, setType] = useState("")
    const [bedroom, setBedroom] = useState("")
    const [bathroom, setBathroom] = useState("")
    const [sort, setSort] = useState("")
    const [apartments, setApartments] = useState<ApartmentListItem[]>([])
    const [pages, setPages] = useState<PageType<ApartmentListItem> | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageArray, setPageArray] = useState<number[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        console.log(name, type, bedroom, bathroom)
    }, [name, type, bedroom, bathroom])

    useEffect(() => {
        handleGetApartments()
    }, [currentPage])

    const handleGetApartments = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${envVar.API_URL}/apartments`, {
                params: {
                    page: currentPage,
                }
            });

            if (response.status == 200 && response.data.status == "success" && response.data.statusCode == 200) {
                console.log(response.data)
                setPages(response.data.data)
            }

        }catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setCurrentPage(pages?.pageNumber || 1)
        setApartments(pages?.list || [])
        if (pages) {
            handleShowPage()
            setLoading(false)
        }
    }, [pages]);

    useEffect(() => {
        if (sort != "") {
            handleSortByPrice()
        }
    }, [sort]);

    const handleSortByPrice = () => {
        const copy = [...apartments]
        const sorted = copy.sort((a : ApartmentListItem, b : ApartmentListItem) => sort == "asc" ? (a.price - b.price) : (b.price - a.price))
        setApartments(sorted)
    }

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
        switch (type) {
            case -2:
                setCurrentPage(1)
                break
            case -1:
                setCurrentPage(currentPage - 1)
                break
            case 1:
                setCurrentPage(currentPage + 1)
                break
            case 2:
                setCurrentPage(pages?.totalPages || currentPage)
                break
            default:
                setCurrentPage(pageNumber ?? 1)
                break
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>

            <div className="flex-grow p-8 md:p-12">
                <Search setName={setName} setType={setType} setBedroom={setBedroom} setBathroom={setBathroom}/>

                <div className="flex items-center justify-between w-full border-t border-lightGray mt-8 pt-8">
                    <p className="text-xl">6 kết quả</p>
                    <div className="border outline-none border-darkGray rounded py-4 lg:py-2 px-4">
                        <select className="outline-none pr-2 text-darkGray select-none cursor-pointer" defaultValue="" onChange={(e) => setSort(e.target.value)}>
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
                        apartments.map((apartment: ApartmentListItem) => (
                            <ApartmentItem key={apartment.id} apartment={apartment} />
                        ))
                    )}

                </div>

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

            </div>

            <Footer/>
        </div>
    )
}