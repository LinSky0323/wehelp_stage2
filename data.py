import json,re
from sql import push_attraction,get_attraction_by_id,get_mrt_list,get_some_data

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






    

