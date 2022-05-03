import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()


class Email(EmailMessage):
    def __init__(self, Subject: str, To: str, Message: str, filename: str, ext: str, path: str):
        self.Subject = Subject
        self.To = To
        self.Message = Message
        self.filename = filename
        self.ext = ext
        self.path = path

    def enviar(self):
        msg = EmailMessage()
        msg['Subject'] = self.Subject
        msg['From'] = os.getenv('EMAIL_ADDRESS')
        msg['To'] = self.To
        msg.set_content(self.Message)

        with open(self.path, 'rb') as f:
            image_data = f.read()
            image_type = self.ext
            image_name = self.filename

        msg.add_attachment(
            image_data, maintype='image', subtype=image_type, filename=image_name)

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(os.getenv('EMAIL_ADDRESS'), os.getenv('EMAIL_PASSWORD'))
            smtp.send_message(msg)
