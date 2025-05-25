import DynamicTable from "../../components/DynamicTable.tsx";
import { ApartmentPriceServiceType, TableHeader } from "../../type.ts";

export default function ApartmentPriceService() {
    // Dữ liệu mẫu cho bảng dịch vụ giá
    const sampleData: ApartmentPriceServiceType[] = [
        {
            id: 1,
            name: "Dịch vụ vệ sinh",
            description: "Vệ sinh chung cư hàng tuần",
            price: 500000.50,
            unit: "VNĐ/tháng",
        },
        {
            id: 2,
            name: "Bảo trì thang máy",
            description: "Bảo trì định kỳ thang máy",
            price: 300000.75,
            unit: "VNĐ/lần",
        },
        {
            id: 3,
            name: "Quản lý bãi đỗ xe",
            description: "Quản lý và thu phí bãi đỗ xe",
            price: 200000.00,
            unit: "VNĐ/tháng",
        },
        {
            id: 4,
            name: "Dịch vụ điện",
            description: "Cung cấp điện cho căn hộ",
            price: 3500.00,
            unit: "VNĐ/kWh",
        },
        {
            id: 5,
            name: "Dịch vụ nước",
            description: "Cung cấp nước sạch hàng tháng",
            price: 12000.00,
            unit: "VNĐ/m³",
        },
        {
            id: 6,
            name: "Dịch vụ internet",
            description: "Kết nối internet tốc độ cao",
            price: 250000.00,
            unit: "VNĐ/tháng",
        },
        {
            id: 7,
            name: "Bảo vệ tòa nhà",
            description: "Dịch vụ bảo vệ 24/7",
            price: 150000.00,
            unit: "VNĐ/tháng",
        },
        {
            id: 8,
            name: "Dịch vụ dọn rác",
            description: "Thu gom rác thải định kỳ",
            price: 80000.00,
            unit: "VNĐ/tháng",
        },
    ];

    // Định nghĩa header cho bảng
    const tableHeaders: TableHeader<ApartmentPriceServiceType>[] = [
        { name: "ID", slug: "id", sortASC: true },
        { name: "Tên dịch vụ", slug: "name", sortASC: true },
        { name: "Mô tả", slug: "description", sortASC: true },
        { name: "Giá", slug: "price", sortASC: true },
        { name: "Đơn vị", slug: "unit", sortASC: true },
    ];

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Quản lý Giá Dịch Vụ Tòa Nhà</h2>
            <DynamicTable
                headers={tableHeaders}
                data={sampleData}
                hasActionColumn={true}
            />
        </div>
    );
}