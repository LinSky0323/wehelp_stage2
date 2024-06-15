import { useEffect,useState,useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clearSpot, fetchSpot } from "../store/modules/store"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"

//統一修改圖片路境，為了應對開發環境跟build的靜態物件
const imgUrl="/statics/"

//景點物件，包含圖片、名稱、booking欄
const Spot=()=>{
    const [hoverImg,setHoverImg] = useState(0)  //狀態:當前圖片index
    const [hoverTime,setHoverTime] = useState(2000) //狀態:當前的金額(順便對應上下午)
    const imgRef = useRef([])   //定義ref
    const param = useParams()   //定義router
    const navigate = useNavigate()  //定義連結跳轉物件
    let id = param.id; 
    const dispatch = useDispatch()  //定義dispatch物件
    useEffect(()=>{ //再跳轉到網頁或網址中ID被修改時 會重新抓資料到redux裡
        dispatch(fetchSpot(id));
    },[dispatch,id])
    useEffect(()=>{ //切換圖片時做到display: none>block的動畫
        if(imgRef.current[0]){  //用if確認渲染是否完成，避免初次導入網頁ref為空無法執行修正的錯誤
            setTimeout(()=>{    //display無法動畫 利用opacity變更來讓tranlation運作
                imgRef.current[hoverImg].classList.add("active"); 
            },0)
        } 
     })
    const {spot} = useSelector(state=>state.attractions) //解構取得store裡的spot
    useEffect(()=>{ //如果得到的spot是error:true 重新島回首頁
        if(spot&&spot.error){   //避免初次載入報錯
            dispatch(clearSpot({}))
            navigate("/")
        }
    },[spot,navigate,dispatch])
    if(!spot || !spot.images){
        return 
    }
    let max = spot.images.length  
        //各種含式
    const clickLeft=()=>{
        if(hoverImg<=0){
            setHoverImg(max-1)
        }
        else{
            setHoverImg(hoverImg-1)
        }
    }
    const clickRight=()=>{
        if(hoverImg>=max-1){
            setHoverImg(0)
        }
        else{
            setHoverImg(hoverImg+1)
        }
    }
    const clickCircle=(index)=>{
        setHoverImg(index)
    }
    const clickMorning=()=>{
        setHoverTime(2000)
    }
    const clickAfternoon=()=>{
        setHoverTime(2500)
    }

    return(
        <div className="spot__container">
            <div className="spot__img--container">
                {spot.images.map((item,index)=><img key={index} className={index === hoverImg ?"spot__img spot__img--active":"spot__img"}
                 src={item} alt={item.name} ref={(e)=>imgRef.current[index]=e}/>)}
                <img  className="spot__arrow spot__arrow--left" onClick={clickLeft}
                src={imgUrl+"/left_arrow.png"}  alt="left arrow"/>
                <img  className="spot__arrow spot__arrow--right" onClick={clickRight}
                src={imgUrl+"/right_arrow.png"} alt="right arrow"/>
                <div className="spot__circle--container">
                {spot.images.map((item,index)=><img key={index} className="spot__circle" onClick={()=>clickCircle(index)}
                src={index === hoverImg ?(imgUrl+"/circle_current.png"):(imgUrl+"/circle.png")} alt="circle"/>)}
                </div>
            </div>
            <div className="spot__content--container" >
                <div className="spot__name">{spot.name}</div>
                <div className="spot__mrt">{spot.category} at {spot.mrt}</div>
                <div className="spot__booking--container">
                    <div className="spot__booking--title">訂購導覽行程</div>
                    <div className="spot__booking--inf">以此景點為中心的一日行程，帶您探索城市角落故事</div>
                    <div className="spot__booking--date">選擇日期：<input type="date" className="spot__date--input"></input></div>
                    <div className="spot__booking--time">選擇時間：
                        <span ><img onClick={clickMorning} src={hoverTime===2500?(imgUrl+"/radio_d_btn.png"):(imgUrl+"/radio_h_btn.png") }alt="radio"/>上半天</span>
                        <span ><img onClick={clickAfternoon} src={hoverTime===2500?(imgUrl+"/radio_h_btn.png"):(imgUrl+"/radio_d_btn.png") } alt="radio"/>下半天</span>
                    </div>
                    <div className="spot__booking--price">導覽費用：<span>新台幣 {hoverTime} 元</span></div>
                    <button className="spot__booking--btn">開始預約行程</button>
                </div>
            </div>
        </div>
    )
}


const Content=()=>{
    const {spot} = useSelector(state=>state.attractions)
    return(
        <div className="content__container">
            <div className="content__des">{spot.description}</div>
            <div className="content__address"><span>景點地址：</span><br/>{spot.address}</div>
            <div className="content__transport"><span>交通方式：</span><br/>{spot.transport}</div>
        </div>
    )
}


const Attraction=()=>{
    return(
        <div className="container">
            <Spot/>
            <div className="line"></div>
            <Content/>
        </div>
    )
}

export default Attraction