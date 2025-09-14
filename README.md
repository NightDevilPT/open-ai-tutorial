# OpenAI SDK Tutorial ( with Langchain)

A **TypeScript project** demonstrating how to interact with the **Groq API** using OpenAI’s client library.
It includes three main scripts:

* **Basic API interaction**
* **Interactive chat bot**
* **Tool-enhanced chat bot** (with email and mock weather tools)

---

## Prerequisites

* **Node.js**: v18 or higher
* **TypeScript**: For compiling the source code
* **Environment Variables**:

  * `GROQ_API_KEY`: API key for Groq authentication
  * `EMAIL_USER`: Email address (used in tool-chat)
  * `EMAIL_PASS`: Email password or app-specific password (used in tool-chat)

---

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:NightDevilPT/open-ai-tutorial.git
   cd open-ai-tutorial
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   GROQ_API_KEY=your_groq_api_key
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```

---

## Project Structure

* `src/basics/index.ts` → Basic Groq API example (saves response to JSON)
* `src/chat-bot/index.ts` → Interactive CLI chat bot with conversation history
* `src/tool-chat/index.ts` → Chat bot extended with **email** and **mock weather** tools

---

## Running the Project

1. **Compile TypeScript**:

   ```bash
   npm run tsc
   ```

2. **Run Examples**:

   * Basic API interaction:

     ```bash
     npm run dev:basic
     ```
   * Interactive chat bot:

     ```bash
     npm run dev:chatbot
     ```
   * Tool-enhanced chat bot:

     ```bash
     npm run dev:tool-chatbot
     ```

---

## Available Scripts

* `dev:basic` → Run the basic Groq API demo
* `dev:chatbot` → Run the interactive chat bot
* `dev:tool-chatbot` → Run the tool-enhanced chat bot
* `test` → Placeholder (not implemented yet)

---

## Dependencies

* [`openai`](https://www.npmjs.com/package/openai) → Groq API interactions
* [`dotenv`](https://www.npmjs.com/package/dotenv) → Load environment variables
* [`nodemailer`](https://www.npmjs.com/package/nodemailer) → Send emails (tool-chat)
* [`prompt-sync`](https://www.npmjs.com/package/prompt-sync) → CLI input handling


