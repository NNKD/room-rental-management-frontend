import {Link} from "react-router-dom";

/*
    flexDirection: show menu column or row. Value: flex-col | flex-row
    showLogin: use to hide or show Đăng nhập. Value true | false
*/

export default function Menu({flexDirection, showLogin} : {flexDirection: string, showLogin: boolean}) {
    return (
        <div className={`flex ${flexDirection} items-center gap-8`}>
            <Link to=""
                  className=" relative
                     before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2
                     before:w-0 before:h-0.5 hover:before:w-full
                     before:bg-black
                     before:transition-all before:duration-300 before:ease-in-out
                     text-base
                     py-2">
                Trang chủ
            </Link>
            <Link to=""
                  className=" relative
                     before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2
                     before:w-0 before:h-0.5 hover:before:w-full
                     before:bg-black
                     before:transition-all before:duration-300 before:ease-in-out
                     text-base
                     py-2">
                Căn hộ
            </Link>
            <Link to=""
                  className=" relative
                     before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2
                     before:w-0 before:h-0.5 hover:before:w-full
                     before:bg-black
                     before:transition-all before:duration-300 before:ease-in-out
                     text-base
                     py-2">
                Tiện ích
            </Link>

            {showLogin ? (
                <Link to=""
                      className="relative
                         before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2
                         before:w-0 before:h-0.5 hover:before:w-full
                         before:bg-black
                         before:transition-all before:duration-300 before:ease-in-out
                         text-base
                         py-2">
                    Đăng nhập
                </Link>
            ) : ("")}

        </div>
    )
}