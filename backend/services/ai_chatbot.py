import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from google import genai


# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent

ENV_FILE = BASE_DIR / ".env"

load_dotenv(
    dotenv_path=ENV_FILE
)


# ==========================================
# GEMINI CONFIGURATION
# ==========================================

GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY"
)

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing from the backend .env file."
    )


GEMINI_MODEL = "gemini-3.6-flash"

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# ==========================================
# GUARDIAN AI SYSTEM INSTRUCTIONS
# ==========================================

SYSTEM_INSTRUCTIONS = """
You are Guardian AI Assistant, a cybersecurity and
digital-safety assistant built specifically for the
Guardian AI platform.

Your primary purpose is to help users understand and
protect themselves from:

- Phishing websites
- Scam messages and SMS
- Malicious URLs
- QR-code scams
- Online fraud
- Fake offers and lottery scams
- Account takeover attempts
- Suspicious emails and messages
- Password and account-security threats
- Social-engineering attacks
- Identity and privacy risks

IMPORTANT BEHAVIOR:

1. Give clear, practical and easy-to-understand answers.

2. When discussing a suspicious message, URL, QR code,
   or online activity, explain the warning signs and
   recommend safe actions.

3. Never encourage a user to click a suspicious link,
   provide credentials, share OTPs, disable security
   protections, or perform unsafe actions.

4. Never ask users to provide passwords, OTPs,
   authentication codes, API keys, private keys,
   or other sensitive credentials.

5. If a user reports that they clicked a suspicious
   link, focus on damage-control steps such as:
   disconnecting from the suspicious site,
   changing compromised passwords from the legitimate
   website, enabling MFA, checking account activity,
   and contacting the relevant organization.

6. Clearly distinguish between:
   - Safe
   - Suspicious
   - High-risk / dangerous

7. Do not claim that you have scanned or verified a URL
   unless Guardian AI actually provides scan information
   to you.

8. If the user provides Guardian AI scan results,
   explain those results in simple language.

9. Do not invent security findings, scan scores,
   URLs, domains, or technical evidence.

10. If you are uncertain, say so rather than making
    unsupported claims.

11. Keep answers concise but useful. Use bullet points
    when they make the answer easier to understand.

12. You are a cybersecurity assistant, not a replacement
    for law enforcement, financial institutions,
    cybersecurity professionals, or emergency services.

13. Do not provide instructions for hacking, credential
    theft, malware deployment, evasion, or unauthorized
    access. Redirect such requests toward defensive and
    legitimate cybersecurity practices.

Always prioritize user safety.
"""


# ==========================================
# GENERATE ASSISTANT RESPONSE
# ==========================================

def generate_response(
    message: str,
    conversation_history: Optional[list] = None,
) -> str:
    """
    Generate a Guardian AI security-focused response.

    conversation_history should contain previous
    messages in this format:

    [
        {
            "role": "user",
            "content": "What is phishing?"
        },
        {
            "role": "assistant",
            "content": "Phishing is..."
        }
    ]
    """

    message = (message or "").strip()

    if not message:
        raise ValueError(
            "Assistant message cannot be empty."
        )

    if len(message) > 4000:
        raise ValueError(
            "Assistant message is too long. "
            "Please keep it below 4000 characters."
        )

    conversation_history = (
        conversation_history or []
    )

    # ==========================================
    # BUILD CONVERSATION CONTEXT
    # ==========================================

    conversation_parts = [
        SYSTEM_INSTRUCTIONS.strip()
    ]

    for item in conversation_history[-10:]:
        if not isinstance(item, dict):
            continue

        role = str(
            item.get("role", "")
        ).strip().lower()

        content = str(
            item.get("content", "")
        ).strip()

        if not content:
            continue

        if role == "user":
            conversation_parts.append(
                f"User: {content}"
            )

        elif role == "assistant":
            conversation_parts.append(
                f"Guardian AI Assistant: {content}"
            )

    conversation_parts.append(
        f"User: {message}"
    )

    conversation_parts.append(
        "Guardian AI Assistant:"
    )

    prompt = "\n\n".join(
        conversation_parts
    )

    # ==========================================
    # CALL GEMINI
    # ==========================================

    try:
        interaction = client.interactions.create(
            model=GEMINI_MODEL,
            input=prompt,
        )

        response_text = (
            getattr(
                interaction,
                "output_text",
                None,
            )
            or ""
        ).strip()

        if not response_text:
            raise RuntimeError(
                "Gemini returned an empty response."
            )

        return response_text

    except Exception as error:
        print(
            "Guardian AI Gemini error:",
            error,
        )

        raise RuntimeError(
            "The AI Assistant is temporarily "
            "unavailable. Please try again."
        ) from error