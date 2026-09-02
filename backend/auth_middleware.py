import os
import jwt
from functools import wraps
from flask import request, jsonify, g

JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-jwt-key-hands-for-homeless-2026")

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401
            
        token = auth_header.split(" ")[1]
        
        try:
            # Verify token using local JWT secret
            decoded = jwt.decode(
                token, 
                JWT_SECRET, 
                algorithms=["HS256"]
            )
            
            # Store decoded token data in Flask global `g`
            g.user = decoded
            
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except Exception as e:
            return jsonify({"error": f"Invalid token: {str(e)}"}), 401
            
        return f(*args, **kwargs)
    return decorated
