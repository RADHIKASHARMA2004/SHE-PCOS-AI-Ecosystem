Write-Host "Starting SHE PCOS Ecosystem Deployment Script (Windows)..."

Write-Host "1. Training ML Models..."
Set-Location backend\ml
If (!(Test-Path venv)) { python -m venv venv }
.\venv\Scripts\Activate.ps1
pip install pandas numpy scikit-learn joblib
python engine.py
Set-Location ..\..

Write-Host "2. Installing Backend Dependencies..."
Set-Location backend
If (!(Test-Path venv)) { python -m venv venv }
.\venv\Scripts\Activate.ps1
pip install fastapi uvicorn sqlalchemy psycopg2 joblib numpy pandas scikit-learn python-multipart
Set-Location ..

Write-Host "3. Setting up Expo React Native Frontend..."
Set-Location frontend
If (!(Test-Path node_modules)) { npm install }

Write-Host "IMPORTANT: Please Ensure Docker Desktop is installed and running if you want to use PostgreSQL database."
Write-Host "If Docker is running, you can open a new terminal and type: docker-compose up -d --build"
Write-Host "- Backend is available via: cd backend; .\venv\Scripts\Activate.ps1; uvicorn main:app --reload"
Write-Host "- Frontend is available via: cd frontend; npx expo start -c"

Set-Location ..
Write-Host "Deployment preparation Complete. Follow manual start instructions to boot services."
