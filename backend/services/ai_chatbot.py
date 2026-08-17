import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from google import genai

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_FILE)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing from the backend .env file."
    )

GEMINI_MODEL = "gemini-3.5-flash-lite"

client = genai.Client(api_key=GEMINI_API_KEY)

SYSTEM_INSTRUCTIONS = """
You are Guardian AI Assistant, a cybersecurity and digital-safety assistant.

Help users understand and protect themselves from phishing, scam messages,
malicious URLs, QR-code scams, online fraud, fake offers, account takeover,
suspicious emails, password threats, social engineering, identity risks,
and privacy risks.

Give clear, practical, concise answers.

Never encourage clicking suspicious links, sharing passwords, OTPs,
authentication codes, API keys, private keys, or disabling security
protections.

If a user clicked a suspicious link, provide damage-control steps such as
changing compromised passwords through the legitimate website, enabling MFA,
checking account activity, and contacting the relevant organization.

Distinguish between safe, suspicious, and high-risk situations.

Never claim to have scanned or verified something unless Guardian AI
actually provides scan information.

Do not invent scan results, scores, URLs, domains, or technical evidence.

If uncertain, say so.

Do not provide instructions for hacking, credential theft, malware deployment,
evasion, or unauthorized access. Redirect such requests toward defensive
cybersecurity practices.

Keep responses concise and useful.
"""

def generate_response(
    message: str,
    conversation_history: Optional[list] = None,
) -> str:
    message = (message or "").strip()

    if not message:
        raise ValueError("Assistant message cannot be empty.")

    if len(message) > 4000:
        raise ValueError(
            "Assistant message is too long. Please keep it below 4000 characters."
        )

    conversation_history = conversation_history or []

    history = []

    for item in conversation_history[-4:]:
        if not isinstance(item, dict):
            continue

        role = str(item.get("role", "")).strip().lower()
        content = str(item.get("content", "")).strip()

        if not content:
            continue

        if role == "user":
            history.append(f"User: {content}")
        elif role == "assistant":
            history.append(f"Guardian AI: {content}")

    if history:
        prompt = (
            f"{SYSTEM_INSTRUCTIONS}\n\n"
            f"Recent conversation:\n"
            f"{chr(10).join(history)}\n\n"
            f"User: {message}\n\n"
            f"Guardian AI:"
        )
    else:
        prompt = (
            f"{SYSTEM_INSTRUCTIONS}\n\n"
            f"User: {message}\n\n"
            f"Guardian AI:"
        )

    try:
        interaction = client.interactions.create(
            model=GEMINI_MODEL,
            input=prompt,
        )

        response_text = (
            getattr(interaction, "output_text", None) or ""
        ).strip()

        if not response_text:
            raise RuntimeError(
                "Gemini returned an empty response."
            )

        return response_text

    except Exception as error:
        print("Guardian AI Gemini error:", error)

        raise RuntimeError(
            "The AI Assistant is temporarily unavailable. Please try again."
        ) from error