import json,re,random
from sql import push_attraction,get_attraction_by_id,get_mrt_list,get_some_data,reg_user,login_user,create_checkNum,get_active,create_booking_list,get_booking_list,del_booking_list,create_order,change_pay,search_order_list
from mail import send_check_email
import jwt
from datetime import datetime,timezone,timedelta
# from mail import send_check_email

ALGOEITHM = "HS256"
PW_SECRET = "gukhlawrukgh"
TK_SECRET = "skdjgh354wriaghn"


#創建DB
def create_db():
    with open("data/taipei-attractions.json",mode="r",encoding="utf-8") as file:
        data=json.load(file)
    for row in data["result"]["results"]:
        img=row["file"].replace("https",",https").split(",")
        imgs=[]
        img_word=r"(?i)\.(jpg|png)"
        for item in img:
            if re.findall(img_word,item):
                imgs.append(item)
        image=",".join(imgs)
        push_attraction(row["name"],row["CAT"],row["description"],
                        row["address"],row["direction"],row["MRT"],
                        row["latitude"],row["longitude"],image)

#拿到對應ID的資料
def get_data_by_id(id):
    data=get_attraction_by_id(id)
    if data:
        data.images=data.images.split(",")
    return {"data":data}

#拿到對應page keyword的資料
def get_data(page,keyword):
    data = get_some_data(page,keyword)
    for i in data[0]:
        i.images=i.images.split(",")
    return {"nextPage":data[1],"data":data[0]}

#拿到mrt列表
def get_some_mrt():
    data=get_mrt_list()
    list=[]
    for item in data:
        if not item[0] :
            continue
        list.append(item[0])
    return {"data":list}

#註冊帳號
def register(name,email,password):
    encoding_password = jwt.encode({"password":password},PW_SECRET,algorithm=ALGOEITHM)
    user = reg_user(name,email,encoding_password)
    return user

#登入
def login(email,password):
    encoding_password = jwt.encode({"password":password},PW_SECRET,algorithm=ALGOEITHM)
    user = login_user(email,encoding_password)
    if user.get("error"):
        return user
    if not user["active"]:
        return {"unactive":True}
    token_time = datetime.now(timezone.utc) + timedelta(days=7)
    token_data = {
        **user,
        "exp":token_time
    }
    token = jwt.encode(token_data,TK_SECRET,algorithm=ALGOEITHM)
    return {"token":token}

#確認當前用戶
def get_current_user(token):
    try:
        data = jwt.decode(token,TK_SECRET,algorithms=[ALGOEITHM])
        decode_time = datetime.fromtimestamp(data["exp"],timezone.utc)
        if decode_time < datetime.now(timezone.utc):
            return None
        result={"data":{"id":data["id"],"name":data["name"],"email":data["email"]}}
        return result
    except:
        return None

#生成寄送驗證碼
def create_send_checkNum(email,name):
    rand = random.randint(100000,999999)
    create_checkNum(email,rand)
    send_check_email(email,rand,name)

#驗證帳號及驗證碼
def check_checkNum(email,num):
    data=get_active(email,num)
    return data

#增修booking
def create_booking(userId,attractionId,date,time,price):
    try:
        data = create_booking_list(userId,attractionId,date,time,price)
        return data
    except:
        return{"error":True,"message":"連接資料庫發生錯誤"}

#取得booking
def get_booking(userId):
    try:
        data = get_booking_list(userId)
        if not data:
            return data
        data[1].images = data[1].images.split(",")
        return {"data":{"attraction":{"id":data[1].id,"name":data[1].name,"address":data[1].address,"image":data[1].images[0]}},
                "date":data[0].date,"time":data[0].time,"price":data[0].price}
    except:
        return{"error":True,"message":"連接資料庫發生錯誤"}
    
#刪除booking
def del_booking(userId):
    try:
        data = del_booking_list(userId)
        return data
    except:
        return{"error":True,"message":"連接資料庫發生錯誤"}

#新增order
def create_orders(userId,attractionId,date,time,price,phone):
    # cellphone = str(int(phone))
    try:
        data = create_order(userId,attractionId,date,time,price,phone)
        return {"ok":data}
    except:
        return{"error":True,"message":"連接資料庫發生錯誤"}

#修改pay
def change_order_pay(id):
    try:
        data=change_pay(id)
        return data
    except:
        return{"error":True,"message":"連接資料庫發生錯誤"}

#取得編號訂單
def get_order_number_list(number,name,email):
    order_id=int(str(number)[-8:])
    try:
        data=search_order_list(order_id)
        if not data:
            return data
        data[1].images = data[1].images.split(",")
        return{
            "data":{
                "number":number,
                "price":data[0].price,
                "trip":{
                    "attraction":{
                        "id":data[1].id,
                        "name":data[1].name,
                        "address":data[1].address,
                        "image":data[1].images[0]
                    },
                    "date":data[0].date,
                    "time":data[0].time,
                },
                "contact":{
                    "name":name,
                    "email":email,
                    "phone":data[0].phone,
                },
                "status":1
            }
        }
    except:
        return{"error":True,"message":"連接資料庫發生錯誤"}



    

