import os
import uuid

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def upload_case_photo(file_bytes: bytes, file_name: str, content_type: str) -> str:
    """
    Uploads file bytes locally to static/uploads directory
    and returns the public URL path.
    """
    ext = os.path.splitext(file_name)[1]
    if not ext:
        if 'png' in content_type:
            ext = '.png'
        elif 'gif' in content_type:
            ext = '.gif'
        else:
            ext = '.jpg'
            
    unique_name = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_FOLDER, unique_name)
    
    try:
        with open(file_path, 'wb') as f:
            f.write(file_bytes)
        
        # In a real app this would point to the domain, for local testing just return path
        # Assuming frontend runs on different port or same, Next.js can serve it from backend URL
        public_url = f"http://localhost:5001/static/uploads/{unique_name}"
        return public_url
    except Exception as e:
        print(f"Failed to upload photo locally: {e}")
        raise e
