"""
Database migration script for Report model updates
Run this script to add new fields to existing reports table
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from extensions import db
from sqlalchemy import text

def migrate_reports():
    """Add new columns to reports table if they don't exist"""
    app = create_app()
    
    with app.app_context():
        try:
            # Check if columns exist and add them if they don't
            with db.engine.connect() as conn:
                # Get existing columns
                result = conn.execute(text("PRAGMA table_info(reports)"))
                existing_columns = [row[1] for row in result]
                
                # New columns to add
                new_columns = {
                    'report_number': 'TEXT',
                    'subcategory': 'TEXT',
                    'tags': 'TEXT',
                    'location': 'TEXT',
                    'incident_date': 'DATETIME',
                    'severity': 'TEXT DEFAULT "medium"',
                    'urgency': 'TEXT DEFAULT "normal"',
                    'file_attachments': 'TEXT',
                    'contact_phone': 'TEXT',
                    'preferred_contact_method': 'TEXT DEFAULT "email"',
                    'follow_up_requested': 'BOOLEAN DEFAULT 0',
                    'witnesses': 'TEXT',
                    'perpetrator_info': 'TEXT',
                    'anonymous_report': 'BOOLEAN DEFAULT 0',
                    'related_report_ids': 'TEXT',
                    'resolution_notes': 'TEXT',
                }
                
                # Add missing columns
                for column_name, column_type in new_columns.items():
                    if column_name not in existing_columns:
                        print(f"Adding column: {column_name}")
                        conn.execute(text(f"ALTER TABLE reports ADD COLUMN {column_name} {column_type}"))
                        conn.commit()
                    else:
                        print(f"Column {column_name} already exists")
                
                # Create index on report_number if it doesn't exist
                try:
                    conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS idx_reports_report_number ON reports(report_number)"))
                    conn.commit()
                    print("Index on report_number created/verified")
                except Exception as e:
                    print(f"Index creation note: {e}")
                
                print("\n✅ Migration completed successfully!")
                print("All new columns have been added to the reports table.")
                
        except Exception as e:
            print(f"\n❌ Migration failed: {str(e)}")
            import traceback
            traceback.print_exc()
            return False
    
    return True

if __name__ == '__main__':
    print("Starting database migration...")
    print("This will add new fields to the reports table.\n")
    migrate_reports()

