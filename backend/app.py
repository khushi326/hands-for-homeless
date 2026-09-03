import os
import uuid
import datetime
import jwt
from flask import Flask, jsonify, g, request
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from auth_middleware import require_auth, JWT_SECRET
from db import supabase

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/', methods=['GET'])
def root():
    return jsonify({
        "name": "Hands For Homeless API",
        "status": "online",
        "version": "1.0.0",
        "database": "Supabase PostgreSQL (Mumbai Region)",
        "frontend": "https://hands-for-homeless.vercel.app"
    }), 200

# =======================================
# 0. Auth Endpoints
# =======================================

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json or {}
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name')
    phone_number = data.get('phone_number')
    role = data.get('role', 'citizen')

    if not email or not password or not full_name:
        return jsonify({"error": "Email, password, and full name are required"}), 400

    existing = supabase.table('profiles').select('id').eq('email', email).execute()
    if existing.data and len(existing.data) > 0:
        return jsonify({"error": "Email already exists"}), 400

    user_id = str(uuid.uuid4())
    hashed_pw = generate_password_hash(password)

    new_user = {
        "id": user_id,
        "email": email,
        "password_hash": hashed_pw,
        "full_name": full_name,
        "phone_number": phone_number,
        "role": role
    }
    
    res = supabase.table('profiles').insert(new_user).execute()
    if not res.data:
        return jsonify({"error": "Failed to register user"}), 500

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    res = supabase.table('profiles').select('*').eq('email', email).execute()
    if not res.data or len(res.data) == 0:
        return jsonify({"error": "Invalid email or password"}), 401

    user = res.data[0]
    if not check_password_hash(user.get('password_hash', ''), password):
        return jsonify({"error": "Invalid email or password"}), 401

    token_payload = {
        "sub": user['id'],
        "email": user['email'],
        "role": user['role'],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    
    token = jwt.encode(token_payload, JWT_SECRET, algorithm="HS256")
    
    user_copy = dict(user)
    if 'password_hash' in user_copy:
        del user_copy['password_hash']
    
    return jsonify({
        "access_token": token,
        "user": user_copy
    }), 200

@app.route('/api/profile', methods=['PUT'])
@require_auth
def update_profile():
    data = request.json or {}
    full_name = data.get('full_name')
    phone_number = data.get('phone_number')
    
    if not full_name:
        return jsonify({"error": "Full name is required"}), 400
        
    supabase.table('profiles').update({
        "full_name": full_name,
        "phone_number": phone_number,
        "updated_at": datetime.datetime.utcnow().isoformat()
    }).eq('id', g.user["sub"]).execute()
    
    return jsonify({"message": "Profile updated successfully"}), 200

# =======================================
# 1. Health Endpoints
# =======================================
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Hands For Homeless API (Supabase Cloud PostgreSQL) is running."}), 200

# =======================================
# 2. Report Case Endpoints
# =======================================

@app.route('/api/cases/all', methods=['GET'])
@require_auth
def get_all_cases_public():
    """Public endpoint for logged-in users"""
    res = supabase.table('cases').select('id, description, location_address, location_lat, location_lng, condition, photo_url, status, created_at').order('created_at', desc=True).execute()
    return jsonify(res.data or []), 200

@app.route('/api/cases', methods=['POST'])
@require_auth
def create_case():
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form
        
    description = data.get("description")
    location_address = data.get("location_address")
    condition = data.get("condition")
    
    photo_url = None
    if "photo" in request.files:
        photo_file = request.files["photo"]
        if photo_file.filename != '':
            from storage_service import upload_case_photo
            file_bytes = photo_file.read()
            photo_url = upload_case_photo(
                file_bytes=file_bytes,
                file_name=photo_file.filename,
                content_type=photo_file.mimetype
            )
    
    if not description or not location_address:
        return jsonify({"error": "Description and Location Address are required"}), 400
        
    case_id = str(uuid.uuid4())
    new_case = {
        "id": case_id,
        "reporter_id": g.user["sub"],
        "description": description,
        "location_address": location_address,
        "condition": condition,
        "photo_url": photo_url,
        "status": "pending"
    }
    
    supabase.table('cases').insert(new_case).execute()
    return jsonify({"id": case_id, "message": "Case created"}), 201

@app.route('/api/cases/my-cases', methods=['GET'])
@require_auth
def get_my_cases():
    res = supabase.table('cases').select('*').eq('reporter_id', g.user["sub"]).order('created_at', desc=True).execute()
    return jsonify(res.data or []), 200

# =======================================
# 3. Assistance Request Endpoints
# =======================================
@app.route('/api/assistance-requests', methods=['POST'])
@require_auth
def create_assistance_request():
    data = request.json or {}
    req_type = data.get("type")
    description = data.get("description")
    location_address = data.get("location_address")
    urgency = data.get("urgency", "medium")
    
    if not req_type or not description or not location_address:
        return jsonify({"error": "Missing required fields"}), 400
        
    req_id = str(uuid.uuid4())
    new_req = {
        "id": req_id,
        "user_id": g.user["sub"],
        "type": req_type,
        "description": description,
        "location_address": location_address,
        "urgency": urgency,
        "status": "pending"
    }
    
    supabase.table('assistance_requests').insert(new_req).execute()
    return jsonify({"id": req_id, "message": "Request created"}), 201

@app.route('/api/assistance-requests/my-requests', methods=['GET'])
@require_auth
def get_my_requests():
    res = supabase.table('assistance_requests').select('*').eq('user_id', g.user["sub"]).order('created_at', desc=True).execute()
    return jsonify(res.data or []), 200

# =======================================
# 4. Volunteer Endpoints
# =======================================
@app.route('/api/volunteer/available-cases', methods=['GET'])
@require_auth
def get_available_cases():
    res = supabase.table('cases').select('*').in_('status', ['pending', 'assigned']).order('created_at', desc=True).execute()
    return jsonify(res.data or []), 200

@app.route('/api/volunteer/accept-case', methods=['POST'])
@require_auth
def accept_case():
    case_id = request.json.get("case_id")
    assignment_id = str(uuid.uuid4())
    
    supabase.table('case_assignments').insert({
        "id": assignment_id,
        "case_id": case_id,
        "volunteer_id": g.user["sub"],
        "status": "accepted"
    }).execute()
    
    supabase.table('cases').update({"status": "assigned"}).eq("id", case_id).execute()
    return jsonify({"message": "Case accepted"}), 201

@app.route('/api/volunteer/my-assignments', methods=['GET'])
@require_auth
def get_my_assignments():
    # Fetch assignments for current volunteer
    res = supabase.table('case_assignments').select('*').eq('volunteer_id', g.user["sub"]).order('created_at', desc=True).execute()
    assignments = res.data or []
    
    result = []
    for a in assignments:
        item = dict(a)
        # Fetch related case
        case_res = supabase.table('cases').select('description, location_address, status').eq('id', a['case_id']).execute()
        if case_res.data and len(case_res.data) > 0:
            c = case_res.data[0]
            item["cases"] = {
                "description": c.get("description"),
                "location_address": c.get("location_address"),
                "status": c.get("status")
            }
        else:
            item["cases"] = {"description": "", "location_address": "", "status": ""}
        result.append(item)
        
    return jsonify(result), 200

@app.route('/api/volunteer/update-assignment/<assignment_id>', methods=['PUT'])
@require_auth
def update_assignment(assignment_id):
    new_status = request.json.get("status")
    supabase.table('case_assignments').update({"status": new_status}).eq("id", assignment_id).eq("volunteer_id", g.user["sub"]).execute()
    
    if new_status == "completed":
        assignment = supabase.table('case_assignments').select('case_id').eq('id', assignment_id).execute()
        if assignment.data and len(assignment.data) > 0:
            case_id = assignment.data[0]['case_id']
            supabase.table('cases').update({"status": "resolved"}).eq("id", case_id).execute()
            
    return jsonify({"message": "Updated"}), 200

# =======================================
# 5. Campaign & Donation Endpoints
# =======================================
@app.route('/api/campaigns', methods=['GET'])
def get_campaigns():
    res = supabase.table('campaigns').select('*').eq('status', 'active').order('created_at', desc=True).execute()
    return jsonify(res.data or []), 200

@app.route('/api/donations', methods=['POST'])
@require_auth
def create_donation():
    data = request.json or {}
    donation_id = str(uuid.uuid4())
    
    new_donation = {
        "id": donation_id,
        "donor_id": g.user["sub"],
        "donation_type": data.get("donation_type"),
        "amount": data.get("amount"),
        "item_name": data.get("item_name"),
        "campaign_id": data.get("campaign_id")
    }
    supabase.table('donations').insert(new_donation).execute()
    
    if data.get("donation_type") == "monetary" and data.get("amount") and data.get("campaign_id"):
        campaign_res = supabase.table('campaigns').select('current_amount').eq('id', data.get("campaign_id")).execute()
        if campaign_res.data and len(campaign_res.data) > 0:
            curr = campaign_res.data[0].get('current_amount') or 0
            new_curr = curr + float(data.get("amount"))
            supabase.table('campaigns').update({"current_amount": new_curr}).eq('id', data.get("campaign_id")).execute()
                  
    return jsonify({"message": "Donation recorded"}), 201

@app.route('/api/donations/my-donations', methods=['GET'])
@require_auth
def get_my_donations():
    res = supabase.table('donations').select('*').eq('donor_id', g.user["sub"]).order('created_at', desc=True).execute()
    return jsonify(res.data or []), 200

# =======================================
# 6. Admin Endpoints
# =======================================
def require_admin(f):
    from functools import wraps
    @wraps(f)
    @require_auth
    def decorated(*args, **kwargs):
        res = supabase.table('profiles').select('role').eq('id', g.user["sub"]).execute()
        if not res.data or res.data[0].get('role') != 'admin':
            return jsonify({"error": "Admin access required"}), 403
        return f(*args, **kwargs)
    return decorated

@app.route('/api/admin/requests', methods=['GET'])
@require_admin
def get_all_requests():
    res = supabase.table('assistance_requests').select('*').order('created_at', desc=True).execute()
    return jsonify(res.data or []), 200

@app.route('/api/admin/requests/<req_id>/status', methods=['PUT'])
@require_admin
def update_request_status(req_id):
    new_status = request.json.get("status")
    supabase.table('assistance_requests').update({"status": new_status}).eq("id", req_id).execute()
    return jsonify({"message": "Request status updated"}), 200

@app.route('/api/admin/stats', methods=['GET'])
@require_admin
def admin_stats():
    users_res = supabase.table('profiles').select('id', count='exact').execute()
    cases_res = supabase.table('cases').select('id', count='exact').execute()
    requests_res = supabase.table('assistance_requests').select('id', count='exact').execute()
    campaigns_res = supabase.table('campaigns').select('id', count='exact').eq('status', 'active').execute()
    donations_res = supabase.table('donations').select('*').execute()
    
    total_donations_amount = sum(d.get('amount') or 0 for d in (donations_res.data or []))
    total_donations_count = len(donations_res.data or [])
    
    return jsonify({
        "total_users": users_res.count if users_res.count is not None else len(users_res.data or []),
        "total_cases": cases_res.count if cases_res.count is not None else len(cases_res.data or []),
        "total_donations_amount": total_donations_amount,
        "total_donations_count": total_donations_count,
        "total_requests": requests_res.count if requests_res.count is not None else len(requests_res.data or []),
        "active_campaigns": campaigns_res.count if campaigns_res.count is not None else len(campaigns_res.data or []),
    }), 200

@app.route('/api/admin/users', methods=['GET'])
@require_admin
def admin_get_users():
    res = supabase.table('profiles').select('id, email, full_name, role, created_at').order('created_at', desc=True).execute()
    return jsonify(res.data or []), 200

@app.route('/api/admin/users/<user_id>/role', methods=['PUT'])
@require_admin
def admin_update_role(user_id):
    supabase.table('profiles').update({"role": request.json.get("role")}).eq("id", user_id).execute()
    return jsonify({"message": "Role updated"}), 200

@app.route('/api/admin/cases', methods=['GET'])
@require_admin
def admin_get_cases():
    res = supabase.table('cases').select('*').order('created_at', desc=True).execute()
    return jsonify(res.data or []), 200

@app.route('/api/admin/cases/<case_id>/status', methods=['PUT'])
@require_admin
def admin_update_case_status(case_id):
    supabase.table('cases').update({"status": request.json.get("status")}).eq("id", case_id).execute()
    return jsonify({"message": "Case updated"}), 200

@app.route('/api/admin/donations', methods=['GET'])
@require_admin
def admin_get_donations():
    res = supabase.table('donations').select('*').order('created_at', desc=True).execute()
    return jsonify(res.data or []), 200

@app.route('/api/admin/campaigns', methods=['POST'])
@require_admin
def admin_create_campaign():
    data = request.json or {}
    camp_id = str(uuid.uuid4())
    supabase.table('campaigns').insert({
        "id": camp_id,
        "title": data.get("title"),
        "description": data.get("description"),
        "target_amount": data.get("target_amount")
    }).execute()
    return jsonify({"message": "Campaign created"}), 201

@app.route('/api/admin/campaigns/<campaign_id>', methods=['PUT'])
@require_admin
def admin_update_campaign(campaign_id):
    supabase.table('campaigns').update({"status": request.json.get("status")}).eq("id", campaign_id).execute()
    return jsonify({"message": "Campaign updated"}), 200

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=os.getenv("FLASK_ENV") == "development")
