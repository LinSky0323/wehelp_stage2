import json,re
from sql import push_attraction,get_attraction_by_id,get_attraction_by_mrt,get_attraction_by_name,get_all_attraction

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
def get_data_by_id(id):
    data=get_attraction_by_id(id)
    if data:
        data.images=data.images.split(",")
    return {"data":data}
def get_some_data(page,keyword):
    if not keyword:
        data=get_all_attraction()
    else:
        data=get_attraction_by_mrt(keyword)
    if not data:
        data=get_attraction_by_name(keyword)
    length=len(data)
    max_page=length//12
    list=[]
    if page >= max_page or page < 0:
        nextPage = None
    else:
        nextPage = page+1
    for i in range(page*12,page*12+12):
        if i >= length:
            break
        data[i].images=data[i].images.split(",")
        list.append(data[i])
    return {"nextPage":nextPage,"data":list}
def get_some_mrt():
    data=get_all_attraction()
    dict={}
    for item in data:
        if item.mrt == None:
            continue
        if item.mrt in dict:
            dict[item.mrt]+=1
        else:
            dict[item.mrt]=1
    results=sorted(dict,key=dict.__getitem__,reverse=True)
    return results





    

