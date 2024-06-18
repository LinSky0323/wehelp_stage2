import "./index.css"
import { useEffect, useState,useRef } from "react"
import { Outlet } from "react-router-dom"
import { useDispatch,useSelector } from "react-redux"
import { fetchUser,clearCurrentUser, openRL, closeRL } from "../store/modules/store"
import { useLocation,useNavigate } from "react-router-dom"
//統一修改圖片路境，為了應對開發環境跟build的靜態物件
import {imgUrl,RegUrl,UserUrl} from "./apiUrl"

const Footer=()=>{
    return (
      <div className="footer" id="footer"><div>COPYRIGHT © 2021 台北一日遊</div></div>
    )
  }

const R_L=()=>{
  const [login,setLogin] = useState("login")    //登入框內容是什麼
  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [inf,setInf] = useState("")             //訊息
  const dispatch = useDispatch()
  const {rlWindow,currentUser} = useSelector(state=>state.attractions)  //是否顯示登入框&當前使用者資訊
  const location = useLocation()
  const errorInfRef = useRef(null)          //錯誤訊息(或登入成功的提示)，只顯示2S
  const btnRef = useRef(null)
  const clickRLclose=()=>{    //關閉登入框並重製裡面的資訊
    dispatch(closeRL())
    setLogin("login")
    setEmail("")
    setPassword("")
    setUsername("")
  }
  const toReg=()=>{           //切換至註冊
    setLogin("reg")
  }
  const toLogin=()=>{         //切換至登入
    setLogin("login")
  }
  
  const clickLogin=()=>{      //函式：發送登入
    async function log(email,password){   
      const res = await fetch(UserUrl+`?email=${email}&password=${password}`,{method:"PUT"})
      const data = await res.json()
      if(data.hasOwnProperty("error")){
        errorInfRef.current.classList.add("rl__errorInf--open")
        setLogin("login_error")
        setInf(data["message"])
        setTimeout(()=>{
          errorInfRef.current.classList.remove("rl__errorInf--open")
        },2000)
      }
      else if(data.hasOwnProperty("token")){
        setLogin("login_ok")
        setInf("歡迎光臨,網頁將在3秒後返回您剛剛使用的頁面")
        setEmail("")
        setPassword("")
        setUsername("")
        localStorage.setItem("token",data.token)
        dispatch(fetchUser(data.token))
        setTimeout(()=>{
          dispatch(closeRL())
          setLogin("login")
        },3000)
      }
    }
    if(email && password){
      log(email,password)
    }
    
  }
  
  const clickReg=()=>{        //函式：發送註冊
    async function reg(username,email,password){
      const res = await fetch(RegUrl+`?name=${username}&email=${email}&password=${password}`,{
        method:"POST"
        })
      const data = await res.json();
      console.log(data)
      if(data.hasOwnProperty("error")){
        errorInfRef.current.classList.add("rl__errorInf--open")
        setLogin("reg_error")
        setInf(data["message"])
        setTimeout(()=>{
          errorInfRef.current.classList.remove("rl__errorInf--open")
        },2000)
      }
      else if(data.hasOwnProperty("ok")){
        errorInfRef.current.classList.add("rl__errorInf--open")
        setLogin("login")
        setInf("恭喜你~成功註冊了一個帳號")
        setEmail("")
        setPassword("")
        setUsername("")
        setTimeout(()=>{
          errorInfRef.current.classList.remove("rl__errorInf--open")
        },2000)
      }
    }
    if(email && password && username ){
      reg(username,email,password)
    }
  }
  const signout=()=>{         //函式：發送登出
    localStorage.removeItem("token")
    dispatch(clearCurrentUser())
    dispatch(closeRL())
  }
  const send=(e)=>{
    if(e.key==="Enter"){
      btnRef.current.click()
    }
  }

  if(rlWindow){
    return(
      <div className="rl__background">
        <div className="rl__container">
          <img src={(location.pathname.includes("attraction")||location.pathname.includes("booking"))?imgUrl+"/icon_close.png":imgUrl+"icon_close.png"} className="rl__close" onClick={clickRLclose} alt="X"/>
          <div className="rl__topbar"></div>
          <div >
            {((login==="login"||login==="reg"||login==="reg_error"||login==="login_error")&&(!currentUser.name)) &&
            <div>
              <div className="rl__title">{login.includes("login")?"登入會員帳號":"註冊會員帳號"}</div>
              <div className="rl__form">
              <input
              className={login.includes("login")?"rl__username":"rl__input"}
              type="text"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              placeholder="輸入姓名"
              onKeyDown={(e)=>send(e)}>
              </input> 
              <input
              className="rl__input"
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="輸入電子郵件"
              onKeyDown={(e)=>send(e)}>
              </input>  
              <input
              className="rl__input"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="輸入密碼"
              onKeyDown={(e)=>send(e)}>
              </input>
              <button className="rl__btn" onClick={login.includes("login")?clickLogin:clickReg} ref={btnRef}
              >{login.includes("login")?"登入帳戶":"註冊新帳戶"}</button>
              </div>
              <div ref={errorInfRef} className="rl__errorInf">{inf}</div>
            <div className="rl__toggle">{login.includes("login")?"還沒有帳戶？":"已經有帳戶了？"}<span onClick={login.includes("login")?toReg:toLogin}>{login.includes("login")?"點此註冊":"點此登入"}</span></div>
            </div>}
            {(login==="login_ok")&&
            <div>
              <div className="rl__title">登入成功</div>
              <div className="rl__inf">{inf}</div>
              <button className="rl__btn rl__btn--spe" onClick={clickRLclose}
              >立即返回</button>
            </div>}
            {(currentUser.name&&login !== "login_ok")&&
            <div>
              <div className="rl__title">登出帳號</div>
              <div className="rl__inf">你是否要登出帳號？</div>
              <button className="rl__btn rl__btn--spe" onClick={signout}
              >登出</button>
            </div>}
          </div>
        </div>
      </div>
    )
  }
}

const Header=()=>{
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const clickRL = ()=>{
      dispatch(openRL())
    }
    useEffect(()=>{           //使用者驗證：將api返回的資料存入redux,currentUse===Null表示未登入
      const token = localStorage.getItem("token")
      dispatch(fetchUser(token))
    },[dispatch])
    const {currentUser} = useSelector(state=>state.attractions)
    return(
    <div className="body">
        <div className={`header__container ${(location.pathname.includes("attraction")||location.pathname.includes("booking")) && "header__container--border"} `}>
            <div className="header">
            <div className="header__homepage" onClick={()=>navigate("/")}>台北一日遊</div>
            <div className="header__login">
                <span>預定行程</span>
                <span onClick={clickRL}>{currentUser.name?"登出帳號":"登入/註冊"}</span>
            </div>
            </div>
        </div>
        <R_L/>
        <Outlet/>
        <Footer/>
    </div>
    )
  }

  export default Header;