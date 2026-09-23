# SUBSCAN — Subdomain Reconnaissance & Attack-Surface Discovery Platform

**SUBSCAN** is a modern, standalone cybersecurity web application built for domain owners, security engineers, and threat analysts. It performs real-time client-side subdomain discovery, DNS-over-HTTPS (DoH) resolution, passive attack-surface risk analysis, and multi-format report exports—all directly inside the browser.

![SUBSCAN Security. UI](https://img.shields.io/badge/Security-SOC%20Attack%20Surface%20Recon-cyan)
![Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20Vite%20%7C%20Tailwind%20CSS-blue)
![License](https://img.shields.io/badge/License-MIT-emerald)

---

## 🚀 How the Project Works

SUBSCAN performs a controlled 10-stage defensive reconnaissance workflow against authorized target domains :

```text
Target Domain Input (e.g. example.com)
            ↓
    Domain Syntax Validation
            ↓
Passive Certificate Transparency Discovery (crt.sh)
            ↓
  Candidate Normalization & Deduplication
            ↓
      Wildcard DNS Detection
            ↓
Real-Time DNS-over-HTTPS (DoH) Resolution (Cloudflare DoH API)
            ↓
    HTTP / HTTPS Service Probing
            ↓
  Passive Technology Stack Fingerprinting
            ↓
  CNAME & Dangling DNS Vulnerability Analysis
            ↓
SOC-Inspired Dark Dashboard & Interactive Visualizations
            ↓
Report Export (TXT, CSV, JSON, HTML)
```

### Core Architecture & Live Discovery Engine

1. **Passive Subdomain Enumeration**:
   Queries public Certificate Transparency (CT) logs (`crt.sh`) via browser fetch to retrieve actual registered SSL/TLS certificates for the target domain without sending intrusive traffic to the target.

2. **Real-Time DNS-over-HTTPS (DoH) Resolution**:
   Queries Cloudflare's secure DoH API (`https://cloudflare-dns.com/dns-query`) live for real `A` (IP addresses), `CNAME`, `MX`, and `TXT` records for every discovered hostname.

3. **Active Host Availability & IP Drift Tracking**:
   Hosts resolving to live IP addresses on the public internet are classified as `ACTIVE`, displaying their real IP addresses and record details.

4. **CNAME & Dangling DNS Risk Analysis**:
   Analyzes resolved CNAME targets against cloud service provider signatures (GitHub Pages, Amazon S3, Heroku, Azure, Shopify, Zendesk) to detect unclaimed or misconfigured records (potential dangling DNS).

5. **SOC-Inspired Dark Theme Dashboard**:
   Built with React 18, Tailwind CSS, Recharts, and Lucide React icons, offering an interactive security operations center (SOC) interface.

---

## ✨ Key Features

- **Live Progress & Streaming Terminal Logs**: Visualizes recon stages with percentage progress and real-time terminal output.
- **KPI Stat Overview**: Total Subdomains, Active Hosts, Inactive Hosts, Unique IPs, HTTP/HTTPS Services, CNAME Records, and Security Findings.
- **Interactive Recharts Visualizations**:
  - Host Availability Ratio (Donut Chart)
  - HTTP Status Code Distribution (Bar Chart)
  - Discovery Source Breakdown (Pie Chart)
  - Top Identified Web Technologies (Horizontal Bar Chart)
- **Subdomain Master Data Table**: Real-time search across hostnames, IPs, CNAMEs, and titles, with status filters, pagination, and 1-click domain copying.
- **Subdomain Detail View**: Tabbed modal displaying DNS records (`A`, `AAAA`, `CNAME`, `MX`, `TXT`, `NS`), HTTP responses, TLS certificate information, technology stack, and security findings.
- **Scan Comparison Diff Tool**: Compare Scan A vs Scan B side-by-side to track newly added subdomains, removed subdomains, and infrastructure changes over time.
- **Multi-Format Report Export**: One-click downloads for `TXT`, `CSV`, `JSON`, and standalone `HTML` reports.

---

## 📁 Repository Structure

```text
Sub-Domain/
├── src/
│   ├── components/
│   │   ├── common/                 # Navbar, StatCard, Badge
│   │   ├── dashboard/              # ScanForm banner & options
│   │   ├── subdomains/             # SubdomainTable, SubdomainDetailModal
│   │   └── charts/                 # DashboardCharts (Recharts)
│   ├── pages/
│   │   ├── DashboardPage.jsx       # Target input, KPI stats, charts, data table
│   │   ├── LiveScanPage.jsx        # Live recon progress & streaming terminal logs
│   │   ├── ScanHistoryPage.jsx     # Saved scan history logs
│   │   └── ScanComparePage.jsx     # Scan A vs Scan B diff comparison tool
│   ├── hooks/
│   │   └── useScanWebSocket.js     # Live recon event stream hook
│   ├── services/
│   │   ├── mockScanService.js      # DoH + crt.sh live browser recon engine
│   │   └── api.js                  # Data service client & report generators
│   ├── utils/
│   │   └── formatters.js           # Date & status formatters
│   ├── App.jsx                     # Router & shell layout
│   ├── main.jsx                    # React entrypoint
│   └── index.css                   # Tailwind imports & dark theme styling
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── README.md
```

---

## 🛠️ How to Setup & Run the Project

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- `npm` (v9.0.0 or higher)

### 1. Clone the Repository

```bash
git clone https://github.com/chakreshram11/Sub-Domain.git
cd Sub-Domain
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open **`http://localhost:5173`** in your browser.

### 4. Build for Production

```bash
npm run build
```

The optimized static production bundle will be generated in the `dist/` directory.

---

## 🛡️ Security & Authorization Notice

**SUBSCAN is designed strictly for defensive cybersecurity assessment and authorized attack-surface discovery.** Users must only perform scans against domains they own or have explicit authorization to assess.
