Persona Chat AI

Welcome to Persona Chat AI! This is a full-stack web application that allows you to have conversations with an AI assistant adopting the personality and stylistic voice of various public figures. Built with a modern tech stack, this project leverages the power of Large Language Models to create an engaging and dynamic chat experience.
✨ Features

    Persona Switching: Seamlessly switch between different AI personas (e.g., Hitesh Choudhary, Piyush Garg) from a simple dropdown menu.

    Context-Aware Conversations: The AI remembers the last 10 messages, allowing for relevant and coherent follow-up questions.

    Persistent Chat History: Your conversation with each persona is saved in your browser's local storage, so you can pick up where you left off even after reloading the page.

    Real-time Responses: A clean, intuitive chat interface with a typing indicator shows you when the AI is generating a response.

    Responsive Design: The application is fully responsive and works beautifully on desktop, tablet, and mobile devices.

🛠️ Tech Stack

    Frontend:

        Vite: A next-generation frontend tooling for a blazing-fast development experience.

        React: A JavaScript library for building user interfaces.

        Tailwind CSS: A utility-first CSS framework for rapid UI development.

    Backend:

        Node.js: A JavaScript runtime built on Chrome's V8 engine.

        Express.js: A minimal and flexible Node.js web application framework.

        OpenAI API: Used for generating the AI's conversational responses.

        Zod: A TypeScript-first schema declaration and validation library.

🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.
Prerequisites

Make sure you have the following software installed:

    Node.js: Version 18.x or higher. You can download it from nodejs.org.

    npm: Node Package Manager, which comes bundled with Node.js.

Installation & Setup

1. Clone the Repository

First, clone this repository to your local machine.

git clone https://github.com/your-username/persona-chat-ai.git
cd persona-chat-ai

2. Set Up the Backend

Navigate to the backend directory and install the required dependencies.

cd backend
npm install

Next, create a .env file in the backend directory. This file will store your secret API key and other environment variables.

touch .env

Open the .env file and add the following variables. Do not share this file or your API key with anyone.

# Get your API key from the OpenAI Platform
OPENAI_API_KEY="sk-your-secret-openai-api-key"

# The model you want to use (e.g., gpt-4o-mini, gpt-3.5-turbo)
OPENAI_MODEL="gpt-4o-mini"

# The port your backend server will run on
PORT=8080

3. Set Up the Frontend

In a new terminal, navigate to the frontend directory and install its dependencies.

cd frontend
npm install

The frontend is already configured to connect to the backend at http://localhost:8080. If you changed the PORT in the backend's .env file, make sure to update the API_URL constant in frontend/src/App.jsx.

4. Install Root Dependencies

To run both servers with a single command, we need a small utility. Go back to the root directory of the project and run start

cd ..
npm run start

▶️ Running the Application

Once you have completed the setup, you can start both the frontend and backend servers together with a single command from the root directory. The provided package.json in the root folder is already configured for this.

npm run start

This command will:

    Start the backend server (typically at http://localhost:8080).

    Start the frontend Vite development server (typically at http://localhost:5173).

Your default web browser should automatically open to the frontend URL. If not, you can navigate to it manually. You are now ready to start chatting!
📁 Project Structure

The project is organized into two main folders:

/
├── backend/         # Contains the Node.js + Express server
│   ├── node_modules/
│   ├── .env         # Your secret keys and config (create this yourself)
│   ├── index.js     # The main server file
│   └── package.json
│
├── frontend/        # Contains the Vite + React client application
│   ├── src/
│   │   └── App.jsx  # Main application component
│   └── package.json
│
└── package.json     # For running both servers concurrently

