import "./index.css"
import { Outlet } from "react-router-dom"
import { useLocation,useNavigate } from "react-router-dom"

const Footer=()=>{
    return (
      <div className="footer" id="footer"><div>COPYRIGHT © 2021 台北一日遊</div></div>
    )
  }

const Header=()=>{
    const navigate = useNavigate()
    const location = useLocation()
    
    return(
    <div className="body">
        <div className={`header__container ${(location.pathname.includes("attraction")||location.pathname.includes("booking")) && "header__container--border"} `}>
            <div className="header">
            <div className="header__homepage" onClick={()=>navigate("/")}>台北一日遊</div>
            <div className="header__login">
                <span>預定行程</span>
                <span>登入/註冊</span>
            </div>
            </div>
        </div>
        <Outlet/>
        <Footer/>
    </div>
    )
  }

  export default Header;