import "./index.css"
import { useDispatch,useSelector } from "react-redux"
import { fetchAnotherList, fetchMrtList, fetchNextData } from "../store/modules/store"
import { useEffect,useRef,useState } from "react"
import { useNavigate } from "react-router-dom"
//統一修改圖片路境，為了應對開發環境跟build的靜態物件
import {imgUrl} from "./apiUrl"

const Title=()=>{
    const searchRef = useRef(null); //拿到輸入框
    const btnRef = useRef(null);  //拿到btn
    const [text,setText] = useState("") //輸入框的值
  
  
    const dispatch = useDispatch()
    //函式：照輸入框中的值搜尋
    const handleClick=()=>{
      dispatch(fetchAnotherList(0,searchRef.current.value));
      setText("");
    }
    //函式：按enter等於按btn
    const handleKeyDown=(e)=>{
      if(e.key === "Enter"){
        btnRef.current.click();
        searchRef.current.focus();
      }
    }
    return(
      <div className="title">
         <img src={imgUrl+"welcome.png"} className="title__backimg" alt="101"/>
        <div className="title__container">
          <div className="title__container__big">輕鬆享受台北一日悠閒</div>  
          <div className="title__container__small">探索每個角落，體驗城市的深度旅遊行程</div>
          <div className="title__search">
            <input type="text" ref={searchRef} value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=>handleKeyDown(e)}/>
            <button onClick={handleClick} ref={btnRef}><img src={imgUrl+"search.png"} alt="research"/></button>
          </div>
        </div>
      </div>
    )
  }
  
  const Mrt=()=>{
    // 1.useDispatch >> dispatch 2.actionCreater
    const dispatch = useDispatch()
    useEffect(()=>{
      dispatch(fetchMrtList())
    },[dispatch])
    //useSelector 獲取數據
    const {mrtList,keyword} = useSelector(state => state.attractions)
    //函式：點mrt依照mrt搜尋
    const handleClick=(keyword)=>{
      dispatch(fetchAnotherList(0,keyword))
    }
    //函式：高亮、往左往右
    const ulRef = useRef(null);
    const [hoverR,sethoverR] = useState(false);
    const [hoverL,sethoverL] = useState(false);
    const enterLeft=()=>{sethoverL(true)};
    const leaveLeft=()=>{sethoverL(false)};
    const enterRight=()=>{sethoverR(true)};
    const leaveRight=()=>{sethoverR(false)};
    let intervalID;
    const onScrollRight=()=>{
      intervalID=setInterval(()=>{ulRef.current.scrollLeft = ulRef.current.scrollLeft+20;},10) };
    const onScrollLeft=()=>{
      intervalID=setInterval(()=>{ulRef.current.scrollLeft = ulRef.current.scrollLeft-20;},10) };
    const leaveScroll=()=>{clearInterval(intervalID)}


    return(
      <div className="mrt">
        <div className="mrt__arrow__left" onMouseDown={onScrollLeft} onMouseUp={leaveScroll} onMouseLeave={leaveScroll}> 
          <img src={hoverL === false ? (imgUrl+"left_Default.png"):(imgUrl+"left_Hovered.png")} alt="left arrow" onMouseEnter={enterLeft} onMouseLeave={leaveLeft}/></div>
        <div className="mrt__list">
          <ul className="mrt__ul " ref={ulRef}>
            {mrtList.map(item=>
              <li key={item} className={`mrt__li ${keyword === item && "mrt__ul--focus"}`} onClick={(e)=>handleClick(e.target.innerText)}>{item}</li>
            )}
          </ul>
        </div>
        <div className="mrt__arrow__right" onMouseDown={onScrollRight} onMouseUp={leaveScroll} onMouseLeave={leaveScroll}>
          <img src= {hoverR === false ? (imgUrl+"right_Default.png"):(imgUrl+"right_Hovered.png")} alt="right arrow" onMouseEnter={enterRight} onMouseLeave={leaveRight}/></div>
      </div>
    )
  }
  
  const Attractions=()=>{
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {attractionList,keyword} = useSelector(state => state.attractions)
    const observeRef = useRef()
    const currentObserveRef = useRef()

    //---------------------舊操作：監控scroll 
    // useEffect(()=>{
    //   dispatch(fetchAttractionList());
    // },[dispatch])
    // useEffect(()=>{
    //   if(attractionList.nextPage === null ){
    //     return;
    //   }
    //   let check = true;
    //   const handleScroll=()=>{
    //     if(check === true){
    //       let scrollTop = document.documentElement.scrollTop;
    //       let clientHeight = document.documentElement.clientHeight;
    //       let scrollHeight = document.documentElement.scrollHeight;
    //       if(scrollTop + clientHeight >= scrollHeight - 5){
    //         check=false;
    //         dispatch(fetchNextData(attractionList.nextPage,keyword)).then(()=>{check=true;})
    //       }
    //     }}
    //   window.addEventListener("scroll",handleScroll);
    //   return ()=>{
    //     window.removeEventListener("scroll",handleScroll);
    //   }
    // },[attractionList,dispatch,keyword])

    //-----------新操作IntersectionObserver
    useEffect(()=>{
      if(observeRef && attractionList.data){ //避免第一次渲染ref沒人
        if(attractionList.nextPage === null)return ;  //最後一頁不做事
        currentObserveRef.current = new IntersectionObserver((entries)=>{
          entries.forEach(entry=>{
            if(entry.isIntersecting){
              dispatch(fetchNextData(attractionList.nextPage,keyword))
              currentObserveRef.current.disconnect() //結束這次觀察，避免重複觸發重複觀察
              currentObserveRef.current = null;
            }
          })})
          currentObserveRef.current.observe(observeRef.current)  //開始觀察
        }
      return()=>{     //確保卸載
        if(currentObserveRef.current){
          currentObserveRef.current.disconnect();
          currentObserveRef.current=null;
        }
      }
    },[attractionList,dispatch,keyword])
    if(attractionList && attractionList.data){
      return(
      
        <div className="attractions">
          {/* 12個框框 */}
          {attractionList.data.map(item=><div key={item.id}  className="attractions__card"
            onClick={()=>navigate(`/attraction/${item.id}`)}>
            <div className="attractions__img"><img src={item.images[0]} alt={item.name}/><div className="attractions__name"><span>{item.name}</span></div></div>
            <div className="attractions__des"><span>{item.mrt?item.mrt:"無"}</span><span>{item.category}</span></div>
          </div>)}
          <div ref={observeRef}></div>
        </div>
        
      )
    }
    
  }
  
  function App() {
   
    return (
      <div className="container">
      <Title/>
      <Mrt/>
      <Attractions />
      </div>
    );
  }

  export default App;