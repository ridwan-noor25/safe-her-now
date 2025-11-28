"""
Report routes
CRUD operations for harassment reports (auth required)
"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.utils import secure_filename
from datetime import datetime
import json
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from extensions import db
from models import Report, User

reports_bp = Blueprint('reports', __name__, url_prefix='/api/reports')

@reports_bp.route('', methods=['GET'])
@jwt_required()
def get_reports():
    """Get reports - own reports for users, all for moderators/admins"""
    try:
        current_user_id_str = get_jwt_identity()
        print(f"DEBUG get_reports: current_user_id = {current_user_id_str}")
        if not current_user_id_str:
            return jsonify({'error': 'Invalid token: user ID not found'}), 422
        
        # Convert string ID to integer for database query
        current_user_id = int(current_user_id_str)
        current_user = User.query.get(current_user_id)
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        claims = get_jwt()
        role = claims.get('role', 'user')
        
        # Check if requesting all reports (moderator/admin only)
        show_all = request.args.get('all', 'false').lower() == 'true'
        
        if show_all and role in ['moderator', 'admin']:
            reports = Report.query.order_by(Report.created_at.desc()).all()
        else:
            # Users see only their own reports
            reports = Report.query.filter_by(user_id=current_user_id).order_by(Report.created_at.desc()).all()
        
        return jsonify([report.to_dict() for report in reports]), 200
    except Exception as e:
        return jsonify({'error': f'Error fetching reports: {str(e)}'}), 500


@reports_bp.route('', methods=['POST'])
@jwt_required()
def create_report():
    """Create a new harassment report with all fields"""
    data = request.get_json()
    current_user_id = int(get_jwt_identity())
    
    # Validation
    if not data or not data.get('title') or not data.get('description') or not data.get('category'):
        return jsonify({'error': 'Missing required fields: title, description, category'}), 400
    
    # Parse incident date if provided
    incident_date = None
    if data.get('incident_date'):
        try:
            incident_date = datetime.fromisoformat(data['incident_date'].replace('Z', '+00:00'))
        except:
            pass
    
    # Create report with all fields
    report = Report(
        user_id=current_user_id,
        title=data['title'].strip(),
        description=data['description'].strip(),
        category=data['category'].strip(),
        subcategory=data.get('subcategory', '').strip() if data.get('subcategory') else None,
        tags=json.dumps(data.get('tags', [])) if data.get('tags') else None,
        location=data.get('location', '').strip() if data.get('location') else None,
        incident_date=incident_date,
        severity=data.get('severity', 'medium'),
        urgency=data.get('urgency', 'normal'),
        evidence=data.get('evidence', ''),
        file_attachments=json.dumps(data.get('file_attachments', [])) if data.get('file_attachments') else None,
        contact_phone=data.get('contact_phone', '').strip() if data.get('contact_phone') else None,
        preferred_contact_method=data.get('preferred_contact_method', 'email'),
        follow_up_requested=bool(data.get('follow_up_requested', False)),
        witnesses=data.get('witnesses', '').strip() if data.get('witnesses') else None,
        perpetrator_info=data.get('perpetrator_info', '').strip() if data.get('perpetrator_info') else None,
        anonymous_report=bool(data.get('anonymous_report', False)),
        related_report_ids=json.dumps(data.get('related_report_ids', [])) if data.get('related_report_ids') else None,
        status='pending'
    )
    
    try:
        db.session.add(report)
        db.session.flush()  # Flush to get the ID
        # Generate report number after ID is assigned
        if not report.report_number:
            date_str = datetime.utcnow().strftime('%Y%m%d')
            id_suffix = f"{report.id:04d}"
            report.report_number = f"REP-{date_str}-{id_suffix}"
        db.session.commit()
        return jsonify({
            'message': 'Report created successfully',
            'report': report.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create report: {str(e)}'}), 500


@reports_bp.route('/<int:report_id>', methods=['GET'])
@jwt_required()
def get_report(report_id):
    """Get a specific report (authorize view) with notes for users"""
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)
    claims = get_jwt()
    role = claims.get('role', 'user')
    
    report = Report.query.get_or_404(report_id)
    
    # Authorization: owner, moderator, or admin can view
    if report.user_id != current_user_id and role not in ['moderator', 'admin']:
        return jsonify({'error': 'Unauthorized to view this report'}), 403
    
    # Include notes for users to see moderator feedback
    include_notes = report.user_id == current_user_id or role in ['moderator', 'admin']
    return jsonify(report.to_dict(include_notes=include_notes)), 200


@reports_bp.route('/<int:report_id>', methods=['PUT'])
@jwt_required()
def update_report(report_id):
    """Update report (owner can update limited fields, moderator/admin can update status and resolution notes)"""
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)
    claims = get_jwt()
    role = claims.get('role', 'user')
    
    report = Report.query.get_or_404(report_id)
    data = request.get_json()
    
    # Authorization
    if report.user_id != current_user_id and role not in ['moderator', 'admin']:
        return jsonify({'error': 'Unauthorized to update this report'}), 403
    
    # Update fields based on role
    if report.user_id == current_user_id:
        # Users can update their own report's editable fields
        if 'title' in data:
            report.title = data['title'].strip()
        if 'description' in data:
            report.description = data['description'].strip()
        if 'category' in data:
            report.category = data['category'].strip()
        if 'subcategory' in data:
            report.subcategory = data['subcategory'].strip() if data['subcategory'] else None
        if 'tags' in data:
            report.tags = json.dumps(data['tags']) if data['tags'] else None
        if 'location' in data:
            report.location = data['location'].strip() if data.get('location') else None
        if 'incident_date' in data:
            if data['incident_date']:
                try:
                    report.incident_date = datetime.fromisoformat(data['incident_date'].replace('Z', '+00:00'))
                except:
                    pass
            else:
                report.incident_date = None
        if 'severity' in data:
            report.severity = data['severity']
        if 'urgency' in data:
            report.urgency = data['urgency']
        if 'evidence' in data:
            report.evidence = data['evidence']
        if 'file_attachments' in data:
            report.file_attachments = json.dumps(data['file_attachments']) if data['file_attachments'] else None
        if 'contact_phone' in data:
            report.contact_phone = data['contact_phone'].strip() if data.get('contact_phone') else None
        if 'preferred_contact_method' in data:
            report.preferred_contact_method = data['preferred_contact_method']
        if 'follow_up_requested' in data:
            report.follow_up_requested = bool(data['follow_up_requested'])
        if 'witnesses' in data:
            report.witnesses = data['witnesses'].strip() if data.get('witnesses') else None
        if 'perpetrator_info' in data:
            report.perpetrator_info = data['perpetrator_info'].strip() if data.get('perpetrator_info') else None
        if 'related_report_ids' in data:
            report.related_report_ids = json.dumps(data['related_report_ids']) if data['related_report_ids'] else None
    else:
        # Moderators/admins can update status and resolution notes
        if 'status' in data and data['status'] in ['pending', 'in_review', 'resolved', 'rejected']:
            report.status = data['status']
        if 'resolution_notes' in data:
            report.resolution_notes = data['resolution_notes'].strip() if data.get('resolution_notes') else None
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Report updated successfully',
            'report': report.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update report: {str(e)}'}), 500

