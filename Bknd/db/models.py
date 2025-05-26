from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from db.config import Base  # Base class from your SQLAlchemy configuration for model declarations

# Define the model for storing uploaded PDF document metadata
class PDFDocument(Base):

    # Set the table name in the database
    __tablename__ = "pdf_documents"

    # Primary key column (auto-incremented integer ID)
    id = Column(Integer, primary_key=True, index=True)

    # Column to store the filename (must be unique to avoid duplicate entries)
    filename = Column(String, unique=True)

    # Column to store the timestamp of when the PDF was uploaded
    # Uses UTC timezone and sets the default to the current datetime
    upload_date = Column(DateTime, default=datetime.now(timezone.utc))



