"""
Moderator routes
Moderator-specific actions for reviewing and managing reports
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from extensions import db
from models import Report, ModeratorNote, User

moderator_bp = Blueprint('moderator', __name__, url_prefix='/api/moderator')

def require_moderator():
    """Helper to check if user is moderator or admin"""
    claims = get_jwt()
    role = claims.get('role', 'user')
    if role not in ['moderator', 'admin']:
        return False
    return True

@moderator_bp.route('/reports', methods=['GET'])
@jwt_required()
def get_moderator_queue():
    """Get reports queue for moderators (pending and in_review) with full details"""
    if not require_moderator():
        return jsonify({'error': 'Moderator or admin access required'}), 403
    
    # Filter by status
    status_filter = request.args.get('status', 'all')
    
    query = Report.query
    
    if status_filter != 'all':
        query = query.filter_by(status=status_filter)
    else:
        # Default: show pending and in_review
        query = query.filter(Report.status.in_(['pending', 'in_review']))
    
    reports = query.order_by(Report.created_at.desc()).all()
    
    return jsonify([report.to_dict(include_notes=True) for report in reports]), 200


@moderator_bp.route('/reports/<int:report_id>', methods=['GET'])
@jwt_required()
def get_report_details(report_id):
    """Get full report details with all notes for moderators"""
    if not require_moderator():
        return jsonify({'error': 'Moderator or admin access required'}), 403
    
    report = Report.query.get_or_404(report_id)
    return jsonify(report.to_dict(include_notes=True)), 200


@moderator_bp.route('/reports/reviewed', methods=['GET'])
@jwt_required()
def get_reviewed_reports():
    """Get reports reviewed by the current moderator"""
    if not require_moderator():
        return jsonify({'error': 'Moderator or admin access required'}), 403
    
    current_user_id = int(get_jwt_identity())
    
    # Get reports where this moderator has added notes
    reports_with_notes = db.session.query(Report).join(ModeratorNote).filter(
        ModeratorNote.moderator_id == current_user_id
    ).distinct().all()
    
    # Filter by status if provided
    status_filter = request.args.get('status', 'all')
    if status_filter != 'all':
        reports_with_notes = [r for r in reports_with_notes if r.status == status_filter]
    
    # Sort by most recently updated
    reports_with_notes.sort(key=lambda x: x.updated_at, reverse=True)
    
    return jsonify([report.to_dict(include_notes=True) for report in reports_with_notes]), 200


@moderator_bp.route('/reports/<int:report_id>/note', methods=['POST'])
@jwt_required()
def add_note(report_id):
    """Add a note to a report and optionally update status"""
    if not require_moderator():
        return jsonify({'error': 'Moderator or admin access required'}), 403
    
    report = Report.query.get_or_404(report_id)
    data = request.get_json()
    
    if not data or not data.get('note'):
        return jsonify({'error': 'Note text is required'}), 400
    
    current_user_id = int(get_jwt_identity())
    
    # Create note
    note = ModeratorNote(
        report_id=report_id,
        moderator_id=current_user_id,
        note=data['note'].strip()
    )
    
    # Update status if provided
    if 'status' in data and data['status'] in ['pending', 'in_review', 'resolved', 'rejected']:
        report.status = data['status']
    
    try:
        db.session.add(note)
        db.session.commit()
        
        return jsonify({
            'message': 'Note added successfully',
            'note': note.to_dict(),
            'report': report.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to add note: {str(e)}'}), 500

