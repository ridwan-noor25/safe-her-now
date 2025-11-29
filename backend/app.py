"""
Flask application factory
Main entry point for the SafeHer backend API
"""
from flask import Flask, jsonify
from flask_cors import CORS
import os
import sys

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import Config
from extensions import db, jwt
from routes.auth import auth_bp
from routes.reports import reports_bp
from routes.moderator import moderator_bp
from routes.admin import admin_bp
from routes.uploads import uploads_bp

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS for frontend - allow all localhost ports for development
    # Using regex pattern to allow all local network IPs and localhost variants
    CORS(app, 
         origins=[
             'http://localhost:5173', 
             'http://localhost:3000', 
             'http://localhost:8080', 
             'http://127.0.0.1:8080',
             'http://192.168.142.246:8080',
             'http://192.168.142.246:5173'
         ],
         supports_credentials=True,
         allow_headers=['Content-Type', 'Authorization', 'Accept'],
         expose_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         max_age=3600)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # JWT Error Handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token has expired'}), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        error_msg = str(error)
        # Log the error for debugging
        import traceback
        print(f"JWT Invalid Token Error: {error_msg}")
        print(f"Error type: {type(error).__name__}")
        traceback.print_exc()
        return jsonify({'error': f'Invalid token. Please login again.', 'details': error_msg}), 422
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({'error': 'Authorization token is missing'}), 401
    
    @jwt.needs_fresh_token_loader
    def token_not_fresh_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token is not fresh'}), 401
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(moderator_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(uploads_bp)
    
    # Serve uploaded files
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        """Serve uploaded files"""
        from flask import send_from_directory
        upload_folder = os.path.join(os.path.dirname(__file__), Config.UPLOAD_FOLDER)
        return send_from_directory(upload_folder, filename)
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    @app.route('/api/health', methods=['GET'])
    def health():
        """Health check endpoint"""
        return {'status': 'ok', 'message': 'SafeHer API is running'}, 200
    
    @app.route('/api/debug/token', methods=['POST'])
    def debug_token():
        """Debug endpoint to test token creation (remove in production)"""
        from flask_jwt_extended import create_access_token
        from flask import request
        data = request.get_json()
        user_id = data.get('user_id', 1)
        role = data.get('role', 'user')
        token = create_access_token(identity=user_id, additional_claims={'role': role})
        return jsonify({
            'token': token,
            'secret_key_set': bool(app.config.get('JWT_SECRET_KEY')),
            'secret_key_length': len(app.config.get('JWT_SECRET_KEY', ''))
        }), 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)

