from sqlalchemy import create_engine,String,ForeignKey,Text,distinct,func,desc,Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker,Mapped,mapped_column
from sqlalchemy.pool import NullPool
from typing_extensions import Annotated
import pymysql
pymysql.install_as_MySQLdb()

#建立連線到mysql的engine
#pool_recycle:讓connecttion pool時間到自動重建，避免過期遺失連線造成錯誤
engine=create_engine("mysql://root:密碼@localhost/website",echo=False,pool_recycle=28800)  #可以加 echo_pool="debug" 去除錯
Base=declarative_base()

#事先定義好column類型
int_pk=Annotated[int,mapped_column(primary_key=True,autoincrement=True)]
nes_str=Annotated[str,mapped_column(String(255),unique=True,nullable=False)]
nor_str=Annotated[str,mapped_column(String(1000),nullable=True)]
nor_float=Annotated[float,mapped_column()]
nor_int=Annotated[int,mapped_column()]
long_str=Annotated[str,mapped_column(Text)]

#建立(連結)到符合物件內容的table
class Attraction(Base):
    __tablename__ = "attraction"
    
    id:Mapped[int_pk]
    name:Mapped[nes_str]
    category:Mapped[nor_str]
    description:Mapped[long_str]
    address:Mapped[nor_str]
    transport:Mapped[nor_str]
    mrt:Mapped[str]=mapped_column(String(255),index=True,nullable=True)
    lat:Mapped[nor_float]
    lng:Mapped[nor_float]
    images:Mapped[long_str]

class User(Base):
    __tablename__ = "user"

    id:Mapped[int_pk]
    name:Mapped[str]=mapped_column(String(255),nullable=False,index=True,unique=True)
    email:Mapped[str]=mapped_column(String(255),nullable=False,index=True,unique=True)
    password:Mapped[str]=mapped_column(String(255),nullable=False)

#建立session
Base.metadata.create_all(engine)
Session=sessionmaker(bind=engine)

session=Session()

#添加資料到table中
def push_attraction(nam,cat,des,add,tra,mr,la,ln,ima):
    attraction=Attraction(
        name=nam,category=cat,description=des,
        address=add,transport=tra,mrt=mr,
        lat=la,lng=ln,images=ima)
    session.add(attraction)
    session.commit()
    session.close()

#取得mrt list
def get_mrt_list():
    data=session.query(Attraction.mrt,func.count(Attraction.mrt)).group_by(Attraction.mrt).order_by(desc(func.count())).all()
    session.close()
    return data
    
#取得單獨的資料by id
def get_attraction_by_id(id):
    data = session.query(Attraction).filter(Attraction.id == id).first()
    session.close()
    return data

#取得一頁的資料by page keyword
def get_some_data(page,keyword):
    if keyword == None:
        data = session.query(Attraction).limit(12).offset(page*12).all()
    elif keyword != None:
        data = session.query(Attraction).filter(Attraction.mrt == keyword)[12*page:12*page+12] 
    if not data and keyword != None:
        data = session.query(Attraction).filter(Attraction.name.like("%"+keyword+"%"))[12*page:12*page+12]
    session.close()
    nextPage = page+1
    if len(data) < 12:
        nextPage = None
    return data,nextPage

#註冊帳號密碼
def reg_user(name,email,password):
    if session.query(User.name).filter(User.name == name).first():
        return {"error":True,"message":"使用者名稱重複，請你想一點有趣的名字"}
    if session.query(User.email).filter(User.email == email).first():
        return {"error":True,"message":"此信箱已經註冊過了，您真健忘"}
    user = User(name=name,email=email,password=password)
    session.add(user)
    session.commit()
    session.close()
    return {"ok":True}

#確認是否有此帳號密碼
def login_user(email,password):
    acount = session.query(User.name).filter(User.email == email).first()
    pw = session.query(User).filter(User.email == email , User.password == password).first()
    if not acount:
        return {"error":True,"message":"這個信箱還沒有註冊喔~~ 你是不是打錯字咧"}
    if not pw:
        return {"error":True,"message":"密碼打錯喔~~ 你是不是打錯字咧"}
    session.close()
    return {"id":pw.id,"name":pw.name,"email":pw.email}


