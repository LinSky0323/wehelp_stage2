import email.message
import smtplib


def send_check_email(Email,num):

    msg = email.message.EmailMessage()
    msg["From"]="lin3hwong6@gmail.com"
    msg["To"]=Email    
    msg["Subject"]="台北悠閒一日遊：會員驗證信"

    msg.add_alternative("""
        <h3>你好~以下是您的驗證碼</h3>
        <p style="color:red;font-size:32px">{}</P>""".format(num),subtype="html")

    server = smtplib.SMTP_SSL("smtp.gmail.com",465)
    server.login("lin3hwong6@gmail.com","wpaz tffz jbng xuro")
    server.send_message(msg)
    server.close()

send_check_email("a3822584@gmail.com",123456)