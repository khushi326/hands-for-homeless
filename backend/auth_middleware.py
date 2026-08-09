import os
import jwt
from functools import wraps
from flask import request, jsonify, g

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)
        if not auth_header:
            return jsonify({"error": "Authorization header is missing"}), 401
        
        parts = auth_header.split()
        if parts[0].lower() != "bearer" or len(parts) != 2:
            return jsonify({"error": "Authorization header must be in the format 'Bearer <token>'"}), 401
        
        token = parts[1]
        jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
        flask_env = os.getenv("FLASK_ENV", "production")
        
        try:
            # If JWT secret is not configured in development, decode without verification for testing ease.
            if not jwt_secret and flask_env == "development":
                payload = jwt.decode(token, options={"verify_signature": False})
            else:
                if not jwt_secret:
                    return jsonify({"error": "Supabase JWT Secret is not configured in backend environment"}), 500
                
                # Verify HS256 JWT signature using Supabase secret
                payload = jwt.decode(token, jwt_secret, algorithms=["HS256"])
            
            # Store the token claims (user id, email, role, metadata) in Flask's request-scoped global context
            g.user = payload
            
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid authentication token"}), 401
        except Exception as e:
            return jsonify({"error": f"Token verification failed: {str(e)}"}), 401
            
        return f(*args, **kwargs)
    return decorated
