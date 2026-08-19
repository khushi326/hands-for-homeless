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

# =======================================
# 4. Volunteer Endpoints
# =======================================

@app.route('/api/volunteer/available-cases', methods=['GET'])
@require_auth
def get_available_cases():
    if not supabase:
        return jsonify({"error": "Supabase client not initialized"}), 500
    try:
        res = supabase.table("cases") \
            .select("*") \
            .in_("status", ["pending", "assigned"]) \
            .order("created_at", desc=True) \
            .execute()
        return jsonify(res.data), 200
    except Exception as e:
        print(f"Error fetching available cases: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/volunteer/accept-case', methods=['POST'])
@require_auth
def accept_case():
    if not supabase:
        return jsonify({"error": "Supabase client not initialized"}), 500
    try:
        data = request.json
        case_id = data.get("case_id")
        if not case_id:
            return jsonify({"error": "case_id is required"}), 400

        assignment_data = {
            "case_id": case_id,
            "volunteer_id": g.user["sub"],
            "status": "accepted"
        }
        res = supabase.table("case_assignments").insert(assignment_data).execute()

        # Update case status to assigned
        supabase.table("cases").update({"status": "assigned"}).eq("id", case_id).execute()

        if len(res.data) == 0:
            return jsonify({"error": "Failed to create assignment"}), 500
        return jsonify(res.data[0]), 201
    except Exception as e:
        print(f"Error accepting case: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/volunteer/my-assignments', methods=['GET'])
@require_auth
def get_my_assignments():
    if not supabase:
        return jsonify({"error": "Supabase client not initialized"}), 500
    try:
        res = supabase.table("case_assignments") \
            .select("*, cases(*)") \
            .eq("volunteer_id", g.user["sub"]) \
            .order("created_at", desc=True) \
            .execute()
        return jsonify(res.data), 200
    except Exception as e:
        print(f"Error fetching assignments: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/volunteer/update-assignment/<assignment_id>', methods=['PUT'])
@require_auth
def update_assignment(assignment_id):
    if not supabase:
        return jsonify({"error": "Supabase client not initialized"}), 500
    try:
        data = request.json
        new_status = data.get("status")
        notes = data.get("notes", "")

        if new_status not in ["accepted", "in_progress", "completed", "cancelled"]:
            return jsonify({"error": "Invalid status value"}), 400

        update_data = {"status": new_status}
        if notes:
            update_data["notes"] = notes

        res = supabase.table("case_assignments") \
            .update(update_data) \
            .eq("id", assignment_id) \
            .eq("volunteer_id", g.user["sub"]) \
            .execute()

        # If completed, also update the case status
        if new_status == "completed":
            assignment = supabase.table("case_assignments") \
                .select("case_id") \
                .eq("id", assignment_id) \
                .execute()
            if assignment.data:
                supabase.table("cases") \
                    .update({"status": "resolved"}) \
                    .eq("id", assignment.data[0]["case_id"]) \
                    .execute()

        return jsonify({"message": "Assignment updated", "data": res.data}), 200
    except Exception as e:
        print(f"Error updating assignment: {e}")
        return jsonify({"error": str(e)}), 500

# =======================================
# 5. Campaign & Donation Endpoints
# =======================================

@app.route('/api/campaigns', methods=['GET'])
def get_campaigns():
    if not supabase:
        return jsonify({"error": "Supabase client not initialized"}), 500
    try:
        res = supabase.table("campaigns") \
            .select("*") \
            .eq("status", "active") \
            .order("created_at", desc=True) \
            .execute()
        return jsonify(res.data), 200
    except Exception as e:
        print(f"Error fetching campaigns: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/donations', methods=['POST'])
@require_auth
def create_donation():
    if not supabase:
        return jsonify({"error": "Supabase client not initialized"}), 500
    try:
        data = request.json
        donation_type = data.get("donation_type")

        if donation_type not in ["monetary", "item"]:
            return jsonify({"error": "donation_type must be 'monetary' or 'item'"}), 400

        donation_data = {
            "donor_id": g.user["sub"],
            "donation_type": donation_type,
            "status": "pending"
        }

        if donation_type == "monetary":
            amount = data.get("amount")
            if not amount:
                return jsonify({"error": "amount is required for monetary donations"}), 400
            donation_data["amount"] = float(amount)
            campaign_id = data.get("campaign_id")
            if campaign_id:
                donation_data["campaign_id"] = campaign_id
        else:
            item_name = data.get("item_name")
            if not item_name:
                return jsonify({"error": "item_name is required for item donations"}), 400
            donation_data["item_name"] = item_name
            donation_data["item_category"] = data.get("item_category", "other")
            donation_data["item_quantity"] = int(data.get("item_quantity", 1))
            donation_data["pickup_address"] = data.get("pickup_address")

        res = supabase.table("donations").insert(donation_data).execute()

        if len(res.data) == 0:
            return jsonify({"error": "Failed to create donation"}), 500
        return jsonify(res.data[0]), 201
    except Exception as e:
        print(f"Error creating donation: {e}")
        return jsonify({"error": str(e)}), 500

# =======================================
# 6. Admin Endpoints
# =======================================

def require_admin(f):
    """Decorator that checks if user has admin role in profiles table."""
    from functools import wraps
    @wraps(f)
    @require_auth
    def decorated(*args, **kwargs):
        if not supabase:
            return jsonify({"error": "Supabase client not initialized"}), 500
        try:
            profile = supabase.table("profiles") \
                .select("role") \
                .eq("id", g.user["sub"]) \
                .execute()
            if not profile.data or profile.data[0].get("role") != "admin":
                return jsonify({"error": "Admin access required"}), 403
        except Exception as e:
            return jsonify({"error": f"Auth check failed: {str(e)}"}), 500
        return f(*args, **kwargs)
    return decorated

@app.route('/api/admin/stats', methods=['GET'])
@require_admin
def admin_stats():
    try:
        users = supabase.table("profiles").select("id", count="exact").execute()
        cases = supabase.table("cases").select("id", count="exact").execute()
        donations = supabase.table("donations").select("amount").execute()
        requests = supabase.table("assistance_requests").select("id", count="exact").execute()
        campaigns = supabase.table("campaigns").select("id", count="exact").eq("status", "active").execute()

        total_donated = sum(float(d.get("amount", 0) or 0) for d in donations.data)

        return jsonify({
            "total_users": users.count or 0,
            "total_cases": cases.count or 0,
            "total_donations_amount": total_donated,
            "total_donations_count": len(donations.data),
            "total_requests": requests.count or 0,
            "active_campaigns": campaigns.count or 0,
        }), 200
    except Exception as e:
        print(f"Error fetching admin stats: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/users', methods=['GET'])
@require_admin
def admin_get_users():
    try:
        res = supabase.table("profiles") \
            .select("*") \
            .order("created_at", desc=True) \
            .execute()
        return jsonify(res.data), 200
    except Exception as e:
        print(f"Error fetching users: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/users/<user_id>/role', methods=['PUT'])
@require_admin
def admin_update_role(user_id):
    try:
        data = request.json
        new_role = data.get("role")
        if new_role not in ["citizen", "volunteer", "ngo", "admin"]:
            return jsonify({"error": "Invalid role"}), 400

        res = supabase.table("profiles") \
            .update({"role": new_role}) \
            .eq("id", user_id) \
            .execute()
        return jsonify({"message": "Role updated", "data": res.data}), 200
    except Exception as e:
        print(f"Error updating role: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/cases', methods=['GET'])
@require_admin
def admin_get_cases():
    try:
        res = supabase.table("cases") \
            .select("*") \
            .order("created_at", desc=True) \
            .execute()
        return jsonify(res.data), 200
    except Exception as e:
        print(f"Error fetching all cases: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/cases/<case_id>/status', methods=['PUT'])
@require_admin
def admin_update_case_status(case_id):
    try:
        data = request.json
        new_status = data.get("status")
        if new_status not in ["pending", "assigned", "in_progress", "resolved", "closed"]:
            return jsonify({"error": "Invalid status"}), 400

        res = supabase.table("cases") \
            .update({"status": new_status}) \
            .eq("id", case_id) \
            .execute()
        return jsonify({"message": "Case status updated", "data": res.data}), 200
    except Exception as e:
        print(f"Error updating case status: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/donations', methods=['GET'])
@require_admin
def admin_get_donations():
    try:
        res = supabase.table("donations") \
            .select("*") \
            .order("created_at", desc=True) \
            .execute()
        return jsonify(res.data), 200
    except Exception as e:
        print(f"Error fetching all donations: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/campaigns', methods=['POST'])
@require_admin
def admin_create_campaign():
    try:
        data = request.json
        title = data.get("title")
        description = data.get("description", "")
        target_amount = data.get("target_amount")

        if not title or not target_amount:
            return jsonify({"error": "Title and target_amount are required"}), 400

        campaign_data = {
            "title": title,
            "description": description,
            "target_amount": float(target_amount),
            "current_amount": 0,
            "status": "active"
        }
        res = supabase.table("campaigns").insert(campaign_data).execute()

        if len(res.data) == 0:
            return jsonify({"error": "Failed to create campaign"}), 500
        return jsonify(res.data[0]), 201
    except Exception as e:
        print(f"Error creating campaign: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/campaigns/<campaign_id>', methods=['PUT'])
@require_admin
def admin_update_campaign(campaign_id):
    try:
        data = request.json
        update_data = {}
        if "title" in data:
            update_data["title"] = data["title"]
        if "description" in data:
            update_data["description"] = data["description"]
        if "target_amount" in data:
            update_data["target_amount"] = float(data["target_amount"])
        if "status" in data:
            update_data["status"] = data["status"]

        if not update_data:
            return jsonify({"error": "No fields to update"}), 400

        res = supabase.table("campaigns") \
            .update(update_data) \
            .eq("id", campaign_id) \
            .execute()
        return jsonify({"message": "Campaign updated", "data": res.data}), 200
    except Exception as e:
        print(f"Error updating campaign: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=os.getenv("FLASK_ENV") == "development")

