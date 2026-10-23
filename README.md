# 📄 ATSScan - ATS Resume Checker

ATSScan is a lightweight, client-side Applicant Tracking System (ATS) resume scanner designed to help job seekers optimize their resumes against job descriptions. It compares keywords, calculates an ATS match score, identifies missing skills, and provides actionable recommendations to increase interview chances.

---

## ✨ Features

- **🎯 ATS Match Score:** Computes real-time compatibility percentage between your resume and target job description.
- **🔍 Smart Keyword Extraction:** Automatically filters common stop words and identifies technical skills, tools, and industry keywords.
- **✅ Matched & Missing Keywords:** Categorizes extracted keywords into matched qualifications and missing requirements.
- **💡 Actionable Suggestions:** Provides targeted advice to improve keyword density, layout, and formatting.
- **📤 Resume Upload:** Paste text directly or upload resume files (`.txt`, `.pdf`).
- **⚡ Client-Side & Private:** All text processing happens locally in your browser—no data is sent to external servers.

---

## 🛠️ Tech Stack

- **HTML5:** Semantic markup structure.
- **CSS3:** Modern UI with gradients, cards, and responsive layout.
- **JavaScript (Vanilla):** Keyword parsing, scoring algorithm, and DOM manipulation.
- **live-server:** Lightweight local development server with live reload.

---

## 📂 Project Structure

```text
ats/
├── index.html          # Main HTML structure
├── style.css           # Styling and layout
├── script.js           # Core ATS analysis logic and algorithms
├── package.json        # Project metadata and dev scripts
├── .gitignore          # Git ignore rules (node_modules, etc.)
└── README.md           # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AKASH4YOU/ats-checker-.git
   cd ats-checker-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm start
   ```

4. The application will open automatically in your browser at `http://127.0.0.1:8080`.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you have ideas for improvements, new keywords, or UI enhancements.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
