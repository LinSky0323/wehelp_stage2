import { createSlice } from "@reduxjs/toolkit";


const MrtUrl = "http://127.0.0.1:8000/api/mrts"
const AttractionList = "http://127.0.0.1:8000/api/attractions"

const attractionStore = createSlice({
    name:"attraction",
    initialState:{
        //捷運列表
        mrtList:[],
        //景點列表
        attractionList:{nextPage:0,data:[]},
        //關鍵字
        keyword:""

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
        }

}})

//異步執行
const {setMrtList,setAttractionList,addAttractionList,setAnotherList,setAnotherKeyword} = attractionStore.actions
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
        if(keyword){
            const res = await fetch(AttractionList+`?page=${page}&keyword=${keyword}`);
            const jsonData = await res.json();
            dispatch(addAttractionList(jsonData))
        }
        else{
            const res = await fetch(AttractionList+`?page=${page}`);
            const jsonData = await res.json();
            dispatch(addAttractionList(jsonData))
        }
    }
}
//導出
export {fetchMrtList,fetchAttractionList,fetchNextData,fetchAnotherList}

const reducer = attractionStore.reducer

export default reducer