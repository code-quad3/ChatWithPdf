from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Define the database URL; here, we are using a local SQLite database file
DATABASE_URL = "sqlite:///./file_meta_data.db"

# Create the SQLAlchemy engine
# The `check_same_thread=False` is specific to SQLite and allows the connection to be used across threads
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create a configured "Session" class
# autocommit=False: changes must be explicitly committed
# autoflush=False: avoids automatic flushing to the database before each query
# bind=engine: binds the session to our engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declaring ORM models (used with declarative syntax)
Base = declarative_base()
