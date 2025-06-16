import {useEffect, useState} from "react";
import axios, {AxiosError} from "axios";
import {envVar} from "../../../utils/EnvironmentVariables.ts";
import {NoticeType} from "../../../types/Context.ts";
import {useNotice} from "../../../hook/useNotice.ts";
import {getToken} from "../../../utils/TokenUtils.ts";
import {useLoading} from "../../../contexts/LoadingContext.tsx";
import {useSearchParams} from "react-router-dom";

export default function ChangePass() {
    const [pass, setPass] = useState("")
    const [newPass, setNewPass] = useState("")
    const [confirmPass, setConfirmPass] = useState("")
    const { setMessage, setType } = useNotice();
    const {setApiLoading} = useLoading();
    const token = getToken();
    const [searchParams] = useSearchParams();
    const statusVNPAY = searchParams.get("statusVNPAY");

    useEffect(() => {
        if (statusVNPAY) {
            if (statusVNPAY == "success") {
                setMessage("Thanh toán thành công")
                setType(NoticeType.SUCCESS)
            }else {
                setMessage("Lỗi thanh toán")
                setType(NoticeType.ERROR)
            }
        }

    }, [statusVNPAY]);

    const handleSave = async () => {
        if (newPass != confirmPass) {
            setMessage("Mật khẩu nhập lại không đúng");
            setType(NoticeType.ERROR);
        }else {
            handleUpdatePass()
        }
    }

    const handleUpdatePass = async () => {
        setApiLoading(true);
        try {
            const response = await axios.put(`${envVar.API_URL}/dashboard-user/me/account/update-pass`, {
                pass: pass,
                newPass: newPass,
                },
            {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response.data)
            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                setMessage(response.data.data);
                setType(NoticeType.SUCCESS);
            }else {
                setMessage(response.data.message);
                setType(NoticeType.ERROR);
            }

        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setMessage(axiosError.response?.data?.message || "Lỗi xảy ra");
            setType(NoticeType.ERROR);
        } finally {
            setApiLoading(false);
        }
    }

    return (
        <div className="text-left">
            <p className="font-bold text-2xl mb-6">Đổi mật khẩu</p>
            <div className="flex flex-col gap-4">
                <input type="password" value={pass} placeholder="Mật khẩu hiện tại" className="w-full outline-none border-none px-2 py-1" onChange={(e) => setPass(e.target.value)} />
                <input type="password" value={newPass} placeholder="Mật khẩu mới" className="w-full outline-none border-none px-2 py-1" onChange={(e) => setNewPass(e.target.value)} />
                <input type="password" value={confirmPass} placeholder="Nhập lại mật khẩu mới" className="w-full outline-none border-none px-2 py-1" onChange={(e) => setConfirmPass(e.target.value)} />
            </div>
            <div className="mx-auto mt-8 bg-lightGreen w-fit px-10 py-2 rounded font-bold cursor-pointer shadow-[0_0_2px_1px_#ccc] hover:bg-lightGreenHover transition-all duration-300 ease-in-out"
                 onClick={() => handleSave()}>
                Lưu
            </div>
        </div>
    )
}