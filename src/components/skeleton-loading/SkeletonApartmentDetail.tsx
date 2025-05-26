import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {FiPhone} from "react-icons/fi";
import {FaHome} from "react-icons/fa";
import {RiCustomSize} from "react-icons/ri";
import {CiLocationOn} from "react-icons/ci";


export default function SkeletonApartmentDetail() {
    return (
        <div className="flex-grow p-8 md:p-12">
            <div className="bg-zinc-300 w-full h-10 rounded-full animate-pulse"></div>
            <div className="flex flex-col lg:flex-row gap-10 mt-6">
                <div className="lg:w-[70%]">
                    <div className="aspect-[16/9] overflow-hidden rounded select-none">
                        <div className="bg-zinc-300 w-full h-full rounded animate-pulse"></div>
                    </div>
                    <div className="mt-4 mb-8 flex items-center justify-center gap-3 select-none">
                        <div className="w-[40px] h-[40px] md:w-[56px] md:h-[56px] flex items-center justify-center rounded-full flex-shrink-0 text-white bg-lightBlue pointer-events-none">
                            <IoIosArrowBack className="w-[24px] h-[24px]"/>
                        </div>

                        {Array.from({length: 3}).fill(0).map((_, index) => (
                            <div key={index} className="aspect-[16/9] w-[20%] overflow-hidden rounded cursor-pointer">
                                <div className="w-full h-full bg-zinc-300 rounded animate-pulse"></div>
                            </div>
                        ))}


                        <div className="w-[40px] h-[40px] md:w-[56px] md:h-[56px] flex items-center justify-center text-white  rounded-full flex-shrink-0 bg-lightBlue pointer-events-none">
                            <IoIosArrowForward className="w-[24px] h-[24px]"/>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row justify-around">
                        <div className="flex gap-2 items-center">
                            <FaHome className="text-5xl text-lightGreen"/>
                            <div className="w-24 h-10 bg-zinc-300 rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <RiCustomSize className="text-5xl text-lightGreen"/>
                            <div className="w-24 h-10 bg-zinc-300 rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <CiLocationOn  className="text-5xl text-lightGreen"/>
                            <div className="w-24 h-10 bg-zinc-300 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    <div className="md:px-16 mx-auto">
                        <div className="my-8 bg-lightBlue flex flex-col md:flex-row gap-10 items-center justify-between p-4 md:px-6 md:py-8 rounded">
                            <div className="bg-lightGreen text-center w-fit font-bold rounded px-8 md:px-12 py-3">
                                <p className="text-xl text-white">Thời hạn thuê</p>
                                <div className="w-40 h-10 mt-4 bg-zinc-300 rounded animate-pulse">
                                </div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-base">Giá mỗi tháng:</span>
                                <div className="w-24 h-8 bg-zinc-300 rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        <div className="my-10">
                            <h2 className="mb-4 font-bold text-xl">Thông tin cơ bản:</h2>
                            <ul className="list-disc pl-6">
                                <div className="w-full h-6 bg-zinc-300 rounded-full animate-pulse"></div>
                                <div className="w-full h-6 bg-zinc-300 rounded-full my-2 animate-pulse"></div>
                                <div className="w-full h-6 bg-zinc-300 rounded-full my-2 animate-pulse"></div>
                                <div className="w-full h-6 bg-zinc-300 rounded-full animate-pulse"></div>
                            </ul>
                        </div>

                        <div >
                            <h2 className="font-bold text-xl">Mô tả:</h2>

                            <div className="w-full h-6 bg-zinc-300 rounded-full mt-2 animate-pulse"></div>
                            <div className="w-full h-6 bg-zinc-300 rounded-full my-2 animate-pulse"></div>
                            <div className="w-full h-6 bg-zinc-300 rounded-full my-2 animate-pulse"></div>
                            <div className="w-full h-6 bg-zinc-300 rounded-full animate-pulse"></div>

                        </div>

                    </div>


                </div>
                <div className="lg:w-[30%]">
                    <div className="p-4 md:p-10 rounded bg-lightBlue">
                        <h2 className="font-bold text-xl">Liên hệ với chúng tôi</h2>
                        <div className="flex items-center my-2 gap-2">
                            <div className="w-[50px] h-[50px] rounded-full bg-zinc-300 animate-pulse"></div>
                            <div className="flex flex-col gap-1 justify-center">
                                <div className="w-40 h-4 bg-zinc-300 rounded-full animate-pulse"></div>
                                <div className="flex items-center justify-center gap-2">
                                    <FiPhone />
                                    <div className="w-40 h-4 bg-zinc-300 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="mb-1 text-base">Họ tên</p>
                            <input type="text" placeholder="Họ tên"
                                   className="p-2 w-full text-base outline-none border border-darkGray rounded"/>
                        </div>

                        <div className="my-4">
                            <p className="mb-1 text-base">Email</p>
                            <input type="email" placeholder="Email"
                                   className="p-2 w-full text-base outline-none border border-darkGray rounded required"/>
                        </div>

                        <div>
                            <p className="mb-1 text-base">Lời nhắn</p>
                            <textarea placeholder="Lời nhắn" rows={10}
                                      className="p-2 w-full text-base resize-none outline-none border border-darkGray rounded">

                                </textarea>
                        </div>
                        <div className="bg-lightBlue p-2 text-center text-base border-2 font-bold text-zinc-300 rounded mt-4 pointer-events-none">
                            Gửi lời nhắn
                        </div>
                    </div>
                    <div className="p-4 md:p-10 rounded mt-10 bg-lightBlue">
                        <div className="flex flex-col gap-4">
                            <h2 className="font-bold text-xl">Thông tin căn hộ</h2>
                            <div className="w-full h-6 bg-zinc-300 rounded-full animate-pulse"></div>
                            <div className="w-full h-6 bg-zinc-300 rounded-full animate-pulse"></div>
                            <div className="w-full h-6 bg-zinc-300 rounded-full animate-pulse"></div>
                            <div className="w-full h-6 bg-zinc-300 rounded-full animate-pulse"></div>
                            <div className="w-full h-6 bg-zinc-300 rounded-full animate-pulse"></div>
                            <div className="w-full h-6 bg-zinc-300 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}