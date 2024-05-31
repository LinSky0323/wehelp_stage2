from sqlalchemy import create_engine,String,ForeignKey,Text,distinct,func,desc,Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker,Mapped,mapped_column
from typing_extensions import Annotated
import pymysql
pymysql.install_as_MySQLdb()


engine=create_engine("mysql://root:y4hwong6@localhost/website",echo=True)
Base=declarative_base()

int_pk=Annotated[int,mapped_column(primary_key=True,autoincrement=True)]
nes_str=Annotated[str,mapped_column(String(255),unique=True,nullable=False)]
nor_str=Annotated[str,mapped_column(String(1000),nullable=True)]
nor_float=Annotated[float,mapped_column()]
nor_int=Annotated[int,mapped_column()]
long_str=Annotated[str,mapped_column(Text)]

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




Base.metadata.create_all(engine)
Session=sessionmaker(bind=engine)

session=Session()

def push_attraction(nam,cat,des,add,tra,mr,la,ln,ima):
    attraction=Attraction(
        name=nam,category=cat,description=des,
        address=add,transport=tra,mrt=mr,
        lat=la,lng=ln,images=ima)
    session.add(attraction)
    session.commit()
    session.close()


def get_mrt_list():
    data=session.query(Attraction.mrt,func.count(Attraction.mrt)).group_by(Attraction.mrt).order_by(desc(func.count())).all()
    if data:
        session.expunge_all()
    return data
    

def get_attraction_by_id(id):
    data = session.query(Attraction).filter(Attraction.id == id).first()
    if data:
        session.expunge(data)
    return data

def get_some_data(page,keyword):
    if keyword == None:
        data = session.query(Attraction).limit(12).offset(page*12).all()
    elif keyword != None:
        data = session.query(Attraction).filter(Attraction.mrt == keyword)[12*page:12*page+12] 
    if not data and keyword != None:
        data = session.query(Attraction).filter(Attraction.name.like("%"+keyword+"%"))[12*page:12*page+12]
    if data:
        session.expunge_all()
    nextPage = page+1
    if len(data) < 12:
        nextPage = None
    return data,nextPage


  