import {Link} from "react-router-dom";

import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header/>

            <div className="flex-grow p-8 md:p-12">
                <p className="text-amber-500 text-2xl">Home Page</p>
                <Link className="underline" to="/apartments">Go to Apartment List</Link>
            </div>

            <Footer/>
        </div>
    )
}