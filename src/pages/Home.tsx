import { Link } from "react-router-dom";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import ApartmentItem from "../components/ApartmentItem.tsx";
import Search from "../components/Search.tsx";
import { useEffect, useState } from "react";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import axios from "axios";
import { ApartmentListItem, ApartmentResponse } from "../type.ts";

export default function Home() {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [indexCarousel, setIndexCarousel] = useState(0);
    const [visibleAmount, setVisibleAmount] = useState(4);
    const [topOffers, setTopOffers] = useState<ApartmentListItem[]>([]);
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

    useEffect(() => {
        console.log(name, type);
    }, [name, type]);

    const handleCallAPI = async () => {
        try {
            const response = await axios.get<ApartmentResponse[]>("http://localhost:8080/api/apartments/hot", {
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm token vào header
                },
            });
            console.log("API Response:", response.data);
            if (response.status === 200) {
                const apartments: ApartmentListItem[] = response.data.map((item: ApartmentResponse) => ({
                    id: item.id,
                    name: item.name,
                    slug: item.slug,
                    brief: item.brief,
                    price: item.price,
                    image: "https://ipzhywqybsdvoshfxaij.supabase.co/storage/v1/object/public/images/test.webp", // URL mặc định
                }));
                console.log("Mapped Apartments:", apartments);
                setTopOffers(apartments);
            }
        } catch (error) {
            console.error("API Error:", error);
        }
    };

    useEffect(() => {
        handleCallAPI();
        window.addEventListener("resize", handleGetAmount);
        handleGetAmount();
        return () => {
            window.removeEventListener("resize", handleGetAmount);
        };
    }, [token]); // Thêm token vào dependency để gọi lại khi token thay đổi

    const handleGetAmount = () => {
        if (window.innerWidth < 760) {
            setVisibleAmount(1);
        } else if (window.innerWidth < 1024) {
            setVisibleAmount(2);
        } else {
            setVisibleAmount(4);
        }
    };

    const handleCarousel = (type: number) => {
        if (type === 1) {
            setIndexCarousel(Math.min(indexCarousel + 1, topOffers.length - visibleAmount));
        } else if (type === -1) {
            setIndexCarousel(Math.max(0, indexCarousel - 1));
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="bg-[#CCFFCC]">
                <div className="mx-auto px-6 md:px-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <div className="lg:w-1/2 mb-8 md:mb-0 md:mt-28">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 my-4">
                                Modern living for everyone
                            </h1>
                            <p className="text-gray-700 mb-10">
                                We provide a complete service for the sale, purchase or rental of real estate. We have
                                been operating in Spain more than 15 years.
                            </p>
                            <div className="text-center mb-6">
                                <Search setName={setName} setType={setType} />
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <img
                                src="https://static.vecteezy.com/system/resources/previews/053/649/515/non_2x/isolated-office-building-symbol-on-for-architectural-designs-and-business-concepts-free-png.png"
                                alt="Modern apartment building"
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-blue-50 py-12">
                <div className="mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Top offers</h2>
                            <p className="text-gray-700">
                                Fulfill your career dreams, enjoy all the achievements of the city center and luxury
                                housing to the fullest.
                            </p>
                        </div>
                        <div className="flex items-center mt-4 md:mt-0 select-none">
                            <div className="mr-1 cursor-pointer" onClick={() => handleCarousel(-1)}>
                                <IoIosArrowDropleft className="text-4xl hover:text-lightGreenHover transition-all duration-300 ease-in-out" />
                            </div>
                            <div className="ml-1 cursor-pointer" onClick={() => handleCarousel(1)}>
                                <IoIosArrowDropright className="text-4xl hover:text-lightGreenHover transition-all duration-300 ease-in-out" />
                            </div>
                            <Link to="/apartments" className="text-xl ml-4 text-teal-500 hover:underline">
                                Show all
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topOffers.length > 0 ? (
                            topOffers.slice(indexCarousel, indexCarousel + visibleAmount).map((offer) => (
                                <ApartmentItem key={offer.id} apartment={offer} />
                            ))
                        ) : (
                            <p>No hot apartments available.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}