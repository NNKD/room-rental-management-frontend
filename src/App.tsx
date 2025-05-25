import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Kiểm tra token

  useEffect(() => {
    if (token) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
      <div>
        <Outlet />
      </div>
  );
}