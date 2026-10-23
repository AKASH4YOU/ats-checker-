# 📄 ATSScan AI — Smart Resume Analyzer & Job Match Engine

**ATSScan AI** is a professional, client-side Applicant Tracking System (ATS) resume optimization platform built with pure **HTML5, CSS3, and Vanilla JavaScript**. It evaluates resumes against job descriptions, computes deterministic compatibility scores, identifies missing critical skills, audits document structural sections, and delivers prioritized, actionable suggestions.

All file parsing and analysis runs **100% locally in the browser** — no resume text or personal details are transmitted to external servers.

---

## ✨ Key Features

### 1. 🎨 Modern SaaS Interface
- **Premium Palette:** Deep navy, indigo, and violet design with soft elevation shadows, crisp typography, and responsive layouts.
- **Light & Dark Mode:** Smooth theme switcher with automatic preference persistence in `localStorage`.
- **Sticky Navigation:** Quick jump to Hero, Workspace, Workflow, and Local Scan History.

### 2. 📂 Flexible Document Input Workspace
- **Dual Resume Modes:**
  - **📁 Upload File:** Drag-and-drop or file browse for **PDF**, **DOCX**, and **TXT** files (up to 10MB). Displays document icon, file size, success badge, and a collapsible text preview drawer.
  - **✍️ Paste Text:** Clean textarea with live character and word counters.
- **Target Job Description:**
  - Large input area with live character and word counts.
  - **⚡ Quick Role Presets:** 1-click sample loader for *Full Stack Software Engineer*, *Data Scientist / AI*, and *Product Manager*.
  - **Interactive Live Demo:** One click to test the full analysis with sample data.

### 3. 🧠 Deterministic ATS Scoring & Analysis Engine
- **Animated Circular Score Gauge:** Visual SVG progress ring with color transitions and qualitative candidate ratings (*Strong Match*, *Good Match*, *Moderate Match*, *Needs Optimization*).
- **Categorized Keyword Breakdown:**
  - 💻 Technical Skills & Programming Languages
  - 🛠️ Tools, Cloud Infrastructure & Platforms
  - 🎯 Domain Competencies & Methodologies
- **Dynamic Skill Comparison:** Side-by-side presence verification (*"Identified in Resume"* vs. *"Not identified in document"*).
- **Resume Quality Checklist:**
  - Contact Information verification (Email, Phone, LinkedIn/GitHub)
  - Standard Section Headings detection (Education, Experience, Skills)
  - Action Verbs density audit (e.g. *Architected*, *Engineered*, *Optimized*)
  - Quantifiable Metrics check (Percentages `%`, numbers, multipliers `10x`)

### 4. 🚀 Practical Productivity Tools
- **🖨️ PDF / Print Export:** Formats the entire analysis into a clean, executive printable PDF report via `@media print`.
- **💾 Local Scan History:** Saves high-level summary scores locally in `localStorage` with individual deletion and "Clear All" controls.
- **📋 Copy to Clipboard:** 1-click copy for matched/missing keyword lists and formatted recommendations.
- **🔒 100% Client-Side Privacy:** Zero server dependencies, zero external tracking, and zero database logging.

---

## 🛠️ Technology Stack

- **HTML5:** Semantic, accessible page layout with SVG icons.
- **CSS3:** Custom properties (CSS variables) for light/dark themes, responsive flexbox/grid, and print stylesheets.
- **JavaScript (ES6+):** Modular client-side parsing, tokenization, frequency analysis, and DOM manipulation.
- **PDF.js (CDN):** Local client-side PDF text extraction.
- **Mammoth.js (CDN):** Local client-side Word (.docx) text extraction.
- **live-server:** Local development server with live reload.

---

## 📐 Scoring Formula & Transparency

ATSScan AI calculates compatibility using a transparent, multi-factor deterministic formula:

$$\text{ATS Score} = \left(\frac{\text{Matched Keywords}}{\text{Total Job Keywords}} \times 50\right) + \left(\text{Skills Match Ratio} \times 25\right) + \left(\frac{\text{Section Score}}{100} \times 15\right) + \text{Impact Score (up to 10)}$$

> *Disclaimer:* ATSScan AI is an educational and analytical tool designed to optimize resume keyword alignment and structure. Real corporate Applicant Tracking Systems (e.g., Workday, Greenhouse, Taleo) employ varied proprietary parsing filters, and hiring managers evaluate candidates subjectively. This tool does not guarantee job placement.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation & Launch
```bash
# 1. Clone repository
git clone https://github.com/AKASH4YOU/ats-checker-.git
cd ats-checker-

# 2. Install dependencies
npm install

# 3. Start local server
npm start
```

The application will launch automatically at `http://127.0.0.1:8080`.

---

## 📄 License
This project is licensed under the [ISC License](LICENSE).
