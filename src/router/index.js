import { createBrowserRouter } from "react-router-dom";
import  Header  from "../page/header";
import App from "../page/homepage"
import Attraction from "../page/attraction";
import Booking from "../page/booking";
import Thankyou from "../page/thankyou";

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
            },
            {
                path:"booking",
                element:<Booking/>
            },
            {
                path:"thankyou",
                element:<Thankyou/>
            }
        ]
    }
])

export default router;