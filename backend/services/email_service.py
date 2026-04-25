import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from jinja2 import Environment, FileSystemLoader

from config import settings
from datetime import datetime, timedelta
import uuid


# =========================
# Load Templates
# =========================

env = Environment(

    loader=FileSystemLoader(
        "templates/email"
    )

)


# =========================
# Render Template
# =========================

def render_template(

    template_name: str,
    context: dict

):

    template = env.get_template(
        template_name
    )

    return template.render(
        context
    )


# =========================
# Send Verification Email
# =========================

def send_verification_email(

    email: str,
    token: str

):

    verify_link = (

        f"{settings.APP_BASE_URL}"
        f"/verify-email?token={token}"

    )


    html_content = render_template(

        "verify_email.html",

        {

            "verify_link":
                verify_link

        }

    )


    message = MIMEMultipart()

    message["From"] = settings.EMAIL_USER
    message["To"] = email
    message["Subject"] = "Verify Your Email"


    message.attach(

        MIMEText(
            html_content,
            "html"
        )

    )


    try:

        with smtplib.SMTP(

            settings.EMAIL_HOST,

            int(settings.EMAIL_PORT)

        ) as server:

            server.starttls()

            server.login(

                settings.EMAIL_USER,

                settings.EMAIL_PASSWORD

            )

            server.send_message(
                message
            )

    except Exception as e:

        print(
            "Email send error:",
            str(e)
        )


def send_reset_password_email(

    email: str,
    token: str

):

    reset_link = (

        f"{settings.APP_BASE_URL}"
        f"/reset-password?token={token}"

    )

    html_content = render_template(

        "forgot_password.html",

        {

            "reset_link":
                reset_link

        }

    )

    message = MIMEMultipart()

    message["From"] = settings.EMAIL_USER
    message["To"] = email
    message["Subject"] = "Reset Your Password"

    message.attach(

        MIMEText(
            html_content,
            "html"
        )

    )

    with smtplib.SMTP(

        settings.EMAIL_HOST,
        int(settings.EMAIL_PORT)

    ) as server:

        server.starttls()

        server.login(

            settings.EMAIL_USER,
            settings.EMAIL_PASSWORD

        )

        server.send_message(
            message
        )