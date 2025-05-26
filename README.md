# Fullstack Gen AI PDF Context-Aware Chatbot

## Overview

This is a full-stack Gen AI application that functions as a PDF context-aware chatbot. Users can upload PDF documents and ask questions related to their content. The application leverages a Large Language Model (LLM) to provide relevant answers based on the PDF context.

## Setup

**For Backend:**

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```
3.  Activate the virtual environment:
    * **Windows:**
        ```bash
        venv\Scripts\activate
        ```
    * **Linux:**
        ```bash
        source venv/bin/activate
        ```
4.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Run the FastAPI application:
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```

**For Frontend:**

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install the npm dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## API Endpoints

**`/upload` (POST)**

* Receives files via a POST request.
* Extracts text content from the uploaded PDF using `pymupdf`.
* Divides the extracted text into smaller chunks.
* Generates vector embeddings for each chunk using Langchain.
* The text extraction and embedding processes are executed in separate threads to handle large files and CPU-intensive tasks efficiently.
* Stores file metadata (e.g., filename, upload timestamp) in a SQLite database.
* Saves the generated vector embeddings in the Fasis vector database.

**`/ask` (POST)**

* Retrieves relevant vector embeddings from the Fasis index based on the user's question.
* Receives the user's question via the POST request body.
* Combines the retrieved context (from the PDF) and the user's question.
* Sends this combined information to the LLM.
* Returns the LLM's response to the user.

## Tools and Frameworks

* **Frontend:**
    * [Vite](https://vitejs.dev/): A fast build tool and development server.
    * [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework.
    * [React](https://react.dev/): A JavaScript library for building user interfaces.
* **Backend:**
    * [FastAPI](https://fastapi.tiangolo.com/): A modern, high-performance web framework for building APIs with Python.
    * [PyMuPdf](https://pymupdf.readthedocs.io/en/latest/): A Python library for working with PDF and XPS documents.
    * [Langchain](https://www.langchain.com/): A framework for developing applications powered by language models.
* **Database:**
    * [Fasis](https://fasis.io/): A vector database for efficient similarity search.
    * [SQLite](https://www.sqlite.org/index.html): A lightweight, disk-based database for storing metadata.

## Demo Video


https://github.com/user-attachments/assets/c090c594-fff3-471e-add9-d4f1a92e94cd


