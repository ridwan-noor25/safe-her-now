set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  SafeHer Backend Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Check Python version
echo -e "${YELLOW}[1/8] Checking Python version...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is not installed. Please install Python 3.10 or higher.${NC}"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d'.' -f1)
PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d'.' -f2)

if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 10 ]); then
    echo -e "${RED}Error: Python 3.10 or higher is required. Found: Python $PYTHON_VERSION${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Python $PYTHON_VERSION found${NC}"
echo ""

# Step 2: Create virtual environment
echo -e "${YELLOW}[2/8] Creating virtual environment...${NC}"
if [ -d "venv" ]; then
    echo -e "${YELLOW}Virtual environment already exists. Skipping creation.${NC}"
    echo -e "${YELLOW}To recreate, delete the 'venv' directory and run this script again.${NC}"
else
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
fi
echo ""

# Step 3: Activate virtual environment and upgrade pip
echo -e "${YELLOW}[3/8] Activating virtual environment and upgrading pip...${NC}"
source venv/bin/activate
pip install --upgrade pip --quiet
echo -e "${GREEN}✓ Virtual environment activated${NC}"
echo ""

# Step 4: Install dependencies
echo -e "${YELLOW}[4/8] Installing dependencies...${NC}"
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt --quiet
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}Error: requirements.txt not found${NC}"
    exit 1
fi
echo ""

# Step 5: Create .env file if it doesn't exist
echo -e "${YELLOW}[5/8] Setting up environment variables...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cat > .env << EOF
# SafeHer Backend Configuration
# DO NOT COMMIT THIS FILE TO VERSION CONTROL

# Database
DATABASE_URL=sqlite:///safeher.db

# JWT Configuration
JWT_SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")

# Flask Secret Key
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")

# File Upload Configuration
UPLOAD_FOLDER=uploads
MAX_FILE_SIZE=10485760
EOF
    echo -e "${GREEN}✓ .env file created with secure random keys${NC}"
else
    echo -e "${YELLOW}.env file already exists. Skipping creation.${NC}"
fi
echo ""

# Step 6: Create uploads directory
echo -e "${YELLOW}[6/8] Creating uploads directory...${NC}"
if [ ! -d "uploads" ]; then
    mkdir -p uploads
    echo -e "${GREEN}✓ Uploads directory created${NC}"
else
    echo -e "${YELLOW}Uploads directory already exists.${NC}"
fi
echo ""

# Step 7: Initialize database
echo -e "${YELLOW}[7/8] Initializing database...${NC}"
python3 -c "
from app import create_app
from extensions import db
import sys

app = create_app()
with app.app_context():
    try:
        db.create_all()
        print('✓ Database tables created successfully')
    except Exception as e:
        print(f'Error creating database: {e}')
        sys.exit(1)
" || {
    echo -e "${RED}Error: Failed to create database tables${NC}"
    exit 1
}
echo ""

# Step 8: Run migration if needed
echo -e "${YELLOW}[8/8] Running database migrations...${NC}"
if [ -f "migrate_reports.py" ]; then
    python3 migrate_reports.py || {
        echo -e "${YELLOW}Migration script encountered issues (this may be normal if tables are already up to date)${NC}"
    }
    echo -e "${GREEN}✓ Migrations completed${NC}"
else
    echo -e "${YELLOW}Migration script not found. Skipping.${NC}"
fi
echo ""

# Step 9: Seed admin user
echo -e "${YELLOW}[9/9] Seeding admin user...${NC}"
python3 seed_admin.py || {
    echo -e "${YELLOW}Admin user may already exist. This is normal if you've run setup before.${NC}"
}
echo ""

# Final summary
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}✓ Backend is ready to run!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo -e "1. ${BLUE}Start the backend server:${NC}"
echo -e "   ${GREEN}source venv/bin/activate${NC}"
echo -e "   ${GREEN}python app.py${NC}"
echo ""
echo -e "2. ${BLUE}Or use Flask CLI:${NC}"
echo -e "   ${GREEN}source venv/bin/activate${NC}"
echo -e "   ${GREEN}export FLASK_APP=app.py${NC}"
echo -e "   ${GREEN}flask run${NC}"
echo ""
echo -e "3. ${BLUE}The API will be available at:${NC}"
echo -e "   ${GREEN}http://localhost:5000${NC}"
echo ""
echo -e "4. ${BLUE}Admin credentials:${NC}"
echo -e "   ${GREEN}Email: admin@savegirls.com${NC}"
echo -e "   ${GREEN}Password: ridwa12345${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Change the admin password after first login!${NC}"
echo ""
echo -e "${BLUE}========================================${NC}"

