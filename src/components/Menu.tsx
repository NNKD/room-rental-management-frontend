import {Link} from "react-router-dom";

/*
    showLogin: use to hide or show Đăng nhập. Value true | false
    textColor: use to set text color. Value: text-white, text-black, text-[#ccc],...
    underlineColor: use to set underline color when hover. Value: lg:before:bg-white, lg:before:bg-black, lg:before:bg-[#ccc]
*/

export default function Menu({showLogin, textColor, underlineColor} : {showLogin: boolean, textColor: string, underlineColor: string}) {
    return (
        <div className={`flex flex-col md:flex-row md:items-center md:gap-8 lg:gap-12`}>
            <Link to=""
                  className={` relative
                     lg:before:absolute lg:before:bottom-0 lg:before:left-1/2 lg:before:-translate-x-1/2
                     lg:before:w-0 lg:before:h-0.5 lg:hover:before:w-full
                     ${underlineColor}
                     lg:before:transition-all lg:before:duration-300 lg:before:ease-in-out
                     text-base ${textColor}
                     py-2`}>
                Trang chủ
            </Link>
            <Link to=""
                  className={` relative
                     lg:before:absolute lg:before:bottom-0 lg:before:left-1/2 lg:before:-translate-x-1/2
                     lg:before:w-0 lg:before:h-0.5 lg:hover:before:w-full
                     ${underlineColor}
                     lg:before:transition-all lg:before:duration-300 lg:before:ease-in-out
                     text-base ${textColor}
                     py-2`}>
                Căn hộ
            </Link>
            <Link to=""
                  className={` relative
                     lg:before:absolute lg:before:bottom-0 lg:before:left-1/2 lg:before:-translate-x-1/2
                     lg:before:w-0 lg:before:h-0.5 lg:hover:before:w-full
                     ${underlineColor}
                     lg:before:transition-all lg:before:duration-300 lg:before:ease-in-out
                     text-base ${textColor}
                     py-2`}>
                Tiện ích
            </Link>
            <Link to=""
                  className={` relative
                     lg:before:absolute lg:before:bottom-0 lg:before:left-1/2 lg:before:-translate-x-1/2
                     lg:before:w-0 lg:before:h-0.5 lg:hover:before:w-full
                     ${underlineColor}
                     lg:before:transition-all lg:before:duration-300 lg:before:ease-in-out
                     text-base ${textColor}
                     py-2`}>
                Liên hệ
            </Link>

            {showLogin ? (
                <Link to=""
                      className={` relative
                        lg:before:absolute lg:before:bottom-0 lg:before:left-1/2 lg:before:-translate-x-1/2
                        lg:before:w-0 lg:before:h-0.5 lg:hover:before:w-full
                        ${underlineColor}
                        lg:before:transition-all lg:before:duration-300 lg:before:ease-in-out
                        text-base ${textColor}
                        py-2`}>
                    Đăng nhập
                </Link>
            ) : ("")}

        </div>
    )
}