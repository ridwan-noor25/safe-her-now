"""
File upload routes
Handles file uploads for report evidence
"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os
import sys
from datetime import datetime
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import Config

uploads_bp = Blueprint('uploads', __name__, url_prefix='/api/uploads')

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

@uploads_bp.route('', methods=['POST'])
@jwt_required()
def upload_file():
    """Upload a file and return metadata"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({
            'error': f'File type not allowed. Allowed types: {", ".join(Config.ALLOWED_EXTENSIONS)}'
        }), 400
    
    # Check file size
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    
    if file_size > Config.MAX_FILE_SIZE:
        return jsonify({
            'error': f'File too large. Maximum size: {Config.MAX_FILE_SIZE / (1024 * 1024):.1f}MB'
        }), 400
    
    try:
        # Create upload directory if it doesn't exist
        upload_folder = os.path.join(os.path.dirname(os.path.dirname(__file__)), Config.UPLOAD_FOLDER)
        os.makedirs(upload_folder, exist_ok=True)
        
        # Generate secure filename
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        original_filename = secure_filename(file.filename)
        filename = f"{timestamp}_{original_filename}"
        filepath = os.path.join(upload_folder, filename)
        
        # Save file
        file.save(filepath)
        
        # Return file metadata
        return jsonify({
            'message': 'File uploaded successfully',
            'file': {
                'name': original_filename,
                'type': file.content_type or 'application/octet-stream',
                'url': f'/uploads/{filename}',
                'size': file_size,
                'uploaded_at': datetime.utcnow().isoformat()
            }
        }), 201
    
    except Exception as e:
        return jsonify({'error': f'Failed to upload file: {str(e)}'}), 500

