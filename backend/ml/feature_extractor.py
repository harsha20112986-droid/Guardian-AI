import math
import re
from collections import Counter
from urllib.parse import urlparse


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

KEYWORDS = [
    "login",
    "verify",
    "bank",
    "paypal",
    "secure",
    "update",
    "account",
    "signin",
    "confirm",
    "password",
]


def shannon_entropy(text: str) -> float:
    if not text:
        return 0.0

    counts = Counter(text)
    length = len(text)

    return -sum(
        (count / length) * math.log2(count / length)
        for count in counts.values()
    )


def extract_features(url: str) -> dict:
    parsed = urlparse(url)

    hostname = parsed.hostname.lower() if parsed.hostname else ""

    return {
        "url_length": len(url),
        "domain_length": len(hostname),
        "path_length": len(parsed.path),
        "query_length": len(parsed.query),
        "fragment_length": len(parsed.fragment),
        "dot_count": url.count("."),
        "hyphen_count": url.count("-"),
        "underscore_count": url.count("_"),
        "slash_count": url.count("/"),
        "digit_count": sum(char.isdigit() for char in url),
        "question_count": url.count("?"),
        "equal_count": url.count("="),
        "ampersand_count": url.count("&"),
        "percent_count": url.count("%"),
        "at_count": url.count("@"),
        "colon_count": url.count(":"),
        "subdomain_count": max(hostname.count(".") - 1, 0),
        "has_https": int(parsed.scheme == "https"),
        "has_ip": int(bool(re.fullmatch(r"(?:\d{1,3}\.){3}\d{1,3}", hostname))),
        "shortened_url": int(hostname in SHORTENERS),
        "entropy": shannon_entropy(url),
        **{
            f"contains_{keyword}": int(keyword in url.lower())
            for keyword in KEYWORDS
        },
    }