🚀 BidWise – Smart Credit-Based Online Auction Platform

🏆 Hackathon Project:** CodeBidz  
👨‍💻 Team Name:** Knight Striver  
👥 Team Members:** K Purusotam Achary, Kamalakanta Giri  


 🌐 Live Links
 
🚀 Frontend (Live App):** [https://bidwise-xi.vercel.app](https://bidwise-xi.vercel.app)
📂 Project Drive (Docs / Assets):** [Google Drive Folder](https://drive.google.com/drive/folders/150NNmFOi22Lh16CLO8XKx79b7pzU4IcR)



💡 Project Idea

BidWise is a smart, credit-based online auction platform designed to eliminate fraud, ensure fairness, and enhance bidding decisions using AI. Unlike traditional auction systems, users bid using virtual credits instead of real money, which significantly reduces financial risk and prevents malicious misuse.



🚨 Problem Statement

Current online auction platforms suffer from several critical vulnerabilities:
* Fake bidding and malicious bot activity.
* Payment risks, financial fraud, and lack of spending control.
* Unfair last-second bidding (auction sniping).

---

### ✅ Our Solution

BidWise tackles these challenges head-on by introducing:
* **💳 Credit-Based Bidding:** A safe, cashless environment to control spending.
* **⚡ Real-Time Updates:** Seamless live synchronization for all participants.
* **🤖 AI-Powered Assistance:** Smart bidding recommendations.
* **🛡️ Advanced Fraud Detection:** Multi-layered security and verification.
* **🔗 Transparent Bid Ledger:** Immutable and verifiable auction records.



### ⚙️ How It Works

1.  The admin creates an auction and assigns virtual credits to verified users.
2.  Users browse available auctions and join the ones they are interested in.
3.  Participants place bids using their allocated credits.
4.  The platform updates the auction state in real-time across all clients.
5.  If outbid, a user's credits are immediately refunded to their wallet.
6.  If a user wins, the final bid amount is permanently deducted from their balance.



### 🌟 Key Features

* **🔐 Safe Bidding Environment:** No direct money is involved during the live auction, ensuring controlled and risk-free participation.
* **⚡ Real-Time Engine:** Powered by WebSockets for instant updates and live bid tracking.
* **⏳ Anti-Sniping Mechanism:** Any bid placed in the last 10 seconds automatically extends the auction timer by 30 seconds to ensure fairness.
* **🤖 AI Smart Bid Assistant:** Analyzes data to suggest optimal bid ranges, predict winning probabilities, and warn against overbidding (acts purely as an advisor; users bid manually).
* **🛡️ Fraud Prevention System:** Utilizes DigiLocker verification, device/IP tracking, bid behavior analysis, and automated fraud scoring.
* **🔗 Blockchain-Style Ledger:** Employs bid hashing to maintain transparent and immutable records of all auction activity.



### 🛠️ Tech Stack

| Category | Technologies |
| |  |
| **Frontend** | React, Next.js, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | Supabase (PostgreSQL) |
| **Real-Time** | Socket.io |
| **AI Integration** | Custom smart recommendation logic |



 📊 System Architecture

The architecture follows a streamlined, real-time data flow:
* The **React UI** communicates seamlessly with backend REST APIs.
* The **Backend** processes core bidding logic and fraud detection algorithms.
* **Supabase** securely stores all auction, user, and ledger data.
* **Socket.io** enables instantaneous, bidirectional updates between the server and all active clients.



📸 Demo Workflow

1.  Admin logs in, creates a new auction, and distributes credits.
2.  Bidders join the live auction room.
3.  Real-time bidding commences with AI assistance available.
4.  The system handles timer extensions and real-time refunds.
5.  The winner is declared automatically when the timer expires.



### 🔮 Future Scope

* Integration of true blockchain smart contracts for the bid ledger.
* Development of a dedicated cross-platform mobile application.
* Implementation of advanced, machine-learning-driven fraud detection.
* Expansion into a global, cross-border auction marketplace.



