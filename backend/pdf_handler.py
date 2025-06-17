import fitz  # PyMuPDF
import os

async def save_and_extract_text(file):
    os.makedirs("uploads", exist_ok=True)
    filepath = f"uploads/{file.filename}"
    with open(filepath, "wb") as f:
        f.write(await file.read())

    doc = fitz.open(filepath)
    text = ""
    for page in doc:
        text += page.get_text()
    return file.filename, text