// src/pages/Contact.tsx
import React from 'react';
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

const Contact: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            {/* Banner */}
            <div className="bg-blue-500 text-white py-16 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-2">Hãy để đội ngũ tư vấn của Sapo hỗ trợ bạn</h1>
                    <p className="text-xl">dù ở bất kỳ nơi đâu</p>
                </div>
            </div>

            {/* Map and Contact Info */}
            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Map Section - 2/3 width */}
                <div className="lg:col-span-2 bg-white rounded shadow">
                    <iframe
                        src="https://www.google.com/maps/d/embed?mid=1s9z_QXEn7O4Vq83zs5WgWO9HZLM&hl=vi"
                        width="100%"
                        height="500"
                        title="Sapo Locations Map"
                        className="border-0"
                    ></iframe>
                </div>

                {/* Contact Info - 1/3 width */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded shadow p-6">
                        <h2 className="text-lg font-medium text-blue-600 mb-4">Hệ thống văn phòng và chi nhánh của Sapo trên toàn quốc</h2>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Tất cả Tỉnh/ Thành phố</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <hr className="border-gray-200" />
                        </div>

                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Trụ sở</h3>
                            <p className="text-sm text-gray-600 mb-2">Công ty CP Công nghệ Sapo Tầng 6 - 244 Đội Cấn, phường Liễu Giai, Quận Ba Đình, TP Hà Nội</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Khu vực miền Bắc:</h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>• 11A, Hàng Đồng, Nguyễn Dư, Hai Bà Trưng</li>
                                <li>• Số 6 đường 3, Phú Nam Đông, Phạm Thiết, TP.Nam Định, Tỉnh Nam Định</li>
                                <li>• T3 | Khu 2, Phố Lê Chân, Phường Hồng Hải, TP Hạ Long, Tỉnh Quảng Ninh</li>
                                <li>• 150 Tôn Đức Thắng, xã Sơn, Lê Chân, Hải Phòng</li>
                                <li>• 73G, 16-A9, Đường Xuân Hòa, Phường Phúc Diễn Phường, Thành phố Thái Nguyên, Tỉnh Thái Nguyên</li>
                                <li>• Số 80 Ngô Mân Thiên, Phường Tân An, TP.Bắc Ninh</li>
                                <li>• Số 13 Khu Âu Cơ Khu Thành Công, Tỉnh Thái Bình</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Methods */}
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-blue-800 mb-10">Tổng đài tư vấn và hỗ trợ trực tuyến</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Email */}
                    <div className="flex flex-col items-center">
                        <div className="bg-green-500 rounded-full p-4 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="font-medium mb-2">support@sapo.vn</p>
                        <p className="text-gray-600 text-sm">Email</p>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col items-center">
                        <div className="bg-blue-500 rounded-full p-4 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <p className="font-medium mb-2">1900 6750</p>
                        <p className="text-gray-600 text-sm">Tổng đài tư vấn</p>
                    </div>

                    {/* Website */}
                    <div className="flex flex-col items-center">
                        <div className="bg-orange-500 rounded-full p-4 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                        </div>
                        <p className="font-medium mb-2">www.support.sapo.vn</p>
                        <p className="text-gray-600 text-sm">Website</p>
                    </div>
                </div>
            </div>

            {/* Free Trial CTA */}
            <div className="bg-blue-500 text-white py-8 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4">Bắt đầu dùng thử miễn phí 7 ngày</h2>
                    <p className="mb-6">Đổi kinh nghiệm và phát triển cửa hàng với hỗ trợ đầy đủ từ Sapo</p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;