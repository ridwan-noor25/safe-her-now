"""
Authentication routes
Handles user registration and login with JWT token generation
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from extensions import db
from models import User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user (default role: 'user')"""
    print(f"Register endpoint hit - Content-Type: {request.content_type}")
    print(f"Request data: {request.data}")
    
    data = request.get_json()
    print(f"Parsed JSON: {data}")
    
    # Validation
    if not data or not data.get('email') or not data.get('password') or not data.get('full_name'):
        return jsonify({'error': 'Missing required fields: email, password, full_name'}), 400
    
    email = data['email'].strip().lower()
    password = data['password']
    full_name = data['full_name'].strip()
    
    # Check if user exists
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    # Create user
    user = User(email=email, full_name=full_name, role='user')
    user.set_password(password)
    
    try:
        db.session.add(user)
        db.session.commit()
        
        # Generate token (identity must be a string)
        access_token = create_access_token(identity=str(user.id), additional_claims={'role': user.role})
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user and return JWT token"""
    print(f"Login endpoint hit - Content-Type: {request.content_type}")
    print(f"Request data: {request.data}")
    
    data = request.get_json()
    print(f"Parsed JSON: {data}")
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400
    
    email = data['email'].strip().lower()
    password = data['password']
    
    # Find user
    user = User.query.filter_by(email=email).first()
    
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    if not user.is_active:
        return jsonify({'error': 'Account is deactivated'}), 403
    
    # Generate token with role claim (identity must be a string)
    try:
        access_token = create_access_token(identity=str(user.id), additional_claims={'role': user.role})
        
        # Validate token was created
        if not access_token:
            return jsonify({'error': 'Failed to generate access token'}), 500
        
        return jsonify({
            'access_token': access_token,
            'role': user.role,
            'user': user.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'error': f'Token generation failed: {str(e)}'}), 500

