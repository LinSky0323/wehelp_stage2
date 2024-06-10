// import {useEffect,useRef,useState} from "react"
import "./index.css"
import { useDispatch,useSelector } from "react-redux"
import { fetchAnotherList, fetchAttractionList, fetchMrtList, fetchNextData } from "./store/modules/store"
import { useEffect,useRef,useState } from "react"

const URL="http://18.176.26.217:8000/"


const Header=()=>{
  const reload=()=>{
    window.location.href=URL
  }
  return(
    <div className="header__container">
      <div className="header">
        <div className="header__homepage" onClick={reload}>台北一日遊</div>
        <div className="header__login">
          <span>預定行程</span>
          <span>登入/註冊</span>
        </div>
      </div>
    </div>
  )
}


const Title=()=>{
  const searchRef = useRef(null);
  const btnRef = useRef(null);
  const [text,setText] = useState("")


  const dispatch = useDispatch()
  const handleClick=()=>{
    dispatch(fetchAnotherList(0,searchRef.current.value));
    setText("");
  }
  const handleKeyDown=(e)=>{
    if(e.key === "Enter"){
      btnRef.current.click();
      searchRef.current.focus();
    }
  }
  return(
    <div className="title">
       <img src="/statics/welcome.png" className="title__backimg" alt="101"/>
      <div className="title__container">
        <div className="title__container__big">輕鬆享受台北一日悠閒</div>  
        <div className="title__container__small">探索每個角落，體驗城市的深度旅遊行程</div>
        <div className="title__search">
          <input type="text" ref={searchRef} value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=>handleKeyDown(e)}/>
          <button onClick={handleClick} ref={btnRef}><img src="/statics/search.png" alt="research"/></button>
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
  const handleClick=(keyword)=>{
    dispatch(fetchAnotherList(0,keyword))
  }

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
        <img src={hoverL === false ? "/statics/left_Default.png":"/statics/left_Hovered.png"} alt="left arrow" onMouseEnter={enterLeft} onMouseLeave={leaveLeft}/></div>
      <div className="mrt__list">
        <ul className="mrt__ul " ref={ulRef}>
          {mrtList.map(item=>
            <li key={item} className={`mrt__li ${keyword === item && "mrt__ul--focus"}`} onClick={(e)=>handleClick(e.target.innerText)}>{item}</li>
          )}
        </ul>
      </div>
      <div className="mrt__arrow__right" onMouseDown={onScrollRight} onMouseUp={leaveScroll} onMouseLeave={leaveScroll}>
        <img src= {hoverR === false ? "/statics/right_Default.png":"/statics/right_Hovered.png"} alt="right arrow" onMouseEnter={enterRight} onMouseLeave={leaveRight}/></div>
    </div>
  )
}

const Attractions=()=>{
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(fetchAttractionList());
  },[dispatch])

  const {attractionList,keyword} = useSelector(state => state.attractions)

  useEffect(()=>{
    if(attractionList.nextPage === null ){
      return;
    }
    let check = true;
    const handleScroll=()=>{
      if(check === true){
        let scrollTop = document.documentElement.scrollTop;
        let clientHeight = document.documentElement.clientHeight;
        let scrollHeight = document.documentElement.scrollHeight;
        if(scrollTop + clientHeight >= scrollHeight - 5){
          check=false;
          dispatch(fetchNextData(attractionList.nextPage,keyword))
          setTimeout(()=>{
            check=true;
          },500)
        }
      }}
    window.addEventListener("scroll",handleScroll);
    return ()=>{
      window.removeEventListener("scroll",handleScroll);
    }
  },[attractionList,dispatch,keyword])

  return(
    
    <div className="attractions">
      {/* 12個框框 */}
      {attractionList&&attractionList.data &&attractionList.data.map(item=><div key={item.id}  className="attractions__card">
        <div className="attractions__img"><img src={item.images[0]} alt={item.name}/><div className="attractions__name"><span>{item.name}</span></div></div>
        <div className="attractions__des"><span>{item.mrt?item.mrt:"無"}</span><span>{item.category}</span></div>
      </div>)}
      
    </div>
  )
}

const Footer=()=>{
  return (
    <div className="footer" id="footer"><div>COPYRIGHT © 2021 台北一日遊</div></div>
  )
}
function App() {
 
  return (
    <div className="body">
    <Header/>
    <Title/>
    <Mrt/>
    <Attractions />
    <Footer/>
    </div>
  );
}

export default App;
