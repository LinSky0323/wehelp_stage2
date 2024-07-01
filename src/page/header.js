import "./index.css"
import { useEffect, useState,useRef } from "react"
import { Outlet } from "react-router-dom"
import { useDispatch,useSelector } from "react-redux"
import { fetchUser,clearCurrentUser, openRL, closeRL,resetAttraction, delBookingList } from "../store/modules/store"
import { useLocation,useNavigate } from "react-router-dom"
//統一修改圖片路境，為了應對開發環境跟build的靜態物件
import {imgUrl,RegUrl,UserUrl} from "./apiUrl"

const Footer=()=>{
  const location = useLocation()
  const {bookingList} = useSelector(state=>state.attractions)
    return (
      <div className={`footer ${(location.pathname.includes("booking")&&!bookingList.data) && "footer--full"} `} id="footer"><div>COPYRIGHT © 2021 台北一日遊</div></div>
    )
  }

const R_L=()=>{
  const emailRule = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const [login,setLogin] = useState("login")    //登入框內容是什麼
  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [_inputChecknum,setinputChecknum] = useState(new Array(6).fill('')) // eslint-disable-line no-unused-vars
  const [innerChecknum,setInnerChecknum] = useState(new Array(6).fill(''))
  const [inf,setInf] = useState("")             //訊息
  const dispatch = useDispatch()
  const {rlWindow,currentUser} = useSelector(state=>state.attractions)  //是否顯示登入框&當前使用者資訊
  const location = useLocation()
  const errorInfRef = useRef(null)          //錯誤訊息(或登入成功的提示)，只顯示2S
  const btnRef = useRef(null)
  const spaceRef = useRef(null)
  const checkRef = useRef([])
  const navigate = useNavigate()
  let isCompoing = false

  const clickRLclose=()=>{    //關閉登入框並重製裡面的資訊
    dispatch(closeRL())
    setLogin("login")
    setEmail("")
    setPassword("")
    setUsername("")
  }
  const toReg=()=>{           //切換至註冊
    spaceRef.current.innerText = "不能空白喔！"
    spaceRef.current.style.display="none"
    setLogin("reg")
  }
  const toLogin=()=>{         //切換至登入
    spaceRef.current.innerText = "不能空白喔！"
    spaceRef.current.style.display="none"
    setLogin("login")
  }
  
  const clickLogin=()=>{      //函式：發送登入
    async function log(email,password){   
      const res = await fetch(UserUrl,{method:"PUT",body:JSON.stringify({"email":email,"password":password})})
      const data = await res.json()
      if(data.hasOwnProperty("error")){
        errorInfRef.current.classList.add("rl__errorInf--open")
        setLogin("login_error")
        setInf(data["message"])
        setTimeout(()=>{
          errorInfRef.current.classList.remove("rl__errorInf--open")
        },2000)
      }
      else if(data.hasOwnProperty("unactive")){
        setLogin("unactive")
        setInf("")
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
    if(!email){
      spaceRef.current.innerText = "不能空白喔！"
      spaceRef.current.style.display = "flex"
      spaceRef.current.style.top = "90px"
    }
    else if(!emailRule.test(email)){ 
      spaceRef.current.innerText ="請輸入信箱格式！"
      spaceRef.current.style.display = "flex"
      spaceRef.current.style.top = "90px"
    }
    else if(!password){
      spaceRef.current.innerText = "不能空白喔！"
      spaceRef.current.style.display = "flex"
      spaceRef.current.style.top = "147px"
    }
    else{
      spaceRef.current.innerText = "不能空白喔！"
      spaceRef.current.style.display="none"
      log(email,password)
    }
    
  }
  
  const clickReg=()=>{        //函式：發送註冊
    async function reg(username,email,password){
      const res = await fetch(RegUrl,{
        method:"POST",
        body:JSON.stringify({
          "name":username,
          "email":email,
          "password":password
        })
        })
      const data = await res.json();
      if(data.hasOwnProperty("error")){
        errorInfRef.current.classList.add("rl__errorInf--open")
        setLogin("reg_error")
        setInf(data["message"])
        setTimeout(()=>{
          errorInfRef.current.classList.remove("rl__errorInf--open")
        },2000)
      }
      else if(data.hasOwnProperty("ok")){ 
        setLogin("reg_ok")
        setInf("驗證信已寄出，請於第一次登入時輸入驗證碼")
        setEmail("")
        setPassword("")
        setUsername("")
      }
    }
    if(!username){
      spaceRef.current.innerText = "不能空白喔！"
      spaceRef.current.style.display="flex"
      spaceRef.current.style.top="90px"
    }
    else if(!email){
      spaceRef.current.innerText = "不能空白喔！"
      spaceRef.current.style.display="flex"
      spaceRef.current.style.top="147px"
    }
    else if(!emailRule.test(email)){
      spaceRef.current.innerText = "請輸入信箱格式！"
      spaceRef.current.style.display="flex"
      spaceRef.current.style.top="147px"
    }
    else if(!password){
      spaceRef.current.innerText = "不能空白喔！"
      spaceRef.current.style.display="flex"
      spaceRef.current.style.top="204px"
    }
    else {
      spaceRef.current.innerText = "不能空白喔！"
      spaceRef.current.style.display="none"
      reg(username,email,password)
    }
  }
  const signout=()=>{         //函式：發送登出
    localStorage.removeItem("token")
    dispatch(clearCurrentUser())
    dispatch(delBookingList())    //順手清空購物車
    dispatch(closeRL())
    if(location.pathname.includes("booking")){
      navigate("/")
    }
  }
  const send=(e)=>{           //函試：按enter等於點btn
    if(e.key==="Enter"){
      btnRef.current.click()
    }
  }
  const clickCheck=()=>{      //函試：送出驗證碼
    async function checkNum(){
      let num = "";
      for(let i in innerChecknum){
        num+=innerChecknum[i]
      }
      const res = await fetch(RegUrl,{
        method:"PUT",
        body:JSON.stringify({"num":num,"email":email,"password":password})})
      const data=await res.json()
      if(data.hasOwnProperty("unactive")){
        errorInfRef.current.classList.add("rl__errorInf--open")
        setInf("驗證碼輸入錯誤")
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
      setInnerChecknum(new Array(6).fill(''))
      checkRef.current[0].focus()
    }
    checkNum()
  }
  const reCheck=()=>{         //函試：重寄一次驗證碼
    async function recheck(){
      const res = await fetch(UserUrl,{
        method:"POST",
        body:JSON.stringify({
          "email":email,
          "name":username
        })
      })
      const data = await res.json()
      if(data.hasOwnProperty("recheck")){
        setInf("驗證信已送出，請查收")
        errorInfRef.current.classList.add("rl__errorInf--open")
        setTimeout(()=>{
          errorInfRef.current.classList.remove("rl__errorInf--open")
        },2000)
      }
    }
    recheck()
  }

  const handleComposition=(e)=>{
    if(e.type === "compositionend"){
      return
      // 這段其實沒用，根本進不到end 
      // console.log(123)
      // setInnerChecknum(e.target.value)
      // isCompoing = false
      // this.setState({ innerChecknum: e.target.value })
    }
    else if (e.type === "compositionupdate"){
      isCompoing = true
      // this.setState({ inputChecknum: e.target.value })
    }
  }
  const changeCheckNum=(e,i)=>{ 
    // if(!isCompoing){      //函試：6格驗證碼的修改
    // let newnum = [...innerChecknum]
    // newnum[i]=value;
    // setInnerChecknum(newnum);
    // console.log("CHANGE：輸入值:"+value)
    // if(i<5){checkRef.current[i+1].focus();console.log("我移動了")}
    // newnum = null;
    // }
    let newnum = [...innerChecknum]
    newnum[i]=e.target.value;
    if (!isCompoing) {
      setInnerChecknum(newnum)
      setinputChecknum(newnum)
      if(i<5){checkRef.current[i+1].focus()}
      // this.setState({
      //   inputChecknum: e.target.value,
      //   innerChecknum: e.target.value,
      // })
    } else {
      setinputChecknum(newnum)
      // this.setState({ inputValue: e.target.value })
    }
  }
  
  if(rlWindow){
    return(
      <div className="rl__background">
        <div className="rl__container">
          <div className="rl__input--space" ref={spaceRef}>不能空白喔！</div> 
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
            {(login==="unactive")&&
            <div>
              <div className="rl__title">第一次登入請輸入驗證碼</div>
              <div className="rl__checkboxcontainer">
              {[0,1,2,3,4,5].map((item,index)=>index===0?
              <input key={index} type="text" maxLength={1} value={innerChecknum[index]}
              onCompositionStart={e=>handleComposition(e)} onCompositionUpdate={e=>handleComposition(e)} onCompositionEnd={e=>handleComposition(e)} 
              onChange={(e)=>changeCheckNum(e,index)} ref={(e)=>(checkRef.current[index]=e)}
              autoFocus className="rl__checkbox" onKeyDown={(e)=>send(e)}  />:
               <input key={index} type="text" maxLength={1} value={innerChecknum[index]}
               onCompositionStart={e=>handleComposition(e)} onCompositionUpdate={e=>handleComposition(e)} onCompositionEnd={e=>handleComposition(e)} 
               onChange={(e)=>changeCheckNum(e,index)} ref={(e)=>(checkRef.current[index]=e)}
               className="rl__checkbox" onKeyDown={(e)=>send(e)} />)}
               </div>
              <button className="rl__btn rl__btn--spe" onClick={clickCheck} ref={btnRef}
              >驗證送出</button>
              <div ref={errorInfRef} className="rl__errorInf">{inf}</div>
              <div className="rl__toggle">沒收到驗證碼?<span onClick={reCheck}> 再寄一次</span></div>
            </div>}
            {(login === "reg_ok")&&
            <div>
              <div className="rl__title">恭喜您註冊成功！</div>
              <div className="rl__inf">{inf}</div>
              <button className="rl__btn rl__btn--spe" onClick={toLogin}
              >返回登入頁</button>
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
    const toHome=()=>{        //回首頁 自動重製首頁的景點列表
      dispatch(resetAttraction())
      navigate("/")
    }
    const clickBooking = ()=>{  //登入>跳轉booking，沒登入>跳出登入頁
      if(currentUser.id){
        navigate("/booking")
        return
      }
      dispatch(openRL())
      return
    }
    return(
    <div className="body">
        <div className={`header__container ${(location.pathname.includes("attraction")||location.pathname.includes("booking")) && "header__container--border"} `}>
            <div className="header">
            <div className="header__homepage" onClick={toHome}>台北一日遊</div>
            <div className="header__login">
                <span onClick={clickBooking}>預定行程</span>
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