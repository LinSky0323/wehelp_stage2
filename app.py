from fastapi import *
from fastapi.responses import FileResponse,JSONResponse
from typing import Annotated
from data import get_data_by_id,get_some_mrt,get_data
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware


app=FastAPI()
app.mount("/static", StaticFiles(directory="build/static"), name="static")
app.mount("/statics", StaticFiles(directory="build"), name="statics")
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )



# Static Pages (Never Modify Code in this Block)
@app.get("/", include_in_schema=False)
async def index(request: Request):
	return FileResponse("./public/index.html", media_type="text/html")
@app.get("/attraction/{id}", include_in_schema=False)
async def attraction(request: Request, id: int):
	return FileResponse("./static/attraction.html", media_type="text/html")
@app.get("/booking", include_in_schema=False)
async def booking(request: Request):
	return FileResponse("./static/booking.html", media_type="text/html")
@app.get("/thankyou", include_in_schema=False)
async def thankyou(request: Request):
	return FileResponse("./static/thankyou.html", media_type="text/html")


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