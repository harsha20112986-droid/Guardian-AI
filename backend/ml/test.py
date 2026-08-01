from ml.predict import predict_url


TEST_URLS = [
    "https://www.google.com",
    "https://github.com",
    "https://www.microsoft.com",
    "https://www.wikipedia.org",
    "https://chat.openai.com",
    "http://paypal-security-login.xyz/login",
    "http://192.168.1.10/login",
    "http://verify-account-security-update.com",
    "http://secure-paypal-login-update.xyz",
    "https://bit.ly/3xYzAbC",
]


def print_result(result):
    print("=" * 80)
    print(f"URL            : {result['url']}")
    print(f"Prediction     : {result['prediction']}")
    print(f"Confidence     : {result['confidence']}%")
    print(f"Rule Score     : {result['rule_score']}")
    print(f"Final Score    : {result['final_score']}")
    print(f"Risk Level     : {result['risk_level']}")
    print(f"Trusted Domain : {result['trusted_domain']}")

    print("\nReasons:")

    if result["reasons"]:
        for reason in result["reasons"]:
            print(f" • {reason}")
    else:
        print(" • No suspicious indicators.")

    print()


def main():
    print("\nGuardian AI - URL Scanner\n")

    for url in TEST_URLS:
        try:
            result = predict_url(url)
            print_result(result)
        except Exception as error:
            print("=" * 80)
            print(url)
            print(error)
            print()


if __name__ == "__main__":
    main()