"""
Flask extensions initialization
Centralizes database and JWT setup for the application
"""
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

