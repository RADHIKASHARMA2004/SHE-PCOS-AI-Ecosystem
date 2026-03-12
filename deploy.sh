#!/bin/bash
set -e

echo "Starting SHE PCOS Ecosystem Deployment Script..."

echo "1. Training ML Models..."
cd backend/ml
python -m venv venv || true
source venv/bin/activate || true
pip install pandas numpy scikit-learn joblib || true
python engine.py
cd ../..

echo "2. Installing Backend Dependencies..."
cd backend
python -m venv venv || true
source venv/bin/activate || true
pip install fastapi uvicorn sqlalchemy psycopg2-binary joblib numpy pandas scikit-learn python-multipart
cd ..

echo "3. Starting Docker Containers (Database + Backend API)..."
docker-compose up -d --build

echo "4. Setting up Expo React Native Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
# NativeWind setup is presumed applied in package.json
echo "Launching Expo..."
npx expo start -c

echo "Deployment Complete."
