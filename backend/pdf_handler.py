import fitz  # PyMuPDF
import os
from fastapi import HTTPException

async def save_and_extract_text(file):
    """Save uploaded file and extract text from PDF"""
    try:
        # Create uploads directory
        os.makedirs("uploads", exist_ok=True)
        filepath = f"uploads/{file.filename}"
        
        # Save the file
        content = await file.read()
        with open(filepath, "wb") as f:
            f.write(content)
        
        # Try to open and process the PDF
        try:
            doc = fitz.open(filepath)
        except Exception as e:
            # Clean up the saved file if it's not a valid PDF
            if os.path.exists(filepath):
                os.remove(filepath)
            raise HTTPException(
                status_code=400, 
                detail="Invalid PDF file. The file appears to be corrupted or is not a valid PDF."
            )
        
        # Extract text from all pages
        text = ""
        try:
            for page in doc:
                text += page.get_text()
            doc.close()
        except Exception as e:
            doc.close()
            # Clean up the saved file
            if os.path.exists(filepath):
                os.remove(filepath)
            raise HTTPException(
                status_code=400, 
                detail="Error reading PDF content. The PDF might be corrupted or password-protected."
            )
        
        # Check if any text was extracted
        if not text.strip():
            # Clean up the saved file
            if os.path.exists(filepath):
                os.remove(filepath)
            raise HTTPException(
                status_code=400, 
                detail="No text content found in the PDF. The PDF might be image-based or empty."
            )
        
        return file.filename, text
    
    except HTTPException as e:
        # Re-raise HTTP exceptions
        raise e
    except Exception as e:
        # Handle any other unexpected errors
        raise HTTPException(
            status_code=500, 
            detail=f"Unexpected error processing file: {str(e)}"
        )