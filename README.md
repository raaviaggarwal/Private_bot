# Amberleigh Private Bank — Virtual Concierge & Policy Portal 🏦🤖

An AI-powered corporate concierge, internal policy database, and employee assistant portal for **Amberleigh Private Bank**.

![Amberleigh Concierge Portal](index.html)

---

## 🌟 Key Features

* **7 Integrated Corporate Policy Documents**:
  1. `HR-GDE-009`: New Joiner Onboarding Guide
  2. `FIN-POL-008`: Expense & Travel Policy
  3. `HR-POL-006`: Medical & Health Benefits Policy
  4. `ISEC-POL-005`: Information Security & Data Privacy Policy
  5. `COMP-POL-003`: Compliance & AML / KYC Policy
  6. `COMP-POL-002`: Code of Conduct & Ethics Policy
  7. `HR-POL-001`: HR Policy Handbook
* **Modular Backend Architecture**:
  * Every policy is stored as a clean, human-editable JSON configuration file in the `/data` directory.
  * Live dynamic fetching (`KnowledgeBase.loadFromBackend()`) ensures edits on disk immediately update the chatbot.
* **Instant RAG Search Engine**:
  * 0ms synchronous local retrieval for policy questions (expense caps, medical tiers, leave days, password rules).
  * Auto-falling back to Google Gemini AI for conversational explanations.
* **Built-in Admin Portal**:
  * Visual GUI to add, edit, or delete articles and departments directly from the browser window.
* **ChatGPT-Style Markdown Renderer**:
  * Rich HTML formatting with bold tags, headings, lists, and zero raw asterisks.

---

## 📁 Repository Structure

```
├── data/                            # Live Backend Policy JSON Configs
│   ├── onboarding_guide.json        # HR-GDE-009
│   ├── expense_travel_policy.json   # FIN-POL-008
│   ├── medical_health_benefits.json # HR-POL-006
│   ├── infosec_data_privacy.json    # ISEC-POL-005
│   ├── compliance_aml_kyc.json      # COMP-POL-003
│   ├── code_of_conduct_ethics.json  # COMP-POL-002
│   ├── hr_policy_handbook.json      # HR-POL-001
│   └── corporate_overview.json      # Careers & Investor Relations
├── index.html                       # Single Page App Shell
├── styles.css                       # Modern Dark Mode UI Stylesheet
├── app.js                           # App Controller, Search Engine & Gemini Integration
├── knowledge.js                     # Policy Knowledge Base & Backend Data Loader
├── server.js                        # Lightweight Pure Node.js Backend Server
├── run_backend_server.bat           # 1-Click Windows Batch Launcher
├── package.json                     # NPM Configuration
└── README.md                        # Documentation
```

---

## 🚀 Quick Start

### Running the Backend Server:

```bash
npm start
```
*or double-click `run_backend_server.bat`.*

Open your browser to: **`http://localhost:8000`**

---

## ⚙️ Administration & Customization

* **Admin Portal Passcode**: `DBAdmin2026`
* To update policy thresholds (e.g. daily meal caps or flight entitlements):
  1. Edit the relevant JSON file inside the `data/` folder.
  2. Refresh the browser page to immediately apply changes.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
