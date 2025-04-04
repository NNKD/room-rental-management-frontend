import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import {useEffect, useState} from "react";
import Search from "../components/Search.tsx";
import ApartmentItem from "../components/ApartmentItem.tsx";
import {apartmentPages} from "../data.ts";
import {ApartmentListItem} from "../type.ts";
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight
} from "react-icons/md";

export default function ApartmentList() {

    const [name, setName] = useState("")
    const [type, setType] = useState("")
    const [bedroom, setBedroom] = useState("")
    const [bathroom, setBathroom] = useState("")
    const [sort, setSort] = useState("")
    const [apartments, setApartments] = useState(apartmentPages.content)
    const [pages, setPages] = useState<number[]>([])
    const [currentPage, setCurrentPage] = useState(apartmentPages.number)

    useEffect(() => {
        console.log(name, type, bedroom, bathroom)
    }, [name, type, bedroom, bathroom])

    useEffect(() => {
        if (sort != "") {
            handleSortByPrice()
        }
    }, [sort]);

    useEffect(() => {
        setCurrentPage(apartmentPages.number)
        handleShowPage()
    }, []);

    useEffect(() => {
        handleShowPage()
    }, [currentPage]);

    const handleSortByPrice = () => {
        const copy = [...apartments]
        const sorted = copy.sort((a : ApartmentListItem, b : ApartmentListItem) => sort == "asc" ? (a.price - b.price) : (b.price - a.price))
        setApartments(sorted)
    }

    // Calculation page number to show 3 number
    const handleShowPage = () => {
        const startPage = Math.max(1, currentPage - 1)
        const endPage = Math.min(currentPage + 1, apartmentPages.totalPages)

        setPages(Array.from({length: endPage - startPage + 1}, (_, index) => startPage + index))
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
                setCurrentPage(apartmentPages.totalPages)
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

                    {apartmentPages.content.map((apartment: ApartmentListItem) => (
                        <ApartmentItem key={apartment.id} apartment={apartment} />
                    ))}

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

                    {pages.map((pageNumber: number) => (
                        <span key={pageNumber}
                              className={`w-[30px] h-[30px] md:w-[36px] md:h-[36px] text-xl md:text-2xl border-2 text-center
                                    ${currentPage == pageNumber ? "text-white border-lightGreen bg-lightGreen pointer-events-none" : "text-lightGreen border-lightGreen cursor-pointer hover:bg-lightGreen hover:text-white duration-300 ease-in-out"}`}
                              onClick={() => handleChangePage(0, pageNumber)}>
                            {pageNumber}
                        </span>
                    ))}

                    <MdKeyboardArrowRight
                        className={`w-[30px] h-[30px] md:w-[36px] md:h-[36px] text-3xl md:text-4xl border-2
                                    ${currentPage == apartmentPages.totalPages ? "text-lightGray border-lightGray pointer-events-none" : "text-lightGreen border-lightGreen cursor-pointer hover:bg-lightGreen hover:text-white duration-300 ease-in-out"}`}
                    onClick={() => handleChangePage(1, 0)}/>

                    <MdKeyboardDoubleArrowRight
                        className={`w-[30px] h-[30px] md:w-[36px] md:h-[36px] text-3xl md:text-4xl border-2
                                    ${currentPage == apartmentPages.totalPages ? "text-lightGray border-lightGray pointer-events-none" : "text-lightGreen border-lightGreen cursor-pointer hover:bg-lightGreen hover:text-white duration-300 ease-in-out"}`}
                        onClick={() => handleChangePage(2, 0)}/>

                </div>

            </div>

            <Footer/>
        </div>
    )
}