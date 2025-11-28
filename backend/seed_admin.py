"""
Seed script to create initial admin user
Run this after setting up the database: python seed_admin.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from werkzeug.security import generate_password_hash
from app import create_app
from extensions import db
from models import User

# Admin credentials (as specified)
ADMIN_EMAIL = 'admin@savegirls.com'
ADMIN_PASSWORD = 'ridwa12345'
ADMIN_NAME = 'System Administrator'

def seed_admin():
    """Create admin user if it doesn't exist"""
    app = create_app()
    
    with app.app_context():
        # Check if admin already exists
        existing_admin = User.query.filter_by(email=ADMIN_EMAIL).first()
        
        if existing_admin:
            print(f"Admin user '{ADMIN_EMAIL}' already exists.")
            print("Skipping seed. If you need to reset, delete the user from the database first.")
            return
        
        # Create admin user
        admin = User(
            email=ADMIN_EMAIL,
            full_name=ADMIN_NAME,
            role='admin',
            is_active=True
        )
        admin.set_password(ADMIN_PASSWORD)
        
        try:
            db.session.add(admin)
            db.session.commit()
            print("=" * 60)
            print("Admin user created successfully!")
            print("=" * 60)
            print(f"Email: {ADMIN_EMAIL}")
            print(f"Password: {ADMIN_PASSWORD}")
            print("=" * 60)
            print("\nYou can now login using:")
            print(f"\ncurl -X POST http://localhost:5000/api/auth/login \\")
            print(f"  -H 'Content-Type: application/json' \\")
            print(f"  -d '{{\"email\":\"{ADMIN_EMAIL}\",\"password\":\"{ADMIN_PASSWORD}\"}}'")
            print("\nOr use the frontend login page.")
            print("=" * 60)
            print("\n⚠️  IMPORTANT: Change the admin password after first login!")
            print("=" * 60)
        except Exception as e:
            db.session.rollback()
            print(f"Error creating admin user: {str(e)}")
            sys.exit(1)

if __name__ == '__main__':
    seed_admin()

