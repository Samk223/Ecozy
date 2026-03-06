## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

   Below is a **complete, clean, professional README.md content** you can paste directly into your GitHub repository for **Ecozy**.
It is structured to match the **assignment requirements (architecture overview + AI prompt design)**. 

---

# Ecozy — AI Platform for Sustainable Commerce

Ecozy is an AI-powered platform designed to simplify sustainable commerce by automating product catalog management and generating intelligent B2B proposals for eco-friendly businesses.

The platform demonstrates how AI can be integrated with real business workflows to reduce manual operational effort while encouraging environmentally responsible product choices.

---

#  Project Overview

Many sustainable businesses struggle with:

* manually categorizing eco-friendly products
* organizing product catalogs
* preparing purchase proposals for business clients
* highlighting sustainability impact

Ecozy addresses these problems by integrating AI into two key workflows:

1. **Product Catalog Structuring**
2. **B2B Proposal Generation**

The system reduces manual work and enables businesses to make smarter purchasing decisions using structured data and AI reasoning.

---

#  Story Behind the Name — Ecozy

The name **Ecozy** is derived from two ideas:

**Eco**
Represents sustainability, environmentally responsible products, and green commerce.

**Cozy**
Represents simplicity, comfort, and an effortless user experience.

Ecozy reflects the idea of making sustainability tools **simple, intuitive, and accessible**.

Instead of sustainability workflows feeling complicated, Ecozy makes them **cozy — automated and easy to use with AI assistance.**

---

#  Meet Lumi — Ecozy’s AI Assistant

Ecozy includes an integrated assistant called **Lumi**.

The name **Lumi** comes from the word **luminous**, meaning light and guidance.

Lumi helps users:

* understand platform features
* onboard easily
* navigate the system
* resolve issues

Just like light guiding someone through a path, Lumi guides users through the Ecozy platform.

---

#  Implemented AI Modules

According to the assignment requirements, **two modules are implemented**. 

---

# 1️. AI Product Auto-Category & Tag Generator

This module automatically enriches product data using AI.

Users upload product information such as:

* product name
* description
* materials
* price

The AI then generates:

• primary category
• sub-category
• SEO tags (5–10)
• sustainability filters

Example filters:

* plastic-free
* compostable
* recyclable
* biodegradable
* vegan

### Example Output

```json
{
  "category": "Packaging",
  "subCategory": "Food Containers",
  "seoTags": ["eco packaging", "biodegradable container", "sustainable packaging"],
  "sustainabilityFilters": ["compostable", "plastic-free"]
}
```

This structured data is stored in the database.

### Benefit

Reduces manual catalog management and improves product discoverability.

---

# 2️. AI B2B Proposal Generator

This module generates **sustainable purchasing proposals** for businesses.

User inputs:

* client name
* budget
* optional product preferences

The system:

1. retrieves suitable products from the database
2. recommends a sustainable product mix
3. allocates budget across products
4. generates cost breakdown
5. produces a sustainability-focused proposal summary

### Example Output

```json
{
  "recommendedProducts": [
    { "product": "Bamboo Cutlery Set", "quantity": 200, "cost": 500 },
    { "product": "Compostable Containers", "quantity": 150, "cost": 750 }
  ],
  "totalCost": 1250,
  "budgetRemaining": 250,
  "impactSummary": "This proposal replaces single-use plastic products with compostable and bamboo alternatives."
}
```

---

#  Architecture Design (Not Implemented)

The system also includes architecture for two additional modules.

---

# 3️. AI Impact Reporting Generator

Purpose: generate sustainability insights for orders.

Workflow:

1. Retrieve order data
2. Calculate environmental metrics

   * plastic saved
   * carbon avoided
   * local sourcing impact
3. Send metrics to AI model
4. Generate human-readable sustainability statement
5. Store report with order data

Example output:

```json
{
  "plasticSaved": "5kg",
  "carbonAvoided": "12kg CO2",
  "impactStatement": "This order reduces plastic waste and lowers carbon emissions through sustainable materials."
}
```

---

# 4️. AI WhatsApp Support Bot

Purpose: automated customer support via WhatsApp.

Workflow:

1. User sends message
2. WhatsApp API receives message
3. Webhook processes request
4. AI detects user intent
5. Backend retrieves relevant data
6. AI generates response
7. Response sent back to user
8. Conversation logged

Supported queries:

* order status
* return policies
* refund requests
* general questions

---

#  System Architecture

High-level workflow:

```
User
 ↓
Product Upload
 ↓
AI Categorization
 ↓
Structured Product Database
 ↓
B2B Proposal Generator
 ↓
Proposal Output
```

Additional modules extend the system:

```
Orders → Impact Reporting Engine → Sustainability Report

Customer Query → WhatsApp Bot → AI Response
```

---

#  Technology Stack

Framework
Next.js (App Router)

Language
TypeScript

Database
In-memory database (lib/serverDb.ts)

AI Integration
Google Generative AI (@google/genai)

Validation
Zod

Deployment
Vercel

---

#  Project Structure

```
ecozy
│
├── app
│   ├── dashboard
│   ├── products
│   ├── proposal-generator
│   └── api
│       ├── categorize
│       └── generate-proposal
│
├── components
│   ├── ProductForm
│   ├── ProductCard
│   └── ProposalGenerator
│
├── lib
│   ├── aiClient.ts
│   ├── categorizer.ts
│   ├── proposalEngine.ts
│   ├── serverDb.ts
│   └── logger.ts
```

---

#  AI Prompt Design

Example prompt for categorization:

```
Analyze the following product information and generate structured JSON:

Product Name: Bamboo Cutlery Set
Description: Reusable bamboo utensils for eco-friendly dining.

Return:
- primary category
- sub-category
- 5–10 SEO tags
- sustainability filters
```

Example response:

```json
{
  "category": "Dining",
  "subCategory": "Reusable Cutlery",
  "seoTags": ["bamboo utensils","eco dining","sustainable cutlery"],
  "sustainabilityFilters": ["plastic-free","biodegradable"]
}
```

---

#  Setup Instructions

Clone the repository

```
git clone https://github.com/your-username/ecozy
```

Install dependencies

```
npm install
```

Run development server

```
npm run dev
```

Open

```
http://localhost:3000
```

---

#  Environment Variables

Create `.env.local`

```
GOOGLE_AI_API_KEY=your_api_key
```

#  Vision

Ecozy showcases how AI can help businesses adopt sustainable commerce by automating product organization and enabling intelligent purchasing decisions.

The platform highlights the potential of AI to make sustainability workflows **efficient, scalable, and accessible**.

---

