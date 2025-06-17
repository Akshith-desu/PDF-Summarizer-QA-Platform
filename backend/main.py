from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pdf_handler import save_and_extract_text
from qa_engine import get_answer
from database import save_pdf_metadata, get_pdf_text
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def validate_pdf_file(file: UploadFile):
    """Validate if the uploaded file is a PDF"""
    # Check file extension
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=400, 
            detail="Only PDF files are allowed. Please upload a file with .pdf extension."
        )
    
    # Check MIME type
    if file.content_type != 'application/pdf':
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Only PDF files are supported."
        )
    
    # Check file size (optional - limit to 50MB)
    if file.size and file.size > 50 * 1024 * 1024:  # 50MB limit
        raise HTTPException(
            status_code=400, 
            detail="File too large. Maximum file size is 50MB."
        )

@app.post("/upload_pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        # Validate the file first
        validate_pdf_file(file)
        
        # Process the file
        filename, extracted_text = await save_and_extract_text(file)
        save_pdf_metadata(filename, extracted_text)
        
        return {"message": "PDF uploaded and processed successfully.", "filename": filename}
    
    except HTTPException as e:
        # Re-raise HTTP exceptions (validation errors)
        raise e
    except Exception as e:
        # Handle any other errors during processing
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing PDF: {str(e)}"
        )

@app.post("/ask/")
async def ask_question(filename: str = Form(...), question: str = Form(...)):
    try:
        context = get_pdf_text(filename)
        if not context:
            raise HTTPException(
                status_code=404, 
                detail="PDF not found. Please upload the PDF first."
            )
        answer = get_answer(context, question)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing question: {str(e)}"
        )