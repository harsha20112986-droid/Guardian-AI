import os

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

from ml.feature_extractor import extract_features


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "..", "..", "datasets", "phishing_urls.csv")
MODEL_DIR = os.path.join(BASE_DIR, "saved_models")
MODEL_PATH = os.path.join(MODEL_DIR, "phishing_model.pkl")


def load_dataset():
    dataset = pd.read_csv(DATASET_PATH)

    features = dataset["URL"].apply(extract_features)
    X = pd.DataFrame(features.tolist())
    y = dataset["label"]

    return X, y


def train_model():
    X, y = load_dataset()

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    model = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        n_jobs=-1,
    )

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    print(f"\nAccuracy : {accuracy:.4f}\n")
    print(classification_report(y_test, predictions))

    os.makedirs(MODEL_DIR, exist_ok=True)

    joblib.dump(model, MODEL_PATH)

    print(f"Model saved to:\n{MODEL_PATH}")


if __name__ == "__main__":
    train_model()