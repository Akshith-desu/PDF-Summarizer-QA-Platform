from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pdf_handler import save_and_extract_text
from qa_engine import get_answer
from database import save_pdf_metadata, get_pdf_text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload_pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    filename, extracted_text = await save_and_extract_text(file)
    save_pdf_metadata(filename, extracted_text)
    return {"message": "PDF uploaded and processed.", "filename": filename}

@app.post("/ask/")
async def ask_question(filename: str = Form(...), question: str = Form(...)):
    context = get_pdf_text(filename)
    answer = get_answer(context, question)
    return {"answer": answer}