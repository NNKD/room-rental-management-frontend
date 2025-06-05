import DynamicTable from "../../../components/DynamicTable.tsx";
import {ApartmentTypeDTO, TableHeader} from "../../../types/Dashboard.ts";
import axios from "axios";
import {envVar} from "../../../utils/EnvironmentVariables.ts";
import {NoticeType} from "../../../types/Context.ts";
import {useNotice} from "../../../hook/useNotice.ts";
import {useEffect, useState} from "react";
import {IoIosClose} from "react-icons/io";
import LoadingPage from "../../../components/LoadingPage.tsx";

export default function ApartmentTypeManagement() {
    const {setMessage, setType} = useNotice()
    const [types, setTypes] = useState<ApartmentTypeDTO[]>([])
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const typeDefault = {id: 0, name: "", description: ""};
    const [typeSelect, setTypeSelect] = useState<ApartmentTypeDTO>(typeDefault)

    const headers: TableHeader<ApartmentTypeDTO>[] = [
        {name: 'Loại phòng', slug: 'name'},
        {name: 'Mô tả', slug: 'description'},
    ]

    useEffect(() => {
        handleGetApartmentType()
    }, [])

    const handleGetApartmentType = async () => {
        try {
            const response = await axios.get(`${envVar.API_URL}/dashboard/types`);

            if (response.status === 200 && response.data.status == 'success' && response.data.statusCode == 200) {

                setTypes(response.data.data);
            }

        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error)) {
                setMessage((error.response?.data?.message ?? "Không rõ lỗi"));
            } else {
                setMessage("Đã có lỗi xảy ra không xác định");
            }
            console.log(error)
            setType(NoticeType.ERROR)
        }
    }

    const handleAddOrUpdateType = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`${envVar.API_URL}/dashboard/types`, typeSelect);

            if (response.status === 200 && response.data.status == 'success' && response.data.statusCode == 200) {
                setLoading(false)
                setType(NoticeType.SUCCESS)
                setMessage(response.data.data)
                handleGetApartmentType()
            }

        } catch (error) {
            setLoading(false)
            if (axios.isAxiosError(error)) {
                setMessage((error.response?.data?.message ?? "Không rõ lỗi"));
            } else {
                setMessage("Đã có lỗi xảy ra không xác định");
            }
            console.log(error)
            setType(NoticeType.ERROR)
        }
    }


    const handleDeleteType = async (id: string) => {
        setLoading(true)
        try {
            const response = await axios.delete(`${envVar.API_URL}/dashboard/types/${id}`);

            if (response.status === 200 && response.data.status == 'success' && response.data.statusCode == 200) {
                setLoading(false)
                setType(NoticeType.SUCCESS)
                setMessage(response.data.data)
                handleGetApartmentType()
            }

        } catch (error) {
            setLoading(false)
            if (axios.isAxiosError(error)) {
                setMessage((error.response?.data?.message ?? "Không rõ lỗi"));
            } else {
                setMessage("Đã có lỗi xảy ra không xác định");
            }
            console.log(error)
            setType(NoticeType.ERROR)
        }
    }


    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div className="ml-auto mb-4 bg-lightGreen w-fit px-10 py-2 rounded font-bold cursor-pointer shadow-[0_0_2px_1px_#ccc] hover:bg-lightGreenHover transition-all duration-300 ease-in-out"
                onClick={() => {setShowModal(!showModal); setTypeSelect(typeDefault)}}>
                Thêm loại căn hộ
            </div>
            <DynamicTable headers={headers} data={types} hasActionColumn={true} hasEdit={true}
                          onEdit={(id: string) => {setTypeSelect(types.filter(t => t.id == Number(id))[0]); setShowModal(!showModal)}}
                          onDelete={handleDeleteType} />

            {showModal ? (
                <div className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white w-1/3 p-4 rounded text-left">
                        <div className="ml-auto w-fit h-fit p-2 hover:cursor-pointer hover:text-lightGreen duration-300 transition-all ease-in-out"
                             onClick={() => setShowModal(!showModal)}>
                            <IoIosClose className="text-4xl"/>
                        </div>
                        <h1 className="font-bold text-xl text-center mb-8">Loại phòng</h1>
                        <div className="flex items-center justify-between gap-8 border-2 border-[#ccc] p-2 rounded mb-8">
                            <label className="text-base flex-shrink-0">Loại phòng</label>
                            <input type="text" placeholder="..." className="outline-none p-2 w-full" required={true}
                                   value={typeSelect?.name || ""}
                                   onChange={(e) => setTypeSelect(prev => ({...prev, name: e.target.value}))}/>
                        </div>
                        <label className="text-base flex-shrink-0">Mô tả</label>
                        <textarea className="outline-none mt-4 border-2 border-[#ccc] rounded p-2 w-full resize-none" rows={5} placeholder="..." required={true}
                                  value={typeSelect?.description || ""}
                                  onChange={(e) => setTypeSelect(prev => ({...prev, description: e.target.value}))}
                        ></textarea>
                        <div className="w-fit h-fit mx-auto mt-8 rounded border border-[#ccc] bg-lightGreen px-12 py-2 cursor-pointer hover:bg-lightGreenHover transition-all duration-300 ease-in-out"
                             onClick={() => handleAddOrUpdateType()}>
                            Lưu
                        </div>
                    </div>
                </div>
            ) : ""}

            {loading ? (
                <LoadingPage/>
            ) : ""}

        </div>
    )
}