# 🛡️ Guardian AI

> **AI-Powered Digital Safety & Threat Detection Platform**

Guardian AI is an AI-powered cybersecurity platform designed to help users identify phishing websites, scam messages, malicious QR codes, and other online threats.

The system combines **Machine Learning, rule-based security analysis, URL feature extraction, risk scoring, and authenticated user management** to provide understandable and actionable security assessments.

---

## 🎯 Project Objective

The primary objective of Guardian AI is to provide users with a centralized digital safety assistant capable of analyzing different forms of potentially malicious content.

The platform analyzes:

- 🌐 Phishing URLs
- 📱 Scam SMS messages
- 📷 QR codes containing potentially malicious URLs
- ⚠️ Suspicious online content

Instead of only returning a binary result, Guardian AI provides:

- Prediction
- Confidence
- Rule score
- Final risk score
- Risk level
- Detection reasons

This makes the detection result easier for users to understand.

---

# 🚀 Key Features

## 🔐 Authentication & Account Security

- User registration
- Email verification
- Secure login
- JWT-based authentication
- Forgot password functionality
- Password reset
- Protected routes
- User/admin role management
- Secure logout

---

## 🌐 Phishing URL Detection

Guardian AI analyzes URLs using a combination of:

### Machine Learning

The URL is converted into numerical features such as:

- URL length
- Domain length
- Path length
- Query length
- Dot count
- Hyphen count
- Digit count
- Subdomain count
- HTTPS usage
- IP address usage
- URL shortener detection
- Entropy
- Suspicious keyword presence

The trained ML model then predicts whether the URL is:

```text
Legitimate
or:

Phishing
Rule-Based Detection

Guardian AI also evaluates suspicious URL characteristics including:

IP address usage
Very long URLs
Excessive subdomains
Excessive hyphens
HTTP instead of HTTPS
Suspicious keywords
URL shorteners
Suspicious top-level domains

The rule engine generates a score and explanatory reasons.

Trusted Domains

Trusted domains can be identified before the normal phishing analysis pipeline.

A verified trusted domain receives:

Prediction: Legitimate
Confidence: 100%
Rule Score: 0
Final Score: 0
Risk Level: Low
📷 QR Code Safety Checker

Guardian AI allows users to upload an image containing a QR code.

The system uses OpenCV QRCodeDetector to decode the QR code.

QR Detection Pipeline
QR Image
   ↓
Image Processing
   ↓
QR Code Detection
   ↓
Decode QR Content
   ↓
Extract URL
   ↓
Guardian AI URL Analysis
   ↓
ML + Rule Engine
   ↓
Risk Assessment
   ↓
Result
   ↓
Scan History

When the QR code contains a URL, the extracted URL is analyzed using the same Guardian AI URL detection pipeline.

QR scans are stored separately using:

scan_type = "QR"

This allows QR activity to appear separately from URL scans in History and Analytics.

📱 SMS Scam Detection

Guardian AI analyzes SMS messages for common scam and phishing indicators.

The SMS rule engine checks for suspicious keywords such as:

winner
won
lottery
reward
claim
urgent
verify
bank
account
OTP
gift
click
limited
expire
congratulations
SMS Detection Pipeline
SMS Message
     ↓
Text Normalization
     ↓
Suspicious Keyword Detection
     ↓
URL Extraction
     ↓
Embedded URL Analysis
     ↓
Risk Score Calculation
     ↓
Scam / Suspicious / Safe
     ↓
Save to Scan History

If the SMS contains a URL, Guardian AI also sends the embedded URL through the URL phishing detection system.

This provides an additional layer of analysis for messages containing suspicious links.

SMS Classification
Score	Classification	Risk
0–39	Safe	Low
40–69	Suspicious	Medium
70–100	Scam	High
⚠️ Risk Assessment

Guardian AI converts detection signals into a final risk score.

For URL analysis:

Rule Score
     +
ML Confidence
     ↓
Final Risk Score
     ↓
Risk Level

Risk levels are:

Score	Risk Level
0–39	🟢 Low
40–74	🟡 Medium
75–100	🔴 High

The system also provides detection reasons so that users can understand why a particular result was classified as risky.

📊 Analytics Dashboard

The Analytics section provides a visual overview of the user's security activity.

It includes:

Total scans
Safe scans
Threats detected
Average risk
Safe vs Threat distribution
Low / Medium / High risk distribution
URL / QR / SMS distribution
Recent scan activity
Search functionality
CSV export
Refresh functionality

Analytics are generated from the authenticated user's scan history.

🕒 Scan History

Guardian AI stores scan results for authenticated users.

Each scan can contain:

Scan ID
User ID
Scan type
Scanned content
Prediction
Confidence
Rule score
Final score
Risk level
Detection reasons
Scan timestamp

Supported scan types:

URL
QR
SMS

Users can:

View their scan history
Search scan history
Delete individual scans
Clear their complete history

User history is isolated using the authenticated user's ID.

👤 User Profile

The Profile section provides a centralized view of the user's account.

It displays:

User name
Email address
Account type
Authentication status
Total scans
Safe scans
Threats detected

It also provides quick access to:

Account Settings
Logout
⚙️ Settings

The Settings section provides application and account controls.

It includes functionality for:

Security settings
Notification preferences
Scan preferences
History management
Clearing scan history
Logout
👨‍💼 Admin Dashboard

Guardian AI provides a dedicated administrator dashboard.

Only users with the admin role can access administrative functionality.

Dashboard Statistics

Administrators can view:

Total users
Verified users
Unverified users
Total scans
Phishing scans
Legitimate scans
High-risk scans
Medium-risk scans
Low-risk scans
User Management

Administrators can:

View all users
Search users
Promote users to administrator
Demote administrators
Delete users

The system prevents an administrator from deleting their own administrator account.

Scan Management

Administrators can:

View all scans
Search scans
Filter scans
Filter by URL
Filter by QR
Filter by SMS
Delete scan records
🔐 Authorization Architecture

Guardian AI uses role-based access control.

                    Authentication
                         │
                         ▼
                    JWT Token
                         │
                         ▼
                  Current User
                    /       \
                   /         \
                  ▼           ▼
                User         Admin
                 │             │
                 ▼             ▼
          User Features    Admin Features

Normal users can access:

Home
URL Scanner
QR Scanner
SMS Scanner
History
Analytics
Profile
Settings

Administrators can additionally access:

Admin Dashboard
User Management
Scan Management
Role Management
🧠 Overall Detection Architecture
                         GUARDIAN AI
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
         URL Scanner      QR Scanner      SMS Scanner
              │               │               │
              │               ▼               ▼
              │          QR Decoder       Text Analysis
              │               │               │
              │               ▼               ▼
              │          Extract URL      URL Extraction
              │               │               │
              └───────────────┼───────────────┘
                              ▼
                     Detection Engine
                       ┌──────┴──────┐
                       │             │
                       ▼             ▼
                  ML Model      Rule Engine
                       │             │
                       └──────┬──────┘
                              ▼
                       Risk Assessment
                              │
                              ▼
                        Scan History
                         ┌────┴────┐
                         ▼         ▼
                    Analytics   History
🔄 URL Detection Pipeline
URL Input
   ↓
Input Validation
   ↓
Trusted Domain Check
   ↓
Feature Extraction
   ↓
ML Prediction
   ↓
Rule-Based Analysis
   ↓
Confidence Calculation
   ↓
Final Risk Score
   ↓
Risk Level
   ↓
Detection Reasons
   ↓
Database
🔄 QR Detection Pipeline
QR Image Upload
      ↓
Image Validation
      ↓
OpenCV QRCodeDetector
      ↓
QR Content Extraction
      ↓
URL Extraction
      ↓
URL Detection Pipeline
      ↓
Risk Assessment
      ↓
Database
      ↓
History / Analytics
🔄 SMS Detection Pipeline
SMS Input
    ↓
Input Validation
    ↓
Keyword Analysis
    ↓
Suspicious Pattern Detection
    ↓
URL Extraction
    ↓
Embedded URL Analysis
    ↓
Risk Score
    ↓
Scam / Suspicious / Safe
    ↓
Database
    ↓
History / Analytics
🛠️ Technology Stack
Frontend
React
React Router
Axios
Tailwind CSS
Lucide React
Chart.js
React Chart.js 2
Backend
Python
FastAPI
SQLAlchemy
Pydantic
Uvicorn
Machine Learning
Python
Pandas
Joblib
Machine Learning classification model
Feature engineering
Rule-based detection
QR Processing
OpenCV
NumPy
Database
SQLite for development
SQLAlchemy ORM
PostgreSQL-compatible architecture for future deployment
Authentication & Security
JWT
bcrypt/password hashing
Email verification
Password reset tokens
Role-based access control
Environment-based secret management
📁 Project Structure
Guardian-AI/
│
├── backend/
│   │
│   ├── app.py
│   ├── database.py
│   ├── models.py
│   ├── requirements.txt
│   ├── .env
│   ├── .env.example
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── admin.py
│   │   ├── history.py
│   │   ├── url.py
│   │   ├── qr.py
│   │   └── sms.py
│   │
│   ├── services/
│   │   ├── url_scanner.py
│   │   ├── qr_detector.py
│   │   └── sms_scanner.py
│   │
│   ├── ml/
│   │   ├── predict.py
│   │   ├── feature_extractor.py
│   │   ├── rule_engine.py
│   │   ├── trusted_domains.py
│   │   └── saved_models/
│   │       └── phishing_model.pkl
│   │
│   └── migrations/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
⚙️ Installation
Prerequisites

Install the following:

Python 3.10+
Node.js
npm
Git
🔧 Backend Setup

Navigate to the backend:

cd backend

Create a Python virtual environment:

python -m venv .venv
Windows

Activate the environment:

.venv\Scripts\Activate.ps1

Install the Python dependencies:

pip install -r requirements.txt
🔑 Environment Configuration

Create the following file:

backend/.env

Configure your environment variables.

Example:

GUARDIAN_SECRET_KEY=your-random-secret-key

Configure your email settings according to your authentication/email service.

Important

Never commit the real .env file to Git.

Use:

backend/.env.example

as a safe configuration template.

▶️ Run the Backend

From the backend directory:

uvicorn app:app --reload

The backend will normally run at:

http://127.0.0.1:8000

FastAPI documentation:

http://127.0.0.1:8000/docs
💻 Frontend Setup

Open a separate terminal.

Navigate to the frontend:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173
🔌 API Endpoints
Authentication
POST /auth/signup
POST /auth/login
GET  /auth/verify-email
POST /auth/forgot-password
POST /auth/reset-password
URL Scanner
POST /scan-url
QR Scanner
POST /scan-qr/
SMS Scanner
POST /sms/scan
History
GET    /history/
GET    /history/stats
DELETE /history/{history_id}
DELETE /history/
Admin
GET    /admin/dashboard
GET    /admin/users
GET    /admin/scans
PATCH  /admin/users/{user_id}/role
DELETE /admin/users/{user_id}
DELETE /admin/scans/{scan_id}
🧪 Testing

Guardian AI has been tested across the major application workflows.

Authentication Testing
User registration
Email verification
Login
Logout
Forgot password
Password reset
Protected routes
Admin authorization
URL Testing
Legitimate URLs
Phishing URLs
Trusted domains
Suspicious URLs
Rule-based detection
ML-based prediction
Risk scoring
QR Testing
Valid QR images
QR URL extraction
QR URL analysis
Invalid QR images
QR history storage
SMS Testing
Safe messages
Suspicious messages
Scam messages
Suspicious keywords
Embedded URLs
Embedded phishing URL detection
Data Testing
User-specific scan history
Scan deletion
History clearing
Analytics
CSV export
Admin Testing
Admin dashboard
User search
User deletion
Role promotion
Role demotion
Scan search
Scan filtering
Scan deletion
🔒 Security Measures

Guardian AI includes several security mechanisms:

JWT-based authentication
Password hashing
Email verification
Password reset tokens
Protected frontend routes
Backend authentication dependencies
Admin-only API endpoints
Admin-only frontend routes
Role-based access control
User-specific history filtering
Environment-based JWT secret
.env excluded from Git
Generated Python cache excluded from Git
Virtual environment excluded from Git
Node modules excluded from Git
📈 Current Project Status
✅ Core Implementation Complete

Guardian AI currently provides an integrated working platform containing:

Authentication
      +
Email Verification
      +
Password Recovery
      +
URL Phishing Detection
      +
QR Code Detection
      +
SMS Scam Detection
      +
Machine Learning
      +
Rule-Based Detection
      +
Risk Assessment
      +
Scan History
      +
Analytics
      +
User Profile
      +
Settings
      +
Admin Dashboard
      +
User Management
      +
Role Management

The system is currently suitable for academic demonstration, project evaluation, and further deployment preparation.

🔮 Future Enhancements

Potential future improvements include:

Advanced NLP-based SMS classification
Deep learning-based phishing detection
Browser extension integration
Real-time threat intelligence APIs
Domain reputation APIs
Email phishing detection
Multilingual scam detection
Mobile application
Real-time security notifications
Behavioral threat analysis
Cloud deployment
PostgreSQL production deployment
Continuous model retraining
Explainable AI improvements
🎓 Academic Project Scope

Guardian AI demonstrates the integration of:

Artificial Intelligence
Machine Learning
Cybersecurity
Natural Language Processing concepts
Computer Vision for QR detection
Full-stack web development
REST API development
Database management
Authentication and authorization
Role-based access control
Data visualization

The project combines these technologies into a single digital safety platform.

⚠️ Disclaimer

Guardian AI is an academic cybersecurity project intended to assist users in identifying potentially suspicious digital content.

Detection results are predictions and should not be considered an absolute guarantee that a website, message, or QR code is safe or malicious.

Users should always exercise caution when interacting with unknown links, messages, websites, and QR codes.