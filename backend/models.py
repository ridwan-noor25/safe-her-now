"""
SQLAlchemy database models
Defines User, Report, and ModeratorNote models with relationships
"""
from datetime import datetime
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    """User model with role-based access control"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user')  # 'user', 'moderator', 'admin'
    full_name = db.Column(db.String(100), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    reports = db.relationship('Report', backref='user', lazy=True, cascade='all, delete-orphan')
    moderator_notes = db.relationship('ModeratorNote', backref='moderator', lazy=True, foreign_keys='ModeratorNote.moderator_id')
    
    def set_password(self, password):
        """Hash and store password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verify password against hash"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Serialize user to dictionary (exclude password)"""
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'full_name': self.full_name,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat()
        }
    
    def __repr__(self):
        return f'<User {self.email}>'


class Report(db.Model):
    """Harassment report model with comprehensive fields"""
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    report_number = db.Column(db.String(20), unique=True, nullable=True, index=True)  # Auto-generated: REP-YYYYMMDD-XXXX
    
    # Basic Information
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)  # e.g., 'online', 'physical', 'workplace'
    subcategory = db.Column(db.String(50), nullable=True)  # More specific category
    tags = db.Column(db.Text)  # JSON array of tags
    
    # Incident Details
    location = db.Column(db.String(200), nullable=True)  # Where the incident occurred
    incident_date = db.Column(db.DateTime, nullable=True)  # When the incident happened
    severity = db.Column(db.String(20), default='medium', nullable=False)  # 'low', 'medium', 'high', 'critical'
    urgency = db.Column(db.String(20), default='normal', nullable=False)  # 'immediate', 'urgent', 'normal', 'low'
    
    # Evidence & Files
    evidence = db.Column(db.Text)  # Text evidence (URLs, notes)
    file_attachments = db.Column(db.Text)  # JSON array of file metadata: [{"name": "...", "type": "...", "url": "...", "size": ...}]
    
    # Contact & Follow-up
    contact_phone = db.Column(db.String(20), nullable=True)
    preferred_contact_method = db.Column(db.String(20), default='email', nullable=False)  # 'email', 'phone', 'sms'
    follow_up_requested = db.Column(db.Boolean, default=False, nullable=False)
    
    # Additional Information
    witnesses = db.Column(db.Text, nullable=True)  # Witness information
    perpetrator_info = db.Column(db.Text, nullable=True)  # Perpetrator information if known
    anonymous_report = db.Column(db.Boolean, default=False, nullable=False)  # Hide reporter identity
    
    # Related Reports
    related_report_ids = db.Column(db.Text)  # JSON array of related report IDs
    
    # Status & Resolution
    status = db.Column(db.String(20), default='pending', nullable=False)  # 'pending', 'in_review', 'resolved', 'rejected'
    resolution_notes = db.Column(db.Text, nullable=True)  # Notes visible to reporter when resolved
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    notes = db.relationship('ModeratorNote', backref='report', lazy=True, cascade='all, delete-orphan')
    
    def generate_report_number(self):
        """Generate unique report number: REP-YYYYMMDD-XXXX"""
        if not self.report_number:
            date_str = datetime.utcnow().strftime('%Y%m%d')
            # Use last 4 digits of ID, or random if not saved yet
            id_suffix = f"{self.id:04d}" if self.id else "0000"
            self.report_number = f"REP-{date_str}-{id_suffix}"
        return self.report_number
    
    def to_dict(self, include_notes=False):
        """Serialize report to dictionary"""
        import json
        result = {
            'id': self.id,
            'user_id': self.user_id,
            'report_number': self.report_number or self.generate_report_number(),
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'subcategory': self.subcategory,
            'tags': json.loads(self.tags) if self.tags else [],
            'location': self.location,
            'incident_date': self.incident_date.isoformat() if self.incident_date else None,
            'severity': self.severity,
            'urgency': self.urgency,
            'evidence': self.evidence,
            'file_attachments': json.loads(self.file_attachments) if self.file_attachments else [],
            'contact_phone': self.contact_phone,
            'preferred_contact_method': self.preferred_contact_method,
            'follow_up_requested': self.follow_up_requested,
            'witnesses': self.witnesses,
            'perpetrator_info': self.perpetrator_info,
            'anonymous_report': self.anonymous_report,
            'related_report_ids': json.loads(self.related_report_ids) if self.related_report_ids else [],
            'status': self.status,
            'resolution_notes': self.resolution_notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'user': self.user.to_dict() if self.user and not self.anonymous_report else {'id': None, 'email': 'Anonymous', 'full_name': 'Anonymous'} if self.anonymous_report else (self.user.to_dict() if self.user else None)
        }
        
        if include_notes:
            result['notes'] = [note.to_dict() for note in self.notes]
        
        return result
    
    def __repr__(self):
        return f'<Report {self.id}: {self.title}>'


class ModeratorNote(db.Model):
    """Notes added by moderators on reports"""
    __tablename__ = 'moderator_notes'
    
    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey('reports.id'), nullable=False, index=True)
    moderator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    note = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        """Serialize note to dictionary"""
        return {
            'id': self.id,
            'report_id': self.report_id,
            'moderator_id': self.moderator_id,
            'note': self.note,
            'created_at': self.created_at.isoformat(),
            'moderator': self.moderator.to_dict() if self.moderator else None
        }
    
    def __repr__(self):
        return f'<ModeratorNote {self.id} on Report {self.report_id}>'

