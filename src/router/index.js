import { createBrowserRouter } from "react-router-dom";
import  Header  from "../page/header";
import App from "../page/homepage"
import Attraction from "../page/attraction";

const router = createBrowserRouter([
    {
        path:"/",
        element:<Header/>,
        children:[
            {
                index:true,
                element:<App/>
            },
            {
                path:"attraction/:id",
                element:<Attraction/>
            }
        ]
    }
])

export default router;