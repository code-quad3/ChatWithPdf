import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain.docstore.document import Document

# Initialize HuggingFace embeddings using the "all-MiniLM-L6-v2" model.
# This model converts text into numerical vectors (embeddings) for semantic similarity.
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Define a function to process input text and return a FAISS vector store
def process(text: str) -> FAISS:
    # Split the input text into chunks using a recursive character-based splitter
    # Each chunk is 500 characters long with 50 characters of overlap
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_text(text)  # Returns a list of text chunks

    # Convert each chunk into a Document object (required by LangChain)
    docs = [Document(page_content=chunk) for chunk in chunks]

    # Create a FAISS vector store from the document embeddings
    # FAISS enables fast similarity search over these vectors
    vector_store = FAISS.from_documents(docs, embedding_model)

    # Return the populated FAISS vector store
    return vector_store
