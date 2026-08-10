import os
from flask import Flask, jsonify, g, request
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client
from auth_middleware import require_auth
from storage_service import upload_case_photo

# Load environment variables
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

# 1. Report Case Endpoints
@app.route('/api/cases', methods=['POST'])
@require_auth
def create_case():
    if not supabase:
        return jsonify({"error": "Supabase client not initialized"}), 500
        
    try:
        description = request.form.get("description")
        location_address = request.form.get("location_address")
        location_lat = request.form.get("location_lat")
        location_lng = request.form.get("location_lng")
        condition = request.form.get("condition")
        
        if not description or not location_address:
            return jsonify({"error": "Description and Location Address are required fields"}), 400
            
        photo_url = None
        if "photo" in request.files:
            photo_file = request.files["photo"]
            if photo_file.filename != '':
                file_bytes = photo_file.read()
                photo_url = upload_case_photo(
                    file_bytes=file_bytes,
                    file_name=photo_file.filename,
                    content_type=photo_file.mimetype
                )
                
        # Insert record
        case_data = {
            "reporter_id": g.user["sub"],
            "description": description,
            "location_address": location_address,
            "location_lat": float(location_lat) if location_lat else None,
            "location_lng": float(location_lng) if location_lng else None,
            "condition": condition or None,
            "photo_url": photo_url,
            "status": "pending"
        }
        
        res = supabase.table("cases").insert(case_data).execute()
        
        if len(res.data) == 0:
            return jsonify({"error": "Failed to create case in database"}), 550
            
        return jsonify(res.data[0]), 201
        
    except Exception as e:
        print(f"Error creating case: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/cases/my-cases', methods=['GET'])
@require_auth
def get_my_cases():
    if not supabase:
        return jsonify({"error": "Supabase client not initialized"}), 500
        
    try:
        res = supabase.table("cases") \
            .select("*") \
            .eq("reporter_id", g.user["sub"]) \
            .order("created_at", desc=True) \
            .execute()
        return jsonify(res.data), 200
    except Exception as e:
        print(f"Error fetching cases: {e}")
        return jsonify({"error": str(e)}), 500

# 2. Assistance Request Endpoints
@app.route('/api/assistance-requests', methods=['POST'])
@require_auth
def create_assistance_request():
    if not supabase:
        return jsonify({"error": "Supabase client not initialized"}), 500
        
    try:
        data = request.json
        req_type = data.get("type")
        description = data.get("description")
        location_address = data.get("location_address")
        urgency = data.get("urgency", "medium")
        
        if not req_type or not description or not location_address:
            return jsonify({"error": "Type, Description, and Location Address are required fields"}), 400
            
        request_data = {
            "user_id": g.user["sub"],
            "type": req_type,
            "description": description,
            "location_address": location_address,
            "urgency": urgency,
            "status": "pending"
        }
        
        res = supabase.table("assistance_requests").insert(request_data).execute()
        
        if len(res.data) == 0:
            return jsonify({"error": "Failed to create request in database"}), 500
            
        return jsonify(res.data[0]), 201
        
    except Exception as e:
        print(f"Error creating request: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/assistance-requests/my-requests', methods=['GET'])
@require_auth
def get_my_requests():
    if not supabase:
        return jsonify({"error": "Supabase client not initialized"}), 500
        
    try:
        res = supabase.table("assistance_requests") \
            .select("*") \
            .eq("user_id", g.user["sub"]) \
            .order("created_at", desc=True) \
            .execute()
        return jsonify(res.data), 200
    except Exception as e:
        print(f"Error fetching requests: {e}")
        return jsonify({"error": str(e)}), 500

# 3. Donations Endpoints
@app.route('/api/donations/my-donations', methods=['GET'])
@require_auth
def get_my_donations():
    if not supabase:
        return jsonify({"error": "Supabase client not initialized"}), 500
        
    try:
        res = supabase.table("donations") \
            .select("*") \
            .eq("donor_id", g.user["sub"]) \
            .order("created_at", desc=True) \
            .execute()
        return jsonify(res.data), 200
    except Exception as e:
        print(f"Error fetching donations: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=os.getenv("FLASK_ENV") == "development")
