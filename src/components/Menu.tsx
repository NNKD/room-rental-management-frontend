import {Link} from "react-router-dom";

/*
    showLogin: use to hide or show Đăng nhập. Value true | false
*/

export default function Menu({showLogin} : {showLogin: boolean}) {
    return (
        <div className={`flex flex-col lg:flex-row items-center gap-8`}>
            <Link to=""
                  className=" relative
                     lg:before:absolute lg:before:bottom-0 lg:before:left-1/2 lg:before:-translate-x-1/2
                     lg:before:w-0 lg:before:h-0.5 lg:hover:before:w-full
                     lg:before:bg-black
                     lg:before:transition-all lg:before:duration-300 lg:before:ease-in-out
                     text-base
                     py-2">
                Trang chủ
            </Link>
            <Link to=""
                  className=" relative
                     lg:before:absolute lg:before:bottom-0 lg:before:left-1/2 lg:before:-translate-x-1/2
                     lg:before:w-0 lg:before:h-0.5 lg:hover:before:w-full
                     lg:before:bg-black
                     lg:before:transition-all lg:before:duration-300 lg:before:ease-in-out
                     text-base
                     py-2">
                Căn hộ
            </Link>
            <Link to=""
                  className=" relative
                     lg:before:absolute lg:before:bottom-0 lg:before:left-1/2 lg:before:-translate-x-1/2
                     lg:before:w-0 lg:before:h-0.5 lg:hover:before:w-full
                     lg:before:bg-black
                     lg:before:transition-all lg:before:duration-300 lg:before:ease-in-out
                     text-base
                     py-2">
                Tiện ích
            </Link>

            {showLogin ? (
                <Link to=""
                      className=" relative
                        lg:before:absolute lg:before:bottom-0 lg:before:left-1/2 lg:before:-translate-x-1/2
                        lg:before:w-0 lg:before:h-0.5 lg:hover:before:w-full
                        lg:before:bg-black
                        lg:before:transition-all lg:before:duration-300 lg:before:ease-in-out
                        text-base
                        py-2">
                    Đăng nhập
                </Link>
            ) : ("")}

        </div>
    )
}