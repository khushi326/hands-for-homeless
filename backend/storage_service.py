import os
import uuid
from supabase import create_client, Client

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

def get_supabase_client() -> Client:
    if not supabase_url or not supabase_key:
        raise ValueError("Supabase credentials are missing from environment.")
    return create_client(supabase_url, supabase_key)

def upload_case_photo(file_bytes: bytes, file_name: str, content_type: str) -> str:
    """
    Uploads file bytes to Supabase Storage bucket 'case-photos'
    and returns the public URL of the uploaded image.
    """
    client = get_supabase_client()
    bucket_id = "case-photos"
    
    # Generate a unique path to avoid collisions
    ext = os.path.splitext(file_name)[1]
    if not ext:
        # Fallback based on content type
        if 'png' in content_type:
            ext = '.png'
        elif 'gif' in content_type:
            ext = '.gif'
        else:
            ext = '.jpg'
            
    unique_name = f"{uuid.uuid4()}{ext}"
    
    try:
        # Upload using Supabase storage client
        client.storage.from_(bucket_id).upload(
            path=unique_name,
            file=file_bytes,
            file_options={"content-type": content_type}
        )
        
        # Retrieve the public url
        public_url = client.storage.from_(bucket_id).get_public_url(unique_name)
        return public_url
    except Exception as e:
        print(f"Failed to upload photo to Supabase storage: {e}")
        raise e
