import { useEffect, useState,} from "react"
import { useDispatch,useSelector } from "react-redux"
import { fetchBooking,delBookingList } from "../store/modules/store"
import { useNavigate } from "react-router-dom"
//統一修改圖片路境，為了應對開發環境跟build的靜態物件
import {imgUrl,BookingUrl} from "./apiUrl"


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

const UserInf=()=>{
    const {currentUser} = useSelector(state=>state.attractions)
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [phone,setPhone] = useState("")
    useEffect(()=>{            
            setName(currentUser.name)
            setEmail(currentUser.email)
    },[currentUser])
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
            <input className="inf__input" onChange={e=>keyPhone(e.target.value)} value={phone}  type="text"/>
            </div>
            <div className="booking__item--footer">請保時手機溝通，準時到達，導覽人員將用手機跟您聯絡，務必留下正確的聯絡方式。</div>
        </div>
    )
}
const PayInf=()=>{
    const [cardNum,setCardNum] = useState("")
    const [cardDate,setCardDate] = useState("")
    const [cardPassword,setCardPassword] = useState("")
    const keyCardNum = (e)=>{
        const fixNum=(value)=>{
            const v1 = value.replace(/\D/g, '');                    // \D 匹配所有飛數字 g匹配全部(不會只有一次) >>把非數字換成""
            const v2 = v1.match(/.{1,4}/g)?.join("-")||""           // .匹配所有 {1,4}匹配1~4個. ?讓match失敗回傳undefined ||"" 讓undefined跳過join回傳空字串 >> 每4個數字加個"-"
            return v2
        }
        if(e.length>=0 && e.length <20){
            setTimeout(()=>{
                setCardNum(fixNum(e))
            },0)
        }
    }
    const keyCardDate = (e)=>{
        const fixData=(v)=>{
            const v1 = v.replace(/\D/g,"")
            const v2 = v1.match(/.{1,2}/g)?.join("/")||""
            return v2
        }
        if(e.length>=0 && e.length<6){
            setTimeout(()=>{
                setCardDate(fixData(e))
            },0)
        }
    }
    const keyCardPassword=(e)=>{
        const filter = (v)=>{
            return v.replace(/\D/g,"")
        }
        setCardPassword(filter(e))
    }
    return(
        <div className="booking__paycontainer">
            <div className="booking__item--header">信用卡付費資訊</div>
            <div className="booking__item--item ">
            <label>卡片號碼：</label>
            <input className="pay__input" type="text" placeholder="**** **** **** ****"
            onChange={e=>keyCardNum(e.target.value)} value={cardNum} maxLength={19}/>
            </div>
            <div className="booking__item--item">
            <label>過期時間：</label>
            <input className="pay__input"  type="text" placeholder="MM/YY"
             onChange={e=>keyCardDate(e.target.value)} value={cardDate} maxLength={5}/>
            </div>
            <div className="booking__item--item ">
            <label>驗證密碼：</label>
            <input className="pay__input"  type="text" placeholder="CVV"
            onChange={e=>keyCardPassword(e.target.value)} value={cardPassword} maxLength={3}/>
            </div>
        </div>
    )
}

const CheckPay=()=>{
    const {bookingList} =useSelector(state=>state.attractions)
    return(
        <div className="booking__checkcontainer">
            <div className="booking__checkprice">總價：新台幣 {bookingList.price} 元</div>
            <button className="booking__checkbtn">確認訂購並附款</button>
        </div>
    )
}


const Booking=()=>{
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {bookingList,currentUser} =useSelector(state=>state.attractions)
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
    },[dispatch,navigate,currentUser])                              //監控currentUser，確保登出能直接跳轉
    if(bookingList && bookingList.data){
        return(
            <div className="booking__container">
                <BookingTitle/>
                <div className="line"></div>
                <UserInf/>
                <div className="line"></div>
                <PayInf/>
                <div className="line"></div>
                <CheckPay/>
            </div>
        )
    }
    return(
        <div className="booking__container booking__container--nofull">
           <NoBooking/>
        </div>
    )
}

export default Booking