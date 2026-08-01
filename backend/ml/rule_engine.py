from urllib.parse import urlparse
import ipaddress


SUSPICIOUS_KEYWORDS = {
    "login",
    "verify",
    "secure",
    "update",
    "account",
    "bank",
    "paypal",
    "signin",
    "confirm",
    "password",
}

SUSPICIOUS_TLDS = {
    ".xyz",
    ".top",
    ".tk",
    ".gq",
    ".ml",
    ".cf",
    ".buzz",
    ".work",
}

SHORTENERS = {
    "bit.ly",
    "tinyurl.com",
    "goo.gl",
    "t.co",
    "ow.ly",
    "buff.ly",
    "is.gd",
    "cutt.ly",
    "rebrand.ly",
    "shorturl.at",
}


def is_ip_address(hostname: str) -> bool:
    try:
        ipaddress.ip_address(hostname)
        return True
    except ValueError:
        return False


def calculate_rule_score(url: str):
    parsed = urlparse(url)

    hostname = parsed.hostname.lower() if parsed.hostname else ""
    full_url = url.lower()

    score = 0
    reasons = []

    if is_ip_address(hostname):
        score += 40
        reasons.append("Uses an IP address.")

    if len(url) > 100:
        score += 10
        reasons.append("Very long URL.")

    if hostname.count(".") > 3:
        score += 10
        reasons.append("Too many subdomains.")

    if hostname.count("-") >= 3:
        score += 10
        reasons.append("Too many hyphens.")

    if parsed.scheme == "http":
        score += 15
        reasons.append("Uses HTTP instead of HTTPS.")

    for keyword in SUSPICIOUS_KEYWORDS:
        if keyword in full_url:
            score += 10
            reasons.append(f"Contains '{keyword}'.")

    if hostname in SHORTENERS:
        score += 25
        reasons.append(f"Uses URL shortener ({hostname}).")

    for tld in SUSPICIOUS_TLDS:
        if hostname.endswith(tld):
            score += 20
            reasons.append(f"Uses suspicious TLD ({tld}).")
            break

    return min(score, 100), reasons