import os
from flask import Flask, jsonify, g
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client
from auth_middleware import require_auth
load_dotenv()

app = Flask(__name__)
# Enable CORS for frontend requests
CORS(app, resources={r"/api/*": {"origins": "*"}})

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

supabase: Client = None
if supabase_url and supabase_key:
    try:
        supabase = create_client(supabase_url, supabase_key)
        print("Supabase client initialized successfully.")
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")
else:
    print("Warning: Supabase credentials are not fully set in the environment.")

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "Hands For Homeless API is running.",
        "supabase_connected": supabase is not None
    }), 200

@app.route('/api/protected-health', methods=['GET'])
@require_auth
def protected_health_check():
    return jsonify({
        "status": "healthy",
        "message": "Access granted to secure endpoint.",
        "user_claims": g.user
    }), 200

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=os.getenv("FLASK_ENV") == "development")
