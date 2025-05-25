import {useParams} from "react-router-dom";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import {FiPhone} from "react-icons/fi";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {useState} from "react";
import {HiOutlineBuildingOffice2} from "react-icons/hi2";
import {RiCustomSize} from "react-icons/ri";
import {CiLocationOn} from "react-icons/ci";
import {relationApartment} from "../data.ts";
import {ApartmentListItem} from "../type.ts";
import ApartmentItem from "../components/ApartmentItem.tsx";

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
            // Max = length - visible. nếu nó lớn hơn thì next tiếp sẽ thiếu element
            const visibleAmount = window.innerWidth < 760 ? 2 : 3
            setIndexCarousel(Math.min(indexCarousel + 1, images.length - visibleAmount))
        }else if (type === -1) {
            // Min = 0 (vị trí đầu)
            setIndexCarousel(Math.max(0, indexCarousel - 1))
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>

            <div className="flex-grow p-8 md:p-12">
                <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl">Exclusive 5-room residence with a rooftop terrace {slug}</h2>
                <div className="flex flex-col lg:flex-row gap-10 mt-6">
                    <div className="lg:w-[70%]">
                        <div className="aspect-[16/9] overflow-hidden rounded select-none">
                            <img src="https://ipzhywqybsdvoshfxaij.supabase.co/storage/v1/object/public/images//test.webp" className="w-full h-full object-cover rounded"/>
                        </div>
                        <div className="mt-4 mb-8 flex items-center justify-center gap-3 select-none">
                            <div className={`w-[40px] h-[40px] md:w-[56px] md:h-[56px] flex items-center justify-center rounded-full flex-shrink-0 text-white
                                            ${indexCarousel == 0 ? "bg-lightBlue pointer-events-none" : " bg-lightGreen cursor-pointer hover:bg-lightGreenHover transition-all duration-300 ease-in-out"}`}
                                 onClick={() => handleCarousel(-1)}>
                                <IoIosArrowBack className="w-[24px] h-[24px]"/>
                            </div>

                            {/* show 3 images. Check if mobile (< 760) show 2 images */}
                            {images.slice(indexCarousel, indexCarousel + (window.innerWidth < 760 ? 2 : 3)).map((image, index) => (
                                <div key={index} className="aspect-[16/9] overflow-hidden rounded">
                                    <img src={image}  className="w-full h-full object-cover rounded"/>
                                </div>
                            ))}

                            <div className={`w-[40px] h-[40px] md:w-[56px] md:h-[56px] flex items-center justify-center text-white  rounded-full flex-shrink-0
                                            ${indexCarousel == (images.length - 3) ? "bg-lightBlue pointer-events-none" : " bg-lightGreen cursor-pointer hover:bg-lightGreenHover transition-all duration-300 ease-in-out"}`}
                                 onClick={() => handleCarousel(1)}>
                                <IoIosArrowForward className="w-[24px] h-[24px]"/>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 md:flex-row justify-around">
                            <div className="flex gap-2 items-center">
                                <HiOutlineBuildingOffice2 className="text-5xl text-lightGreen"/>
                                <span className="font-bold text-xl">a Flat</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <RiCustomSize className="text-5xl text-lightGreen"/>
                                <span className="font-bold text-xl">224 m<sup>2</sup></span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <CiLocationOn  className="text-5xl text-lightGreen"/>
                                <span className="font-bold text-xl">Barcelona I.</span>
                            </div>
                        </div>

                        <div className="md:px-16 mx-auto">
                            <div className="my-8 bg-lightBlue flex flex-col md:flex-row gap-4 justify-between p-4 md:px-6 md:py-8 rounded">
                                <div className="flex flex-col justify-center">
                                    <span className="text-base">Mortgage since:</span>
                                    <span className="text-xl font-bold text-lightGreen">807.57 €/ month</span>
                                </div>
                                <div className="bg-lightGreen text-center w-fit text-white font-bold rounded px-8 md:px-12 py-3 cursor-pointer hover:bg-lightGreenHover duration-300 transition-all ease-in-out">
                                    Get a mortage
                                </div>
                            </div>

                            <div>
                                <p className="text-base">
                                    Real estate offers an exclusive FOR SALE elegant large 5-room apartment on Vincent Hložník Street in the Condominium Renaissance residential complex.
                                </p>

                                <p className="my-4 text-base">
                                    Thanks to its unique location, the property has access to a large Japanese garden with an area of 35 m², which can be accessed directly from the bedroom. The front of the apartment is at the height of the third floor, so the terrace is located just above the treetops, which gives the apartment a unique atmosphere. Overall, the apartment has a direct view of the Danube River and the surrounding forests.
                                </p>

                                <p className="text-base">
                                    The apartment offers extraordinary comfort, has a first-class interior from the leading architectural office Cakov Makara and equipment from renowned world furniture manufacturers. The overall atmosphere of the apartment is completed
                                </p>
                            </div>

                            <div className="my-10">
                                <h2 className="mb-4 font-bold text-xl">Basic characteristics:</h2>
                                <ul className="list-disc pl-6">
                                    <li>number of rooms: 5</li>
                                    <li>2nd floor of 5</li>
                                    <li>apartment area: 223.92 m2</li>
                                    <li>terrace area: 27.09 m2</li>
                                    <li>balcony area: 6.63 m2</li>
                                    <li>area of the Japanese garden: 35 m2</li>
                                </ul>
                            </div>

                            <div >
                                <h2 className="font-bold text-xl">Layout solution:</h2>

                                <p className="my-4">
                                    Kitchen, living room, study, 4 bedrooms, 2 bathrooms, wardrobe, fireplace. Two garage parking spaces in the underground garage.
                                </p>

                                <p>
                                    The apartment is divided into day and night zone. The living area consists of a large living room, which is connected to the kitchen and dining room. In this part of the apartment there is also a study, which is very subtly separated from the living area by an elegant glass wall and wooden beams. From the living area there is a smooth transition to the night wing, where there are two rooms, a wardrobe, a shared bathroom and a master bedroom with a separate bathroom.
                                </p>
                            </div>

                            <div className="my-10">
                                <h2 className="font-bold text-xl">Execution and furnishing of the apartment:</h2>

                                <p className="my-4">
                                    The apartment has intelligent control via a mobile application. Premium natural materials - wood, stone tiles, cast concrete - are found in many places in the living space.
                                </p>

                                <p>
                                    The kitchen of the LEICHT brand with SIEMENS appliances has been made to measure, bathrooms and toilets are equipped with sanitary ware from the manufacturers VILLEROY BOCH and HANSGROHE. In the master bathroom you will find the design edition of the AXOR MASSAUD brand, the master bedroom is dominated by the RUF BETTEN bed. The living room is equipped with ROLF BENZ brand products.
                                </p>
                            </div>

                            <div>
                                <h2 className="font-bold text-xl">Location:</h2>

                                <p className="my-4">
                                    The apartment has intelligent control via a mobile application. Premium natural materials - wood, stone tiles, cast concrete - are found in many places in the living space.
                                </p>

                                <p>
                                    The property is located above Passeig de Gràcia, there is an excellent transport connection. The nearby housing estate provides complete civic amenities, including shops, cafes, restaurants, schools, kindergartens and many other benefits.
                                </p>

                                <div className="rounded mt-4 aspect-[16/9] overflow-hidden">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.220483632046!2d106.78897027332259!3d10.870827989283695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752700665a002d%3A0xfc064824c164728b!2zS2hvYSBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiwgxJBIIE7DtG5nIEzDom0gVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1744011929039!5m2!1svi!2s"
                                        width="600" height="450" className="w-full h-full" allowFullScreen={true} loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"></iframe>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div className="lg:w-[30%]">
                        <div className="p-4 md:p-10 rounded bg-lightBlue">
                            <h2 className="font-bold text-xl">Contact us</h2>
                            <div className="flex items-center my-2 gap-2">
                                <img
                                    src="https://ipzhywqybsdvoshfxaij.supabase.co/storage/v1/object/public/images//test.webp"
                                    className="w-[50px] h-[50px] rounded-full" alt="avatar"/>
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
                        <div className="p-4 md:p-10 rounded mt-10 bg-lightBlue">
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

                <div className="mt-20 text-center">
                    <h2 className="font-bold text-xl">You might be interested in</h2>
                    <div className="flex flex-col gap-6 md:flex-row items-center mt-6 justify-evenly">
                        {relationApartment.map((apartment: ApartmentListItem) => (
                            <div className="md:w-1/3">
                                <ApartmentItem key={apartment.id} apartment={apartment} />
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <Footer/>
        </div>
    )
}