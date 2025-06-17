import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(os.getenv("DATABASE_URL"))

def save_pdf_metadata(filename, text):
    with conn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS pdfs (
                id SERIAL PRIMARY KEY,
                filename TEXT,
                content TEXT,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        cur.execute("INSERT INTO pdfs (filename, content) VALUES (%s, %s)", (filename, text))
        conn.commit()

def get_pdf_text(filename):
    with conn.cursor() as cur:
        cur.execute("SELECT content FROM pdfs WHERE filename=%s", (filename,))
        row = cur.fetchone()
        return row[0] if row else ""