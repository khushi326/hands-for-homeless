import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_supabase() -> Client:
    return supabase

def init_db():
    print(f"Connected to Supabase PostgreSQL at: {SUPABASE_URL}")
    try:
        res = supabase.table("profiles").select("id, email, role").execute()
        print(f"Verified Supabase connection! Total profiles in cloud DB: {len(res.data)}")
    except Exception as e:
        print(f"Supabase connection check warning: {e}")

if __name__ == '__main__':
    init_db()
