import { useState } from "react";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import {ApartmentListItem} from "../type.ts";
import ApartmentItem from "../components/ApartmentItem.tsx";
import {apartmentPages} from "../data.ts";
import {PiArrowLeftBold, PiArrowRightBold} from "react-icons/pi";

export default function Home() {
    const [searchLocation, setSearchLocation] = useState("");
    const [apartments] = useState(apartmentPages.content)



    return (
        <div className="flex flex-col min-h-screen">
            {/* Navigation Bar */}
            <Header />

            {/* Hero Section */}
            {/*<div className="bg-white py-6 md:py-12">*/}
            <div className="bg-mincream">

            <div className="container mx-auto px-6 md:px-12" >
                    <div className="flex flex-col md:flex-row items-start justify-between">
                        <div className="md:w-1/2 mb-8 md:mb-0 md:mt-28">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Modern living for everyone</h1>
                            <p className="text-gray-700 mb-10">
                                We provide a complete service for the sale, purchase or rental of real estate. We have been operating in Spain more than 15 years.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-2 mb-6">
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        placeholder="Search of location"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md"
                                        value={searchLocation}
                                        onChange={(e) => setSearchLocation(e.target.value)}
                                    />
                                </div>
                                <div className="relative">
                                    <select className="w-full px-4 py-3 border border-gray-300 rounded-md appearance-none pr-10">
                                        <option>Property type</option>
                                        <option>Apartment</option>
                                        <option>House</option>
                                        <option>Villa</option>
                                    </select>
                                </div>
                                <button className="px-6 py-3 bg-teal-500 text-white font-medium rounded-md hover:bg-teal-600">
                                    Search
                                </button>
                            </div>
                        </div>

                        <div className="md:w-1/2">
                            <img
                                src="https://static.vecteezy.com/system/resources/previews/053/649/515/non_2x/isolated-office-building-symbol-on-for-architectural-designs-and-business-concepts-free-png.png"
                                alt="Modern apartment building"
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 bg-mincream m-6">
                {/* Tiêu đề + mô tả + nút */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Top offers</h2>
                        <p className="text-gray-500 max-w-md">
                            Fulfill your career dreams, enjoy all the achievements of the city center and luxury housing to the fullest.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <button className="w-10 h-10 flex hover:bg-teal-500 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100">
                            <PiArrowLeftBold className="w-6 h-6 text-gray-700" />
                        </button>

                        <button className="w-10 h-10 flex hover:bg-teal-400 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100">
                            <PiArrowRightBold className="w-6 h-6 text-gray-700" />
                        </button>

                        <button className="px-5 py-2 rounded-full border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition">
                            Show all offers
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-12 mt-6 justify-between mb-10">
                    {apartments.slice(0, 3).map((apartment: ApartmentListItem) => (
                        <ApartmentItem key={apartment.id} apartment={apartment} />
                    ))}
                </div>
            </div>



            <Footer />
        </div>
    );
}