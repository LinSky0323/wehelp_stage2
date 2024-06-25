import { createSlice } from "@reduxjs/toolkit";
import { MrtUrl,AttractionList,SpotUrl,UserUrl,BookingUrl } from "../../page/apiUrl";




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
        currentUser:{},
        //購物車
        bookingList:{}
    },
    reducers:{
        setMrtList(state,action){
            state.mrtList = action.payload
        },
        resetAttraction(state){
            state.attractionList ={nextPage:0,data:[]}
            state.keyword = ""
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
        },
        setBookingList(state,action){
            state.bookingList = action.payload
        },
        delBookingList(state){
            state.bookingList = {}
        }
}})

//異步執行
const {setMrtList,resetAttraction,addAttractionList,setAnotherList,setAnotherKeyword,getSpot,clearSpot,openRL,closeRL,setCurrentUser,clearCurrentUser,setBookingList,delBookingList} = attractionStore.actions
const fetchMrtList=()=>{
    return async (dispatch)=>{
        const res = await fetch(MrtUrl);
        const jsonData = await res.json();
        dispatch(setMrtList(jsonData.data))

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
const fetchBooking=(token)=>{
    return async(dispatch)=>{
        const res = await fetch(BookingUrl,{method:"GET",headers:{"Authorization":"Bearer "+token}})
        const data = await res.json()
        if(data){
            dispatch(setBookingList(data))
            return data
        }
        else{
            dispatch(delBookingList())
            return data
        }
    }
}
//導出
export {fetchMrtList,resetAttraction,fetchNextData,fetchAnotherList,fetchSpot,clearSpot,openRL,closeRL,fetchUser,clearCurrentUser,fetchBooking,delBookingList}

const reducer = attractionStore.reducer

export default reducer