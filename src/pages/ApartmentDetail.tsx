import {useParams} from "react-router-dom";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import {FiPhone} from "react-icons/fi";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {useState} from "react";

export default function ApartmentDetail() {
    const {slug} = useParams();
    const [indexCarousel, setIndexCarousel] = useState(0)

    const images = [
        "https://ipzhywqybsdvoshfxaij.supabase.co/storage/v1/object/public/images//test.webp",
        "https://ipzhywqybsdvoshfxaij.supabase.co/storage/v1/object/public/images//test.webp",
        "https://ipzhywqybsdvoshfxaij.supabase.co/storage/v1/object/public/images//test.webp",
        "https://ipzhywqybsdvoshfxaij.supabase.co/storage/v1/object/public/images//test.webp",
        "https://ipzhywqybsdvoshfxaij.supabase.co/storage/v1/object/public/images//test.webp",
    ]

    /*
     handle back or forward carousel
     type = 1 ==> Forward
     type = -1 ==> Back
     */

    const handleCarousel = (type: number) => {
        if (type === 1) {
            // Check max = length - 1 (last img)
            setIndexCarousel(Math.min(indexCarousel + 1, images.length - 1))
        }else if (type === -1) {
            // Check min = 0 (first img)
            setIndexCarousel(Math.max(0, indexCarousel - 1))
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>

            <div className="flex-grow p-8 md:p-12">
                <h2 className="font-bold text-4xl">Exclusive 5-room residence with a rooftop terrace {slug}</h2>
                <div className="flex flex-col lg:flex-row gap-10 mt-6">
                    <div className="w-[70%]">
                        <div className="aspect-[16/9] overflow-hidden rounded select-none">
                            <img src="https://ipzhywqybsdvoshfxaij.supabase.co/storage/v1/object/public/images//test.webp" className="w-full h-full object-cover rounded"/>
                        </div>
                        <div className="mt-4 mb-8 flex items-center justify-center gap-3 select-none">
                            <div className={`w-[56px] h-[56px] flex items-center justify-center rounded-full flex-shrink-0 text-white
                                            ${indexCarousel == 0 ? "bg-lightBlue pointer-events-none" : " bg-lightGreen"}`}
                                 onClick={() => handleCarousel(-1)}>
                                <IoIosArrowBack className="w-[24px] h-[24px]"/>
                            </div>

                            {/* show 3 images */}
                            {images.slice(indexCarousel, indexCarousel + 3).map((image, index) => (
                                <div className="aspect-[16/9] overflow-hidden rounded">
                                    <img src={image} key={index} className="w-full h-full object-cover rounded"/>
                                </div>
                            ))}

                            <div className={`w-[56px] h-[56px] flex items-center justify-center text-white  rounded-full flex-shrink-0
                                            ${indexCarousel == (images.length - 1) ? "bg-lightBlue pointer-events-none" : " bg-lightGreen"}`}
                                 onClick={() => handleCarousel(1)}>
                                <IoIosArrowForward className="w-[24px] h-[24px]"/>
                            </div>
                        </div>
                    </div>
                    <div className="w-[30%]">
                        <div className="p-10 bg-lightBlue">
                            <h2 className="font-bold text-xl">Contact us</h2>
                            <div className="flex items-center my-2 gap-2">
                                <img src="https://ipzhywqybsdvoshfxaij.supabase.co/storage/v1/object/public/images//test.webp" className="w-[50px] h-[50px] rounded-full" alt="avatar"/>
                                <div className="flex flex-col justify-center">
                                    <p className="text-base">Haylie Donin</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <FiPhone />
                                        <span className="underline text-base">+34 555 781 731</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="mb-1 text-base">Full name</p>
                                <input type="text" placeholder="Your full name" className="p-2 w-full text-base outline-none border border-darkGray rounded"/>
                            </div>

                            <div className="my-4">
                                <p className="mb-1 text-base">Email</p>
                                <input type="email" placeholder="Your email" className="p-2 w-full text-base outline-none border border-darkGray rounded"/>
                            </div>

                            <div>
                                <p className="mb-1 text-base">Your Message</p>
                                <textarea placeholder="Your message" rows={10} className="p-2 w-full text-base resize-none outline-none border border-darkGray rounded">

                                </textarea>
                            </div>
                            <div className="border-lightGreen p-2 text-center text-base border-2 font-bold text-lightGreen rounded mt-4 hover:bg-lightGreen hover:text-white duration-300 transition-all cursor-pointer ease-in-out">
                                Send Message
                            </div>
                        </div>
                        <div className="p-10 mt-10 bg-lightBlue">
                            <div className="flex flex-col gap-4">
                                <h2 className="font-bold text-xl">Brief characteristics</h2>
                                <div>
                                    <span className="text-base font-bold">City: </span>
                                    <span>Barcelona I</span>
                                </div>
                                <div>
                                    <span className="text-base font-bold">Street: </span>
                                    <span>Vincent ala Carne</span>
                                </div>
                                <div>
                                    <span className="text-base font-bold">Garages: </span>
                                    <span>2 cars</span>
                                </div>
                                <div>
                                    <span className="text-base font-bold">Number of rooms: </span>
                                    <span>5</span>
                                </div>
                                <div>
                                    <span className="text-base font-bold">Usable area: </span>
                                    <span>224 m<sup>2</sup></span>
                                </div>
                                <div>
                                    <span className="text-base font-bold">Total area: </span>
                                    <span>307 m<sup>2</sup></span>
                                </div>
                                <div>
                                    <span className="text-base font-bold">Insulated object: </span>
                                    <span>Yes</span>
                                </div>
                                <div>
                                    <span className="text-base font-bold">Balcony: </span>
                                    <span>Yes</span>
                                </div>
                                <div>
                                    <span className="text-base font-bold">Terrace: </span>
                                    <span>Yes</span>
                                </div>
                                <div>
                                    <span className="text-base font-bold">Number of bathrooms: </span>
                                    <span>1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}