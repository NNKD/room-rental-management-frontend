import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import { useEffect, useRef, useState, useMemo } from "react";
import Search from "../components/Search.tsx";
import ApartmentItem from "../components/ApartmentItem.tsx";
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight
} from "react-icons/md";
import { ApartmentListItem } from "../types/Apartment.ts";
import SkeletonApartmentItem from "../components/skeleton-loading/SkeletonApartmentItem.tsx";
import { PageType } from "../types/PageList.ts";
import { useSearchParams } from "react-router-dom";
import { useNotice } from "../hook/useNotice.ts";
import { NoticeType } from "../types/Context.ts";
import { debounce } from "../utils/Debounce.ts";

export default function ApartmentList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1");
    const name = searchParams.get("name") || "";
    const type = searchParams.get("type") || "";
    const bedroom = searchParams.get("bedroom") || "";
    const priceMin = searchParams.get("priceMin") || "";
    const priceMax = searchParams.get("priceMax") || "";
    const sort = searchParams.get("sort") || "";

    const [nameSearch, setNameSearch] = useState(name);
    const [typeSearch, setTypeSearch] = useState(type);
    const [bedroomSearch, setBedroomSearch] = useState(bedroom);
    const [priceSearch, setPriceSearch] = useState("");
    const [apartments, setApartments] = useState<ApartmentListItem[]>([]);
    const [pages, setPages] = useState<PageType<ApartmentListItem> | null>(null);
    const [pageArray, setPageArray] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const abortControllerRef = useRef<AbortController | null>(null);
    const { setMessage, setType } = useNotice();

    // Khởi tạo giá trị tìm kiếm từ query params
    useEffect(() => {
        setNameSearch(name);
        setTypeSearch(type);
        setBedroomSearch(bedroom);
        if (priceMin && priceMax) {
            const min = (parseInt(priceMin) / 1000000).toString();
            const max = priceMax === "0" ? "0" : (parseInt(priceMax) / 1000000).toString();
            setPriceSearch(`${min}-${max}`);
        } else {
            setPriceSearch("");
        }
    }, [name, type, bedroom, priceMin, priceMax]);

    // Cập nhật query params khi thay đổi bộ lọc
    useEffect(() => {
        handleSetSearchParams();
    }, [nameSearch, typeSearch, bedroomSearch, priceSearch]);

    // Gọi API khi query params thay đổi (dùng debounce để giảm tần suất gọi)
    const debouncedFetchApartments = useMemo(() => {
        return debounce(() => {
            handleGetApartments();
        }, 300);
    }, [searchParams]); // Dependency là searchParams

    useEffect(() => {
        debouncedFetchApartments();
        return () => {
            debouncedFetchApartments.cancel();
        };
    }, [searchParams, debouncedFetchApartments]);

    const handleSetSearchParams = () => {
        let min = "", max = "";
        if (priceSearch.includes("-")) {
            min = priceSearch.split("-")[0];
            const minNumber = Number(min);
            min = (minNumber * 1000000) + "";
            max = priceSearch.split("-")[1];
            if (Number(max) === 0) {
                max = "";
            } else {
                const maxNumber = Number(max);
                max = (maxNumber * 1000000) + "";
            }
        }

        const currentParams = Object.fromEntries(searchParams.entries());
        const updateParams = {
            ...currentParams,
            page: "1",
            name: nameSearch,
            type: typeSearch,
            bedroom: bedroomSearch,
            priceMin: min,
            priceMax: max,
        };

        const filteredParams = Object.fromEntries(
            Object.entries(updateParams).filter(([, v]) => v !== "")
        );

        setSearchParams(filteredParams);
    };

    const handleGetApartments = async () => {
        setLoading(true);

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        try {
            const query = new URLSearchParams(
                Object.entries({
                    page: currentPage.toString(),
                    name,
                    type,
                    bedroom,
                    priceMin,
                    priceMax,
                    sort
                }).filter(([, v]) => v !== "")
            ).toString();

            const response = await fetch(`http://localhost:8080/apartments?${query}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                signal: abortControllerRef.current.signal,
            });

            const text = await response.text();
            console.log("Raw response:", text);

            if (!response.ok) {
                throw new Error(`Lỗi HTTP! trạng thái: ${response.status}`);
            }

            const data = JSON.parse(text);
            if (data.status === "success" && data.statusCode === 200) {
                setPages(data.data);
            } else {
                throw new Error("Dữ liệu phản hồi không hợp lệ");
            }
        } catch (error) {
            setType(NoticeType.ERROR);
            setMessage(`Đang có lỗi xảy ra: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setApartments(pages?.list || []);
        if (pages) {
            handleShowPage();
        }
    }, [pages]);

    const handleShowPage = () => {
        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(currentPage + 1, (pages?.totalPages || currentPage));
        setPageArray(Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index));
    };

    const handleChangePage = (type: number, pageNumber: number) => {
        let newPage = currentPage;
        switch (type) {
            case -2:
                newPage = 1;
                break;
            case -1:
                newPage = currentPage - 1;
                break;
            case 1:
                newPage = currentPage + 1;
                break;
            case 2:
                newPage = (pages?.totalPages || currentPage);
                break;
            default:
                newPage = (pageNumber ?? 1);
                break;
        }

        const currentParams = Object.fromEntries(searchParams.entries());
        const updateParams = {
            ...currentParams,
            page: newPage.toString()
        };
        setSearchParams(updateParams);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow p-8 md:p-12">
                <Search
                    namePrevalue={nameSearch}
                    typePrevalue={typeSearch}
                    bedroomPrevalue={bedroomSearch}
                    pricePrevalue={{ name: "", value: priceSearch }}
                    setName={setNameSearch}
                    setType={setTypeSearch}
                    setBedroom={setBedroomSearch}
                    setPrice={setPriceSearch}
                />

                <div className="flex items-center justify-between w-full border-t border-lightGray mt-8 pt-8">
                    <p className="text-xl">{pages?.totalElements || 0} kết quả</p>
                    <div className="border outline-none border-darkGray rounded py-4 lg:py-2 px-4">
                        <select
                            className="outline-none pr-2 text-darkGray select-none cursor-pointer"
                            value={sort}
                            onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams.entries()), sort: e.target.value })}
                        >
                            <option value="" disabled>Sắp xếp</option>
                            <option value="asc">Giá tăng dần</option>
                            <option value="desc">Giá giảm dần</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-6 gap-y-12 mt-6 justify-between">
                    {loading ? (
                        Array(6).fill(0).map((_, index) => (
                            <SkeletonApartmentItem key={index} />
                        ))
                    ) : apartments.length > 0 ? (
                        apartments.map((apartment: ApartmentListItem) => (
                            <ApartmentItem key={apartment.id || apartment.slug} apartment={apartment} />
                        ))
                    ) : (
                        <div>
                            <p>Không có kết quả phù hợp</p>
                        </div>
                    )}
                </div>

                {pages?.totalElements ? (
                    <div className="flex flex-wrap mt-8 gap-3 md:gap-6 mx-auto w-fit select-none">
                        <MdKeyboardDoubleArrowLeft
                            className={`w-[30px] h-[30px] md:w-[36px] md:h-[36px] text-3xl md:text-4xl border-2
                                ${currentPage === 1 ? "text-lightGray border-lightGray pointer-events-none" : "text-lightGreen border-lightGreen cursor-pointer hover:bg-lightGreen hover:text-white duration-300 ease-in-out"}`}
                            onClick={() => handleChangePage(-2, 0)}
                        />
                        <MdKeyboardArrowLeft
                            className={`w-[30px] h-[30px] md:w-[36px] md:h-[36px] text-3xl md:text-4xl border-2
                                ${currentPage === 1 ? "text-lightGray border-lightGray pointer-events-none" : "text-lightGreen border-lightGreen cursor-pointer hover:bg-lightGreen hover:text-white duration-300 ease-in-out"}`}
                            onClick={() => handleChangePage(-1, 0)}
                        />
                        {pageArray.map((pageNumber: number) => (
                            <span
                                key={pageNumber}
                                className={`w-[30px] h-[30px] md:w-[36px] md:h-[36px] text-xl md:text-2xl border-2 text-center
                                ${currentPage === pageNumber ? "text-white border-lightGreen bg-lightGreen pointer-events-none" : "text-lightGreen border-lightGreen cursor-pointer hover:bg-lightGreen hover:text-white duration-300 ease-in-out"}`}
                                onClick={() => handleChangePage(0, pageNumber)}
                            >
                                {pageNumber}
                            </span>
                        ))}
                        <MdKeyboardArrowRight
                            className={`w-[30px] h-[30px] md:w-[36px] md:h-[36px] text-3xl md:text-4xl border-2
                                ${currentPage === pages?.totalPages ? "text-lightGray border-lightGray pointer-events-none" : "text-lightGreen border-lightGreen cursor-pointer hover:bg-lightGreen hover:text-white duration-300 ease-in-out"}`}
                            onClick={() => handleChangePage(1, 0)}
                        />
                        <MdKeyboardDoubleArrowRight
                            className={`w-[30px] h-[30px] md:w-[36px] md:h-[36px] text-3xl md:text-4xl border-2
                                ${currentPage === pages?.totalPages ? "text-lightGray border-lightGray pointer-events-none" : "text-lightGreen border-lightGreen cursor-pointer hover:bg-lightGreen hover:text-white duration-300 ease-in-out"}`}
                            onClick={() => handleChangePage(2, 0)}
                        />
                    </div>
                ) : null}
            </div>
            <Footer />
        </div>
    );
}