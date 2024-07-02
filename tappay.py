import requests,datetime,json
PARTNER_KEY=""
MERCHANT_ID = ""
URL = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
header = {"Content-Type":"application/json","x-api-key": PARTNER_KEY}

def fetch_to_tappay(prime,attractionId,price,phone,name,email,orderId):
    A=datetime.datetime.now().strftime("%m%d%H%M%S")
    B=str(orderId).zfill(8)
    data={
        "prime": prime,
        "partner_key": PARTNER_KEY,
        "merchant_id": MERCHANT_ID,
        "details":"trip:"+str(attractionId),
        "amount": price,
        "order_number":"A"+A+B,
        "cardholder": {
            "phone_number": phone,
            "name": name,
            "email": email,
            "zip_code": "",
            "address": "",
            "national_id": ""
        },
        "remember": False
    }
    res = requests.post(URL,headers=header,json=data)
    if res.json()["status"] == 0:
        return{
            "data":{
                "number":res.json()["order_number"],
                "payment":{
                "status":res.json()["status"] ,
                "message":"付款成功"
                }
            }
        }
    else:
        return{"error":True,"message":res.json()["msg"]}
    


