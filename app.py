from fastapi import *
from fastapi.responses import FileResponse,JSONResponse
from typing import Annotated,List
from data import get_data_by_id,get_some_mrt,get_data,register,login,get_current_user,create_send_checkNum,check_checkNum,get_booking,del_booking,create_booking,create_orders,change_order_pay,get_order_number_list
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from tappay import fetch_to_tappay
import threading



app=FastAPI()
app.mount("/static", StaticFiles(directory="build/static"), name="static")
app.mount("/statics", StaticFiles(directory="build"), name="statics")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Static Pages (Never Modify Code in this Block)
@app.get("/", include_in_schema=False)
async def index(request: Request):
	return FileResponse("./build/index.html", media_type="text/html")
@app.get("/attraction/{id}", include_in_schema=False)
async def attraction(request: Request, id: int):
	return FileResponse("./build/index.html", media_type="text/html")
	# return FileResponse("./static/attraction.html", media_type="text/html")
@app.get("/booking", include_in_schema=False)
async def booking(request: Request):
	return FileResponse("./build/index.html", media_type="text/html")
@app.get("/thankyou", include_in_schema=False)
async def thankyou(request: Request):
	return FileResponse("./build/index.html", media_type="text/html")


@app.get("/api/attractions")
def get_attraction(request:Request,page:int=0,keyword:Annotated[str,None]=None):
	try:
		data=get_data(page,keyword)
		return data
	except:
		return JSONResponse(status_code=500,content={"error":True,"message":"發生錯誤"})

@app.get("/api/attraction/{attractionId}")
async def search_by_id(request:Request,attractionId:int):
	try:
		data=get_data_by_id(attractionId)
		if not data["data"]:
			return JSONResponse(status_code=400,content={"error":True,"message":"沒有這個編號"})
		return data
	except :
		return JSONResponse(status_code=500,content={"error":True,"message":"發生錯誤"})
	

@app.get("/api/mrts")
async def get_mrts(request:Request):
	try:
		data=get_some_mrt()
		return data
	except:
		return JSONResponse(status_code=500,content={"error":True,"message":"發生錯誤"})
	

@app.post("/api/user")
async def reg(request:Request):
	body = await request.json()
	name = body.get("name")
	email = body.get("email")
	password = body.get("password")
	try:
		data = register(name,email,password)
		if data.get("error"):
			return JSONResponse(status_code=400,content=data)
		Send = threading.Thread(target=create_send_checkNum,args=(email,name))
		Send.start()
		return data
	except:
		return JSONResponse(status_code=500,content={"error":True,"message":"發生錯誤"})


@app.get("/api/user/auth")
async def get_user(request:Request):
	authorization:str = request.headers.get("Authorization")
	if not authorization or not authorization.startswith("Bearer "):
		return None
	try:
		data = get_current_user(authorization.split(" ")[1])
		return data
	except:
		return None


@app.put("/api/user/auth")
async def log(request:Request):
	body = await request.json()
	email = body.get("email")
	password = body.get("password")
	try:
		data = login(email,password)
		if data.get("error"):
			return JSONResponse(status_code=400,content=data)
		if data.get("unactive"):
			return {"unactive":True}
		return data
	except:
		return JSONResponse(status_code=500,content={"error":True,"message":"發生錯誤"})

@app.put("/api/user")		#多做：確認驗證碼是否正確，是就將active改成True並直接登入
async def checknumber(request:Request):
	body = await request.json()
	num = body.get("num")
	email = body.get("email")
	password = body.get("password")
	res = check_checkNum(email,num)
	if res.get("active") == 0:
		return {"unactive":True}
	elif res.get("active"):
		try:
			data = login(email,password)
			if data.get("error"):
				return JSONResponse(status_code=400,content=data)
			if data.get("unactive"):
				return {"unactive":True}
			return data
		except:
			return JSONResponse(status_code=500,content={"error":True,"message":"發生錯誤"})

@app.post("/api/user/auth")	#多做：重新發一次驗證碼
async def recheck(request:Request):
	body = await request.json()
	email = body.get("email")
	name = body.get("name")
	try:
		create_send_checkNum(email,name)
		return {"recheck":"true"}
	except:
		return JSONResponse(status_code=500,content={"error":True,"message":"發生錯誤"})

@app.get("/api/booking")
async def get_Booking(request:Request):
	authorization:str = request.headers.get("Authorization")
	if not authorization or not authorization.startswith("Bearer "):
		return JSONResponse(status_code=403,content={"error":True,"message":"未登入系統"})
	try:
		user = get_current_user(authorization.split(" ")[1])
		if not user:
			return JSONResponse(status_code=403,content={"error":True,"message":"未登入系統"})
		
		data = get_booking(user["data"]["id"])
		return data
	except:
		return JSONResponse(status_code=500,content={"error":True,"message":"發生錯誤"})
	
@app.post("/api/booking")
async def create_Booking(request:Request):
	authorization:str = request.headers.get("Authorization")
	body = await request.json()
	attractionId=body.get("attractionId")
	date=body.get("date")
	time=body.get("time")
	price=body.get("price")
	if not authorization or not authorization.startswith("Bearer "):
		return JSONResponse(status_code=403,content={"error":True,"message":"未登入系統"})
	try:
		user = get_current_user(authorization.split(" ")[1])
		if not user:
			return JSONResponse(status_code=403,content={"error":True,"message":"未登入系統"})
		print(user["data"]["id"],attractionId,date,time,price)
		data = create_booking(user["data"]["id"],attractionId,date,time,price)
		if data.get("error"):
			return JSONResponse(status_code=400,content=data)
		return data
	except:
		return JSONResponse(status_code=500,content={"error":True,"message":"發生錯誤"})

@app.delete("/api/booking")
async def del_Booking(request:Request):
	authorization:str = request.headers.get("Authorization")
	if not authorization or not authorization.startswith("Bearer "):
		return JSONResponse(status_code=403,content={"error":True,"message":"未登入系統"})
	try:
		user = get_current_user(authorization.split(" ")[1])
		if not user:
			return JSONResponse(status_code=403,content={"error":True,"message":"未登入系統"})
		data = del_booking(user["data"]["id"])
		return data
	except:
		return JSONResponse(status_code=500,content={"error":True,"message":"發生錯誤"})

@app.post("/api/orders")
async def create_order(request:Request):
	authorization:str = request.headers.get("Authorization")
	if not authorization or not authorization.startswith("Bearer "):
		return JSONResponse(status_code=403,content={"error":True,"message":"未登入系統"})
	try:
		user = get_current_user(authorization.split(" ")[1])
		if not user:
			return JSONResponse(status_code=403,content={"error":True,"message":"未登入系統"})
	except:
		return JSONResponse(status_code=500,content={"error":True,"message":"發生錯誤"})
	body = await request.json()
	prime = body.get("prime")
	price = body["order"]["price"]
	attractionId = body["order"]["trip"]["attraction"]["id"]
	date = body["order"]["trip"]["date"]
	time = body["order"]["trip"]["time"]
	phone = body["order"]["contact"]["phone"]
	userId = user["data"]["id"]
	name = user["data"]["name"]
	email = user["data"]["email"]
	orderID = create_orders(userId,attractionId,date,time,price,phone)
	if(orderID.get("error")):
		return JSONResponse(status_code=500,content={"error":True,"message":"連接資料庫發生錯誤"})
	oderId = orderID["ok"]
	res = fetch_to_tappay(prime,attractionId,price,phone,name,email,oderId)
	if res.get("error"):
		return JSONResponse(status_code=400,content={"error":True,"message":res["message"]})
	change_order_pay(oderId)
	return res

@app.get("/api/order/{orderNumber}")
async def get_order_data(request:Request,orderNumber:str):
	authorization:str = request.headers.get("Authorization")
	if not authorization or not authorization.startswith("Bearer "):
		return JSONResponse(status_code=403,content={"error":True,"message":"未登入系統"})
	try:
		user = get_current_user(authorization.split(" ")[1])
		if not user:
			return JSONResponse(status_code=403,content={"error":True,"message":"未登入系統"})
	except:
		return JSONResponse(status_code=500,content={"error":True,"message":"發生錯誤"})
	name = user["data"]["name"]
	email = user["data"]["email"]
	data = get_order_number_list(orderNumber,name,email)
	return data