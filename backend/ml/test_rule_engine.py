from ml.rule_engine import calculate_rule_score


TEST_URLS = [
    "https://www.google.com",
    "https://github.com",
    "https://bit.ly/3xYzAbC",
    "http://paypal-security-login.xyz/login",
    "http://192.168.1.10/login",
    "http://verify-account-security-update.com",
]


def main():
    for url in TEST_URLS:
        score, reasons = calculate_rule_score(url)

        print("=" * 80)
        print(f"URL   : {url}")
        print(f"Score : {score}")

        print("\nReasons:")

        if reasons:
            for reason in reasons:
                print(f" • {reason}")
        else:
            print(" • No suspicious indicators.")

        print()


if __name__ == "__main__":
    main()