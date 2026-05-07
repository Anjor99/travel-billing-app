import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from jinja2 import Environment, FileSystemLoader

from config import settings


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
# Shared Email Sender
# =========================

def send_email(

    recipient: str,
    subject: str,
    html_content: str

):

    message = MIMEMultipart()

    message["From"] = settings.EMAIL_USER
    message["To"] = recipient
    message["Subject"] = subject

    message.attach(

        MIMEText(
            html_content,
            "html"
        )

    )

    try:

        with smtplib.SMTP_SSL(

            settings.EMAIL_HOST,
            int(settings.EMAIL_PORT)

        ) as server:

            server.login(

                settings.EMAIL_USER,
                settings.EMAIL_PASSWORD

            )

            server.send_message(
                message
            )

            print(
                f"Email sent successfully to {recipient}"
            )

    except Exception as e:

        print(
            "Email send error:",
            str(e)
        )


# =========================
# Verification Email
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

    send_email(

        recipient=email,
        subject="Verify Your Email",
        html_content=html_content

    )


# =========================
# Reset Password Email
# =========================

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

    send_email(

        recipient=email,
        subject="Reset Your Password",
        html_content=html_content

    )