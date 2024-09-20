# import email.message
# import smtplib


# def send_check_email(Email,num):

#     msg = email.message.EmailMessage()
#     msg["From"]="lin3hwong6@gmail.com"
#     msg["To"]=Email    
#     msg["Subject"]="台北悠閒一日遊：會員驗證信"

#     msg.add_alternative("""
#         <h3>你好~以下是您的驗證碼</h3>
#         <p style="color:red;font-size:32px">{}</P>""".format(num),subtype="html")

#     server = smtplib.SMTP_SSL("smtp.gmail.com",465)
#     server.login("lin3hwong6@gmail.com","wpaz tffz jbng xuro")
#     server.send_message(msg)
#     server.close()

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
def send_check_email(Email,num,name):
    sendFrom = "lin3hwong6@gmail.com"
    senderPassword = "wpaz tffz jbng xuro"
    content = MIMEMultipart()
    content["subject"] = "台北悠閒一日遊：會員驗證信"
    content["from"] =  sendFrom
    content["to"] = Email

    html_content = f"""
    <h3>親愛的{name}你好~以下是您的驗證碼</h3>
    <p style="color:red;font-size:32px">{num}</P>
    """

    content.attach(MIMEText(html_content,"html"))
    with smtplib.SMTP(host="smtp.gmail.com",port="587") as smtp:
        try:
            smtp.ehlo()
            smtp.starttls()
            smtp.login(sendFrom,senderPassword)
            smtp.send_message(content)
            print("成功")
        except Exception as e:
            print({"error:":e})
            
