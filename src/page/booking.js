import { useEffect, useState,useRef,createContext,useContext} from "react"
import { useDispatch,useSelector } from "react-redux"
import { fetchBooking,delBookingList } from "../store/modules/store"
import { useNavigate } from "react-router-dom"
//統一修改圖片路境，為了應對開發環境跟build的靜態物件
import {imgUrl,BookingUrl,OrderUrl,APPID,APPKEY} from "./apiUrl"

const BookingTitle=()=>{
    const dispatch = useDispatch()
    const {bookingList,currentUser} =useSelector(state=>state.attractions)
    async function clickDel(){          //刪除購物車
        const token = localStorage.getItem("token")
        const res = await fetch(BookingUrl,{method:"DELETE",headers:{"Authorization":"Bearer "+token}})
        const data = await res.json()
        if(data.hasOwnProperty("ok")){
            dispatch(delBookingList())
        }
    }
        return(
            <div className="booking__titlecontainer">
                <div className="booking__hello">您好，{currentUser.name}，待預定的行程如下</div>
                <div className="booking__title">
                    <div className="booking__img">
                        <img alt={bookingList.data.attraction.name} src={bookingList.data.attraction.image}/>
                    </div>
                    <div className="booking__inf">
                        <img className="booking__del" src={imgUrl+"/delete.png"} onClick={clickDel} alt="del"/>
                        <div className="booking__name">台北一日遊：{bookingList.data.attraction.name}</div>
                        <div className="booking__item">日期：<span>{bookingList.date}</span></div>
                        <div className="booking__item">時間：<span>{bookingList.time==="morning"?"早上9點到下午4點":"下午2點到晚上9點"}</span></div>
                        <div className="booking__item">費用：<span>新台幣 {bookingList.price} 元</span></div>
                        <div className="booking__item booking__item--small">地點：<span>{bookingList.data.attraction.address}</span></div>
                    </div>  
                </div>
            </div>
        )
}

const NoBooking = ()=>{
    const {currentUser} =useSelector(state=>state.attractions)
    return(
        <div>
            <div className="booking__hello">您好，{currentUser.name}，待預定的行程如下</div>
            <div className="booking__noinf">目前沒有任何待預定的行程</div>
        </div>
    )
}

const UserContext = createContext()

const UserInf=()=>{
    const {currentUser} = useSelector(state=>state.attractions)
    const { name, email, phone, setName, setEmail, setPhone } = useContext(UserContext)
    useEffect(()=>{            
            setName(currentUser.name)
            setEmail(currentUser.email)
    },[currentUser,setName,setEmail])
    const keyPhone=(e)=>{
        const filter = (v)=>{
            return v.replace(/\D/g,"")
        }
        setPhone(filter(e))
    }
    return(
        
            <div className="booking__usercontainer"> 
                <div className="booking__item--header">您的聯絡資訊</div>
                <div className="booking__item--item">
                <label>聯絡姓名：</label>
                {/* value添加 ||"" 避免渲染前後可控不可控變化 */}
                <input className="inf__input" onChange={e=>setName(e.target.value)} value={name||""}  type="text"/>     
                </div>
                <div className="booking__item--item">
                <label>聯絡信箱：</label>
                <input className="inf__input" onChange={e=>setEmail(e.target.value)} value={email||""}  type="email"/>
                </div>
                <div className="booking__item--item">
                <label>手機號碼：</label>
                <input className="inf__input" onChange={e=>keyPhone(e.target.value)} value={phone}  type="text" maxLength={10}/>
                </div>
                <div className="booking__item--footer">請保時手機溝通，準時到達，導覽人員將用手機跟您聯絡，務必留下正確的聯絡方式。</div>
            </div>
       
    )
}
const PayInf=()=>{
    const card_number_ref = useRef()
    const card_expiration_date_ref = useRef()
    const card_ccv_ref = useRef()
    useEffect(()=>{
        if(window.TPDirect){
            window.TPDirect.setupSDK(APPID, APPKEY, 'sandbox')
        }
        else{
            console.log("TAPPAY SDK ERROR")
            return
        }
        let field = {
            number: {
                // css selector
                element:card_number_ref.current ,
                placeholder: '**** **** **** ****'
            },
            expirationDate: {
                // DOM object
                element:card_expiration_date_ref.current,
                placeholder: 'MM / YY'
            },
            ccv: {
                element:card_ccv_ref.current ,
                placeholder: 'CVV'
            }
        }
            window.TPDirect.card.setup({
            fields:field,
            styles: {
                // Style all elements
                'input': {
                    'color':'rgba(117,117,117,1)',
                    'font-size':'16px',
                    'border':'1px',
                    'font-weight':'500',
                    'font-family': '"Noto Sans TC", sans-serif'
                },
                
                // style valid state
                '.valid': {
                    'color': 'green'
                },
                // style invalid state
                '.invalid': {
                    'color': 'red'
                }
            },
            isMaskCreditCardNumber: true,
            maskCreditCardNumberRange: {
                beginIndex: 6, 
                endIndex: 11
            }
        })
},[])


    return(
        <div className="booking__paycontainer">
            <div className="booking__item--header">信用卡付費資訊</div>
            <div className="booking__item--item ">
                <span>卡片號碼：</span><div className="tpfield" id="card-number" ref={card_number_ref}></div>
            </div>
            <div className="booking__item--item ">
                <span>過期時間：</span><div className="tpfield" id="card-expiration-date" ref={card_expiration_date_ref}></div>
            </div>
            <div className="booking__item--item ">
                <span>驗證密碼：</span><div className="tpfield" id="card-ccv" ref={card_ccv_ref}></div>
            </div>
        </div>
    )
}

const CheckPay=()=>{
    const {bookingList} =useSelector(state=>state.attractions)
    const{name,email,phone} = useContext(UserContext)
    const [disable,setDisable] = useState(true)
    const btnRef = useRef(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    window.TPDirect.card.onUpdate(function(update){
        if(update.canGetPrime){
            setDisable(false)
            btnRef.current.classList.remove("booking__checkbtn--disable")
        }
        else{
            setDisable(true)
            btnRef.current.classList.add("booking__checkbtn--disable")
        }
    })
    async function pay(){
        const tappayStatus = window.TPDirect.card.getTappayFieldsStatus()
        if (tappayStatus.canGetPrime === false) {
            alert("請輸入正確的信用卡資訊")
            return
        }

        window.TPDirect.card.getPrime((result) => {
            if (result.status !== 0) {
                alert('get prime error ' + result.msg)
                return
            }
            const token = localStorage.getItem("token")
            fetch(OrderUrl,{
                method:"POST",
                headers:{"Authorization":"Bearer "+token},
                body:JSON.stringify({
                    "prime":result.card.prime,
                    "order":{
                        "price":bookingList.price,
                        "trip":{
                            "attraction":{
                                "id":bookingList.data.attraction.id,
                                "name":bookingList.data.attraction.name,
                                "address":bookingList.data.attraction.address,
                                "image":bookingList.data.attraction.image
                            },
                            "date":bookingList.date,
                            "time":bookingList.time
                        },
                        "contact":{
                            "name":name,
                            "email":email,
                            "phone":phone
                        }
                    }
                  })}).then(e=>e.json()).then(i=>{
                    if(i.hasOwnProperty("error")){
                        alert("付款失敗")
                        return
                    }
                    dispatch(delBookingList());
                    fetch(BookingUrl,{method:"DELETE",headers:{"Authorization":"Bearer "+token}});
                    navigate(`/thankyou?number=${i.data.number}`);
                  })
    
            // send prime to your server, to pay with Pay by Prime API .
            // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
        })
    }
    return(
        <div className="booking__checkcontainer">
            <div className="booking__checkprice">總價：新台幣 {bookingList.price} 元</div>
            <button className="booking__checkbtn booking__checkbtn--disable" onClick={pay} disabled={disable} ref={btnRef}>確認訂購並附款</button>
        </div>
    )
}


const Booking=()=>{
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {bookingList} =useSelector(state=>state.attractions)
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [phone,setPhone] = useState("")
    const contextValue = { name, email, phone, setName, setEmail, setPhone };
    useEffect(()=>{
        async function logBooking(){
            const token = localStorage.getItem("token")
            const res =await dispatch(fetchBooking(token))          //確認是否有正確登入使用者訊息並拿回資料
            if(res===null){
                return
            }
            else if(res.hasOwnProperty("error")){
                return navigate("/")
            }
        }
        logBooking()
    },[dispatch,navigate])                              //監控currentUser，確保登出能直接跳轉
    if(bookingList && bookingList.data){
        return(
            <UserContext.Provider value={contextValue}>
                <div className="booking__container">
                    <BookingTitle/>
                    <div className="line"></div>
                    <UserInf />
                    <div className="line"></div>
                    <PayInf/>
                    <div className="line"></div>
                    <CheckPay/>
                </div>
            </UserContext.Provider>
        )
    }
    return(
        <div className="booking__container booking__container--nofull">
           <NoBooking/>
        </div>
    )
}

export default Booking