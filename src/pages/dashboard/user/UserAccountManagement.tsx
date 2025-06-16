import {useState} from "react";

export default function UserAccountManagement() {
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [username, setUsername] = useState("")

    return (
        <div className="text-left">
            <p className="font-bold text-2xl">Quản lý tài khoản</p>
            <input type="email" value={email}/>
            <input type="phone" value={phone}/>
            <input type="text" value={username}/>
        </div>
    )
}