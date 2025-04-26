import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

export default function Home() {
    const [searchLocation, setSearchLocation] = useState("");

    const topOffers = [
        {
            id: 1,
            title: "Large 4-room apartment with a beautiful terrace",
            price: "320.000€",
            location: "Barcelona IV",
            image: "https://static.vecteezy.com/system/resources/previews/053/649/515/non_2x/isolated-office-building-symbol-on-for-architectural-designs-and-business-concepts-free-png.png"
        },
        {
            id: 2,
            title: "Magnificent duplex in a private villa",
            price: "315.000€",
            location: "Barcelona II",
            image: "https://static.vecteezy.com/system/resources/previews/053/649/515/non_2x/isolated-office-building-symbol-on-for-architectural-designs-and-business-concepts-free-png.png"
        },
        {
            id: 3,
            title: "El large design apartment with terrace",
            price: "280.000€",
            location: "Madrid VI",
            image: "https://static.vecteezy.com/system/resources/previews/053/649/515/non_2x/isolated-office-building-symbol-on-for-architectural-designs-and-business-concepts-free-png.png"
        },
        {
            id: 4,
            title: "Elegant apartment with private terrace",
            price: "325.000€",
            location: "Madrid V",
            image: "https://static.vecteezy.com/system/resources/previews/053/649/515/non_2x/isolated-office-building-symbol-on-for-architectural-designs-and-business-concepts-free-png.png"
        }
    ];

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

            {/* Top Offers Section */}
            <div className="bg-blue-50 py-12">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Top offers</h2>
                            <p className="text-gray-700">
                                Fulfill your career dreams, enjoy all the achievements of the city center and luxury housing to the fullest.
                            </p>
                        </div>
                        <div className="flex items-center mt-4 md:mt-0">
                            <button className="p-2 rounded-full border border-gray-300 mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button className="p-2 rounded-full bg-teal-500 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <Link to="/all-offers" className="ml-4 text-teal-500 hover:underline">
                                Show all offers
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topOffers.map((offer) => (
                            <div key={offer.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                                <img src={offer.image} alt={offer.title} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-800 mb-2">{offer.title}</h3>
                                    <p className="text-teal-500 font-bold">{offer.price}</p>
                                    <p className="text-gray-500 text-sm">{offer.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}