import {Outlet} from "react-router-dom";
import {NoticeProvider} from "./context/NoticeContext.tsx";
import NoticeUI from "./components/NoticeUI.tsx";

export default function App() {
  return (
      <>
          <NoticeProvider>
              <Outlet/>
              <NoticeUI/>
          </NoticeProvider>
      </>
  )
}