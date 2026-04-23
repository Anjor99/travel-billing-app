import smtplib
from email.mime.text import MIMEText
from config import settings

def send_verification_email(
    to_email: str,
    token: str
):

    verification_link = (
        f"{settings.APP_BASE_URL}/auth/verify-email?token={token}"
    )

    subject = "Verify Your Email"

    body = f"""
    Welcome!

    Click below to verify your email:

    {verification_link}

    """

    msg = MIMEText(body)

    msg["Subject"] = subject
    msg["From"] = settings.EMAIL_USER
    msg["To"] = to_email

    server = smtplib.SMTP(
        settings.EMAIL_HOST,
        int(settings.EMAIL_PORT)
    )

    server.starttls()

    server.login(
        settings.EMAIL_USER,
        settings.EMAIL_PASSWORD
    )

    server.send_message(msg)

    server.quit()