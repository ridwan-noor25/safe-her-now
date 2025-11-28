"""
Admin routes
Admin-only endpoints for user management, stats, and exports
"""
from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import jwt_required, get_jwt
import csv
from io import StringIO
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from extensions import db
from models import User, Report

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def require_admin():
    """Helper to check if user is admin"""
    claims = get_jwt()
    role = claims.get('role', 'user')
    if role != 'admin':
        return False
    return True

@admin_bp.route('/users', methods=['GET', 'POST'])
@jwt_required()
def users():
    """Get all users or create a new user (admin only)"""
    if not require_admin():
        return jsonify({'error': 'Admin access required'}), 403
    
    if request.method == 'GET':
        users = User.query.order_by(User.created_at.desc()).all()
        return jsonify([user.to_dict() for user in users]), 200
    
    elif request.method == 'POST':
        # Create new user
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 400
        
        # Validate role
        role = data.get('role', 'user')
        if role not in ['user', 'moderator', 'admin']:
            return jsonify({'error': 'Invalid role. Must be user, moderator, or admin'}), 400
        
        # Create new user
        new_user = User(
            email=data['email'],
            full_name=data.get('full_name', ''),
            role=role,
            is_active=True
        )
        new_user.set_password(data['password'])
        
        try:
            db.session.add(new_user)
            db.session.commit()
            return jsonify({
                'message': f'{role.capitalize()} created successfully',
                'user': new_user.to_dict()
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Failed to create user: {str(e)}'}), 500


@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """Update user (admin only) - can only change is_active, not role"""
    if not require_admin():
        return jsonify({'error': 'Admin access required'}), 403
    
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    # Only allow updating is_active, not role
    if 'is_active' in data:
        user.is_active = bool(data['is_active'])
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'User updated successfully',
            'user': user.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update user: {str(e)}'}), 500


@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """Get system statistics (admin only)"""
    if not require_admin():
        return jsonify({'error': 'Admin access required'}), 403
    
    # Count reports by status
    stats = {
        'total_reports': Report.query.count(),
        'reports_by_status': {
            'pending': Report.query.filter_by(status='pending').count(),
            'in_review': Report.query.filter_by(status='in_review').count(),
            'resolved': Report.query.filter_by(status='resolved').count(),
            'rejected': Report.query.filter_by(status='rejected').count()
        },
        'total_users': User.query.count(),
        'users_by_role': {
            'user': User.query.filter_by(role='user').count(),
            'moderator': User.query.filter_by(role='moderator').count(),
            'admin': User.query.filter_by(role='admin').count()
        }
    }
    
    return jsonify(stats), 200


@admin_bp.route('/reports/export', methods=['GET'])
@jwt_required()
def export_reports():
    """Export all reports as CSV (admin only)"""
    if not require_admin():
        return jsonify({'error': 'Admin access required'}), 403
    
    reports = Report.query.order_by(Report.created_at.desc()).all()
    
    # Create CSV in memory
    output = StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        'ID', 'User Email', 'Title', 'Category', 'Status', 
        'Description', 'Evidence', 'Created At', 'Updated At'
    ])
    
    # Write data
    for report in reports:
        writer.writerow([
            report.id,
            report.user.email if report.user else 'N/A',
            report.title,
            report.category,
            report.status,
            report.description,
            report.evidence or '',
            report.created_at.isoformat(),
            report.updated_at.isoformat()
        ])
    
    # Create response
    output.seek(0)
    return Response(
        output.getvalue(),
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=safeher_reports_export.csv'}
    )

