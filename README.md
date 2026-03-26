# GraphGPT: Conversational Intelligence on Knowledge Graphs

##  Project Overview
This project was developed as part of the **Dodge AI Forward Deployed Engineer Task Assessment**.  
It demonstrates a **graph‑based conversational model** powered by LLMs (Large Language Models), designed to handle structured knowledge and deliver intelligent, context‑aware dialogue.

The goal is to showcase:
- How LLMs can integrate with **knowledge graphs** for richer reasoning.
- Secure, production‑ready workflows (including `.env` management).
- Recruiter‑facing clarity in project documentation and presentation.

---

##  Features
- **Graph‑based conversation flow**: Nodes and edges represent dialogue states and knowledge.
- **LLM integration**: GPT‑style responses enhanced with structured context.
- **Secure environment handling**: `.env` excluded via `.gitignore` and safe deployment practices.
- **Frontend demo**: React/Next.js interface for interactive conversations.
- **Scalable deployment**: Configured for cloud platforms (Vercel/Render).

---
#Architecture Decisions
The system is designed with **modularity and scalability** in mind:
- **Frontend (React/Next.js)** → Provides an interactive conversational UI, optimized for recruiter demos and user experience.
- **Backend (Node.js/Express)** → Handles API requests, graph queries, and integrates with the LLM.
- **Knowledge Graph Layer** → Models real‑world entities (Orders, Deliveries, Invoices, Payments) as nodes and relationships, enabling structured reasoning.
- **Deployment** → Configured for cloud platforms (Vercel/Render) with environment variables securely managed outside of source control.
---

##  Security Practices
- `.env` file is ignored via `.gitignore` to prevent secret leaks.
- Example configuration provided in `/.env.example`.
- Environment variables managed securely in deployment dashboards.

---
##  Real‑World Dataset
This project integrates a **business operations dataset** to simulate realistic conversational queries.  
The dataset includes:

- **Orders** → Customer purchase records, product details, and order status.  
- **Deliveries** → Shipment tracking, delivery dates, and logistics information.  
- **Invoices** → Billing documents, invoice numbers, and payment terms.  
- **Payments** → Transaction records, payment methods, and settlement status.  

By modeling these entities as **graph nodes and relationships**, the LLM can answer complex queries such as:
- “Show me all pending deliveries for Order #1234.”  
- “Which invoices are unpaid for Customer X?”  
- “List payments received in the last 7 days.”

🗄️ Database Choice
- **Graph Database (MongoDB with graph modeling)** → Chosen to represent relationships between business entities like Orders → Deliveries → Invoices → Payments.
- This allows queries such as:
  - “Which deliveries are pending for Order #1234?”
  - “Show invoices linked to unpaid payments.”
- Graph databases are ideal because they **mirror real‑world relationships** and make conversational reasoning more natural.




 LLM Prompting Strategy
- **Contextual Prompts** → Each user query is enriched with graph context before being sent to the LLM.
- **Few‑Shot Examples** → Prompts include examples of business queries (e.g., “List unpaid invoices”) to guide the model toward structured answers.
- **Dynamic Injection** → Relevant graph data (nodes/edges) is injected into the prompt so the LLM can reason over actual business records.
- **Response Formatting** → Prompts instruct the LLM to return concise, recruiter‑friendly answers (tables, lists, or summaries).


## 📊 Example Query Flow
1. User asks: *“Show me pending deliveries for Order #1234.”*  
2. Backend retrieves graph nodes: `Order #1234 → Delivery status = pending`.  
3. Prompt sent to LLM:  


