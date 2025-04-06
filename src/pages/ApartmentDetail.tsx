import {useParams} from "react-router-dom";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import {FiPhone} from "react-icons/fi";

export default function ApartmentDetail() {
    const {slug} = useParams();

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>

            <div className="flex-grow p-8 md:p-12">
                <h2>Exclusive 5-room residence with a rooftop terrace {slug}</h2>
                <div className="flex flex-col lg:flex-row gap-10">
                    <div>
                        <img src="https://ipzhywqybsdvoshfxaij.supabase.co/storage/v1/object/public/images//test.webp" alt=""/>
                        <div>

                        </div>
                    </div>
                    <div>
                        <div className="p-10 bg-lightBlue">
                            <h2>Contact us</h2>
                            <div className="flex justify-center items-center">
                                <img src="" alt="avatar"/>
                                <div className="flex flex-col items-center justify-center">
                                    <p>Haylie Donin</p>
                                    <div className="flex items-center justify-center">
                                        <FiPhone />
                                        <span>+34 555 781 731</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p>Full name</p>
                                <input type="text" placeholder="Your full name" className="p-4 outline-none border border-darkGray rounded"/>
                            </div>

                            <div>
                                <p>Email</p>
                                <input type="email" placeholder="Your email" className="p-4 outline-none border border-darkGray rounded"/>
                            </div>

                            <div>
                                <p>Email</p>
                                <textarea placeholder="Your message" className="p-4 outline-none border border-darkGray rounded">

                                </textarea>
                            </div>
                            <div className="border-lightGreen text-lightGreen rounded">
                                Send Message
                            </div>
                        </div>
                        <div className="p-10 bg-lightBlue">
                            <h2>Brief characteristics</h2>

                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}