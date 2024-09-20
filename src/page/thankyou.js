import { useSearchParams } from "react-router-dom"


const Thankyou=()=>{
    const [param] = useSearchParams()
    const num = param.get("number")
    return (
    <div className="thank__container">
        <div className="thank__title">行程已預訂成功~~~</div>
        <div className="thank__content">
            您的訂單編號如下：
            <br/>
            <span>{num}</span>
            <br/>
            請記住訂單編號，以利您查詢交易紀錄
        </div>
        <div></div>
        
    </div>)
}

export default Thankyou