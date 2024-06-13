import { useEffect,useState,useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchSpot,getFalse } from "../store/modules/store"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const imgUrl="/statics"
const Spot=()=>{
    const [hoverImg,setHoverImg] = useState(0)
    const [hoverTime,setHoverTime] = useState(2000)
    const imgRef = useRef([])
    const param = useParams()
    const navigate = useNavigate()
    let id = param.id;
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(fetchSpot(id));
    },[dispatch,id])
    useEffect(()=>{
        if(hoverImg !== null && imgRef.current[hoverImg]){
            setTimeout(()=>{
                imgRef.current[hoverImg].classList.add("active")
            },0)
        } 
     })
    const {spot} = useSelector(state=>state.attractions) 
    if(!spot || !spot.images){
        return navigate("/")
    }
    let max = spot.images.length  
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
            <div className="spot__content--container">
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