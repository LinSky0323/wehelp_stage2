import { createSlice } from "@reduxjs/toolkit";
import { MrtUrl,AttractionList,SpotUrl,UserUrl } from "../../page/apiUrl";




const attractionStore = createSlice({
    name:"attraction",
    initialState:{
        //捷運列表
        mrtList:[],
        //景點列表
        attractionList:{nextPage:0,data:[]},
        //關鍵字
        keyword:"",
        //單獨景點
        spot:{},
        //顯示登入窗
        rlWindow:false,
        //當前使用者資訊
        currentUser:{}
    },
    reducers:{
        setMrtList(state,action){
            state.mrtList = action.payload
        },
        setAttractionList(state,action){
            state.attractionList = action.payload
        },
        //把下一頁的資料add進去
        addAttractionList(state,action){
            state.attractionList.data=[...state.attractionList.data,...action.payload.data];
            state.attractionList.nextPage = action.payload.nextPage;
        },
        setAnotherList(state,action){
            state.attractionList.data=action.payload.data;
            state.attractionList.nextPage = action.payload.nextPage;
        },
        setAnotherKeyword(state,action){
            state.keyword=action.payload;
        },
        getSpot(state,action){
            state.spot=action.payload;
        },
        clearSpot(state,action){
            state.spot=action.payload
        },
        openRL(state){
            state.rlWindow=true
        },
        closeRL(state){
            state.rlWindow=false
        },
        setCurrentUser(state,action){
            state.currentUser = action.payload
        },
        clearCurrentUser(state){
            state.currentUser = {}
        }
}})

//異步執行
const {setMrtList,setAttractionList,addAttractionList,setAnotherList,setAnotherKeyword,getSpot,clearSpot,openRL,closeRL,setCurrentUser,clearCurrentUser} = attractionStore.actions
const fetchMrtList=()=>{
    return async (dispatch)=>{
        const res = await fetch(MrtUrl);
        const jsonData = await res.json();
        dispatch(setMrtList(jsonData.data))

    }
}
const fetchAttractionList =()=>{
    return async (dispatch)=>{
        const res = await fetch(AttractionList);
        const jsonData = await res.json();
        dispatch(setAttractionList(jsonData))
    }
}
const fetchAnotherList=(page,keyword)=>{
    return async(dispatch)=>{
        const res = await fetch(AttractionList+`?page=${page}&keyword=${keyword}`);
        const jsonData = await res.json();
        dispatch(setAnotherList(jsonData))
        dispatch(setAnotherKeyword(keyword))
}}

const fetchNextData =(page,keyword)=>{
    return async(dispatch)=> {
            const res = await fetch(AttractionList+`?page=${page}&keyword=${keyword}`);
            const jsonData = await res.json();
            dispatch(addAttractionList(jsonData))
        
    }
}
const fetchSpot=(id)=>{
    return async(dispatch)=>{
        const res = await fetch(SpotUrl+id);
        const jsonData = await res.json();
        if(jsonData.hasOwnProperty("error")){
            dispatch(getSpot(jsonData))
        }
        else{
            dispatch(getSpot(jsonData.data))
        }
    }
}
const fetchUser=(token)=>{
    return async(dispatch)=>{
        const res = await fetch(UserUrl,{method:"GET",headers:{"Authorization":"Bearer "+token}})
        const data = await res.json()
        if(data){
            dispatch(setCurrentUser(data.data))
        }
        else{
            dispatch(clearCurrentUser())
        }
        
    }
}
//導出
export {fetchMrtList,fetchAttractionList,fetchNextData,fetchAnotherList,fetchSpot,clearSpot,openRL,closeRL,fetchUser,clearCurrentUser}

const reducer = attractionStore.reducer

export default reducer