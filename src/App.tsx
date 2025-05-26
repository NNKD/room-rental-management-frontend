import {Outlet} from "react-router-dom";
import {NoticeProvider} from "./contexts/NoticeContext.tsx";
import NoticeUI from "./components/NoticeUI.tsx";
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
      <AuthProvider>
        <NoticeProvider>
              <Outlet/>
              <NoticeUI/>
          </NoticeProvider>
      </AuthProvider>
  );
}