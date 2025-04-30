import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import {PiBuildings, PiLifebuoyFill, PiTowel} from "react-icons/pi";
import {IoFastFoodOutline} from "react-icons/io5";
import {GrHostMaintenance} from "react-icons/gr";
import {BsCarFront} from "react-icons/bs";
import {FaChargingStation, FaSpa, FaStore, FaWifi} from "react-icons/fa6";
import {FaSwimmingPool} from "react-icons/fa";
import {LuCctv} from "react-icons/lu";
import {TbBulb, TbHorseToy, TbMonkeybar} from "react-icons/tb";
import {
    MdOutlineBedroomParent, MdOutlineDeck,
    MdOutlineDesignServices,
    MdOutlineLocalLaundryService,
    MdOutlineWorkspacePremium
} from "react-icons/md";
import {GiKidSlide, GiTreeSwing} from "react-icons/gi";

export default function Amenities() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header/>

            <div className="flex-grow mx-auto my-10 px-6 md:px-12">
                <div className="flex items-center justify-center gap-10">
                    <div className="w-2/5">
                        <h3 className="text-4xl font-bold">Swimming Pool</h3>
                        <p className="text-base mt-4 mb-10">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium aperiam autem corporis cum, esse fugit molestiae mollitia necessitatibus nesciunt nihil odit officiis quo recusandae repudiandae sunt temporibus totam voluptatem.</p>
                        <div className="grid grid-cols-2 grid-rows-2 gap-8">
                            <div className="flex items-center gap-3">
                                <PiTowel className="text-xl"/>
                                <span className="text-base font-bold">Fresh Towels Daily</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <IoFastFoodOutline className="text-xl"/>
                                <span className="text-base font-bold">Snack At The Pool</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <PiLifebuoyFill className="text-xl"/>
                                <span className="text-base font-bold">Lifeguard On Duty</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <GrHostMaintenance className="text-xl"/>
                                <span className="text-base font-bold">Proper Maintenance</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-3/5 flex items-center gap-4">
                        <div>
                            <img src="https://ipzhywqybsdvoshfxaij.supabase.co/storage/v1/object/public/images//sp1.png"/>
                        </div>
                        <div>
                            <img src="https://ipzhywqybsdvoshfxaij.supabase.co/storage/v1/object/public/images//sp2.png"/>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-10 my-20">
                    <div className="w-3/5 flex items-center gap-4">
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1745998143/bi1_zoiemo.png"/>
                        </div>
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1745998141/bi2_qymoys.png"/>
                        </div>
                    </div>

                    <div className="w-2/5">
                        <h3 className="text-4xl font-bold">Best Interiors</h3>
                        <p className="text-base mt-4 mb-10">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium aperiam autem corporis cum, esse fugit molestiae mollitia necessitatibus nesciunt nihil odit officiis quo recusandae repudiandae sunt temporibus totam voluptatem.</p>
                        <div className="grid grid-cols-2 grid-rows-2 gap-8">
                            <div className="flex items-center gap-3">
                                <PiBuildings className="text-xl"/>
                                <span className="text-base font-bold">Elegant Design</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <TbBulb className="text-xl"/>
                                <span className="text-base font-bold">Hi-Tech Design</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MdOutlineDesignServices  className="text-xl"/>
                                <span className="text-base font-bold">Smart Architecture</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MdOutlineWorkspacePremium className="text-xl"/>
                                <span className="text-base font-bold">Premium Materials</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-10">
                    <div className="w-2/5">
                        <h3 className="text-4xl font-bold">Modern Loft</h3>
                        <p className="text-base mt-4 mb-10">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium aperiam autem corporis cum, esse fugit molestiae mollitia necessitatibus nesciunt nihil odit officiis quo recusandae repudiandae sunt temporibus totam voluptatem.</p>
                        <div className="grid grid-cols-2 grid-rows-2 gap-8">
                            <div className="flex items-center gap-3">
                                <MdOutlineLocalLaundryService className="text-xl"/>
                                <span className="text-base font-bold">Laundry Facilities</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MdOutlineDeck className="text-xl"/>
                                <span className="text-base font-bold">Rooftop Deck</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MdOutlineBedroomParent className="text-xl"/>
                                <span className="text-base font-bold">Family Rooms</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaChargingStation className="text-xl"/>
                                <span className="text-base font-bold">Charging Stations</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-3/5 flex items-center gap-4">
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1745998162/ml1_kzqoxm.png"/>
                        </div>
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1745998153/ml2_kg5zvn.png"/>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-10 my-20">
                    <div className="w-3/5 flex items-center gap-4">
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1745998142/k1_mhnewb.png"/>
                        </div>
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1745998173/k2_uyjsya.png"/>
                        </div>
                    </div>

                    <div className="w-2/5">
                        <h3 className="text-4xl font-bold">Kids Play Area</h3>
                        <p className="text-base mt-4 mb-10">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium aperiam autem corporis cum, esse fugit molestiae mollitia necessitatibus nesciunt nihil odit officiis quo recusandae repudiandae sunt temporibus totam voluptatem.</p>
                        <div className="grid grid-cols-2 grid-rows-2 gap-8">
                            <div className="flex items-center gap-3">
                                <GiTreeSwing className="text-xl"/>
                                <span className="text-base font-bold">Merry-Go-Round</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <GiKidSlide className="text-xl"/>
                                <span className="text-base font-bold">Teeter - Totter</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <TbMonkeybar className="text-xl"/>
                                <span className="text-base font-bold">Monkey Bar</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <TbHorseToy className="text-xl"/>
                                <span className="text-base font-bold">Spring Riders</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-around items-center flex-wrap gap-y-20 mb-16">

                    <div className="flex justify-center items-center gap-4 p-6
                                 hover:cursor-pointer hover:shadow-[0_0_4px_3px_#ccc] transition-all duration-300 ease-in-out">
                        <BsCarFront className="text-5xl"/>
                        <div>
                            <h4 className="text-xl font-bold mb-2">Car Parking</h4>
                            <p className="text-sm">Aldus Corporation, which later merged <br/>Adobe Systems, ushered lorem</p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-4 p-6
                                 hover:cursor-pointer hover:shadow-[0_0_4px_3px_#ccc] transition-all duration-300 ease-in-out">
                        <FaSpa className="text-5xl"/>
                        <div>
                            <h4 className="text-xl font-bold mb-2">Spa & Massage</h4>
                            <p className="text-sm">Aldus Corporation, which later merged <br/>Adobe Systems, ushered lorem</p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-4 p-6
                                 hover:cursor-pointer hover:shadow-[0_0_4px_3px_#ccc] transition-all duration-300 ease-in-out">
                        <FaWifi className="text-5xl"/>
                        <div>
                            <h4 className="text-xl font-bold mb-2">Free Wifi</h4>
                            <p className="text-sm">Aldus Corporation, which later merged <br/>Adobe Systems, ushered lorem</p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-4 p-6
                                 hover:cursor-pointer hover:shadow-[0_0_4px_3px_#ccc] transition-all duration-300 ease-in-out">
                        <FaStore  className="text-5xl"/>
                        <div>
                            <h4 className="text-xl font-bold mb-2">Supermarket</h4>
                            <p className="text-sm">Aldus Corporation, which later merged <br/>Adobe Systems, ushered lorem</p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-4 p-6
                                 hover:cursor-pointer hover:shadow-[0_0_4px_3px_#ccc] transition-all duration-300 ease-in-out">
                        <FaSwimmingPool  className="text-5xl"/>
                        <div>
                            <h4 className="text-xl font-bold mb-2">Outdoor Pool</h4>
                            <p className="text-sm">Aldus Corporation, which later merged <br/>Adobe Systems, ushered lorem</p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-4 p-6
                                 hover:cursor-pointer hover:shadow-[0_0_4px_3px_#ccc] transition-all duration-300 ease-in-out">
                        <LuCctv  className="text-5xl"/>
                        <div>
                            <h4 className="text-xl font-bold mb-2">Secure Camera</h4>
                            <p className="text-sm">Aldus Corporation, which later merged <br/>Adobe Systems, ushered lorem</p>
                        </div>
                    </div>

                </div>

            </div>

            <Footer/>
        </div>
    )
}