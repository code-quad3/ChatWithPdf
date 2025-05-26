import fitz  # PyMuPDF, used to work with PDF files


def extract_text_from_pdf(file_path: str) -> str:
    # Open the PDF file using fitz (PyMuPDF)
    doc = fitz.open(file_path)

    # Initialize an empty string to hold the extracted text
    text = ""

    # Iterate through each page in the PDF document
    for page in doc:
        # Extract text from the current page and append it to the text variable
        text += page.get_text()

    # Close the document to free resources
    doc.close()

    # Return the combined extracted text from all pages
    return text
