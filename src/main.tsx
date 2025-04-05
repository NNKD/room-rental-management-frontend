import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css"

import Login from "./pages/Login.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*<RouterProvider router={router}/>*/}
      <Login></Login>
  </StrictMode>,
)
