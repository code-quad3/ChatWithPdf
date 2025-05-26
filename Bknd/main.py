# Import necessary FastAPI and utility modules
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool

# Import database setup and models
from db.config import SessionLocal, engine
from db.models import Base, PDFDocument

# Import custom services for PDF text extraction and vector processing
from services.pdf_processor import extract_text_from_pdf
from services.vectore_process import process

# Import LLM interface (Groq)
from langchain_groq import ChatGroq

# Load environment variables
from dotenv import load_dotenv

# Enable CORS for frontend access
from fastapi.middleware.cors import CORSMiddleware

# LCEL (LangChain Expression Language) components for prompt and parsing
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# Initialize the database tables
Base.metadata.create_all(bind=engine)

# Define allowed CORS origins (usually frontend app URLs)
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1",
    "http://127.0.0.1:5173",
]

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Only allow requests from these origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Load environment variables from .env file
load_dotenv()

# Ensure the upload directory exists
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
print("Main script is executed here")

# Root endpoint (for sanity check)
@app.get("/")
async def read_root():
    return {"message": "Welcome to the PDF Uploader APIzzz!"}

# Global variable to hold FAISS index in memory
faiss_index = None

# Upload and process PDF endpoint
@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    global faiss_index
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    try:
        # Save the uploaded file temporarily
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        # Extract text from the PDF using a separate thread (non-blocking)
        text = await run_in_threadpool(extract_text_from_pdf, file_path)
        print("processing completed")

        # Remove the file after processing
        os.remove(file_path)

        # Generate FAISS index from extracted text
        faiss_index = await run_in_threadpool(process, text)

        # Save metadata into the relational database (if not already saved)
        db = SessionLocal()
        existing_doc = db.query(PDFDocument).filter(PDFDocument.filename == file.filename).first()

        if not existing_doc:
            # Add new document entry
            pdf_doc = PDFDocument(filename=file.filename)
            db.add(pdf_doc)
            db.commit()
            db.refresh(pdf_doc)
            print(f"Added database entry for: {file.filename}")
        else:
            print(f"Database entry already exists for: {file.filename}. Skipping DB addition.")

        db.close()

        return JSONResponse(
            content={"message": "PDF uploaded, processed, and stored in FAISS successfully "}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

# Request model for the /ask endpoint
class QuestionRequest(BaseModel):
    question: str

# Test endpoint for debugging
@app.get("/test")
async def test():
    print("This is new")
    return {"new": "value"}

# Ask a question against the uploaded PDF
@app.post("/ask")
async def ask_question(request: QuestionRequest):
    global faiss_index  # Use the FAISS index stored in memory
    question = request.question

    if faiss_index is None:
        raise HTTPException(
            status_code=404,
            detail="Knowledge base not loaded. Upload a PDF first.",
        )

    try:
        # Retrieve similar chunks from FAISS index
        docs = faiss_index.similarity_search(question)

        # Initialize Groq LLM with configuration
        llm = ChatGroq(
            model="llama3-8b-8192", temperature=0.5, max_tokens=1024
        )

        # Define prompt template
        template = """Answer the question based only on the following context:
              {context}

              Question: {question}
              """
        prompt = ChatPromptTemplate.from_template(template)

        # Define the QA chain using LangChain Expression Language
        chain = (
            {
                "context": RunnablePassthrough(),  # Feed context directly
                "question": RunnablePassthrough(),  # Feed question directly
            }
            | prompt              # Format into prompt
            | llm                 # Pass prompt to LLM
            | StrOutputParser()   # Parse the output to plain text
        )

        # Invoke the chain
        response = chain.invoke({"context": docs, "question": question})

        return {"answer": response}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to process question: {str(e)}"
        )



