import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (location.pathname === "/" && token) {
      navigate("/home");
    }
  }, [token, location.pathname, navigate]);

  return (
      <div>
        <Outlet />
      </div>
  );
}
