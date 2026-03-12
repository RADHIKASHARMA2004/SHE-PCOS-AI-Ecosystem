from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import joblib
import os
import numpy as np

# Try to import models relative to the local backend structure
from models import Base, User, Cycle, Meal, MedicalReport

app = FastAPI(title="SHE PCOS Ecosystem MVP")

# Database Setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./she_pcos.db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Mock ML Models loading (from ml/models/)
try:
    rf_model = joblib.load('ml/models/pcos_rf_model.pkl')
    scaler = joblib.load('ml/models/scaler.pkl')
    lstm_stub = joblib.load('ml/models/cycle_lstm_stub.pkl')
except:
    rf_model = None
    scaler = None
    lstm_stub = None

# --- AUTH ENDPOINTS ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@app.post("/auth/signup")
def signup(user: dict, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user['username']).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    bmi = user.get('weight', 0) / ((user.get('height', 1)/100) ** 2) if user.get('height') else 0

    new_user = User(
        username=user['username'],
        email=user.get('email', f"{user['username']}@example.com"),
        hashed_password=user['password'], # In MVP, just store raw or simple hash
        role=user.get('role', 'user'),
        age=user.get('age', 25),
        weight=user.get('weight', 60),
        height=user.get('height', 160),
        bmi=bmi
    )
    db.add(new_user)
    db.commit()
    return {"msg": "User created successfully"}

@app.post("/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or user.hashed_password != form_data.password:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    return {"access_token": user.username, "token_type": "bearer", "role": user.role}

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == token).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

# --- CYCLE ENDPOINTS ---
@app.post("/cycle/log")
def log_cycle(cycle_data: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_cycle = Cycle(
        user_id=current_user.id,
        start_date=datetime.strptime(cycle_data['start_date'], '%Y-%m-%d').date(),
        end_date=datetime.strptime(cycle_data['end_date'], '%Y-%m-%d').date() if cycle_data.get('end_date') else None,
        flow_intensity=cycle_data.get('flow_intensity', 'medium'),
        pain_level=cycle_data.get('pain_level', 5)
    )
    db.add(new_cycle)
    db.commit()
    return {"msg": "Cycle logged"}

@app.get("/cycle/predict")
def predict_cycle(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cycles = db.query(Cycle).filter(Cycle.user_id == current_user.id).all()
    if len(cycles) < 2:
        return {"msg": "Not enough data", "next_period": None}
    
    # Simple logic to convert dates to lengths
    past_lengths = [(cycles[i].start_date - cycles[i-1].start_date).days for i in range(1, len(cycles))]
    
    if lstm_stub:
        predicted_length = lstm_stub.predict(past_lengths)
    else:
        predicted_length = int(np.mean(past_lengths)) if past_lengths else 28

    last_cycle = cycles[-1].start_date
    next_period = last_cycle + timedelta(days=predicted_length)
    ovulation = next_period - timedelta(days=14)
    
    return {
        "predicted_length": predicted_length,
        "next_period": next_period.isoformat(),
        "ovulation_window": ovulation.isoformat()
    }

# --- AI ENDPOINTS ---
@app.post("/ai/predict-risk")
def predict_risk(features: dict, current_user: User = Depends(get_current_user)):
    """Predicts PCOS risk using the trained RandomForest model."""
    if not rf_model or not scaler:
        return {"error": "Model not loaded. Please train first."}
    
    try:
        # Assuming order: age, bmi, cycle_length, acne_score, hirsutism_score, ultrasound_follicle_count
        data_arr = np.array([[
            features.get('age', current_user.age),
            features.get('bmi', current_user.bmi),
            features.get('cycle_length', 32),
            features.get('acne_score', 0),
            features.get('hirsutism_score', 0),
            features.get('ultrasound_follicle_count', 5)
        ]])
        scaled_data = scaler.transform(data_arr)
        risk = rf_model.predict(scaled_data)[0]
        prob = rf_model.predict_proba(scaled_data)[0][1]
        
        return {
            "pcos_risk_binary": int(risk),
            "pcos_risk_probability": float(prob),
            "hormone_health_score": int((1 - prob) * 100)
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/ai/scan-acne")
def scan_acne(image_data: dict, current_user: User = Depends(get_current_user)):
    """Mock MediaPipe stub for detecting acne."""
    # In a real app, 'image_data' would be processed by MediaPipe
    mock_acne_score = np.random.randint(0, 10)
    return {"msg": "Scan complete", "acne_severity_score": mock_acne_score}

@app.post("/ai/chat")
def chat_coach(message: dict, current_user: User = Depends(get_current_user)):
    """Mock RAG-based health coach utilizing hard-coded Indian/Ayurvedic logic."""
    q = message.get("text", "").lower()
    reply = "I'm your PCOS coach. How can I help?"
    if "period" in q or "cramps" in q:
        reply = "Try sipping on warm Methi (Fenugreek) water in the morning. Practice Anulom Vilom for 10 minutes to ease cramps."
    elif "diet" in q or "food" in q:
        reply = "A PCOS-friendly Indian diet includes Ragi, Jowar, plenty of green leafy vegetables (Palak), and avoiding processed sugars."
    elif "workout" in q or "exercise" in q:
        reply = "Include strength training and Yoga. Kapalbhati pranayama is highly recommended for PCOS management."
    
    return {"reply": reply}

# --- NUTRITION ENDPOINTS ---
@app.post("/nutrition/log")
def log_meal(meal: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_meal = Meal(
        user_id=current_user.id,
        date=datetime.now().date(),
        food_item=meal['item'],
        calories=meal.get('calories', 150),
        macros=str(meal.get('macros', {'p': 10, 'c': 20, 'f': 5}))
    )
    db.add(new_meal)
    db.commit()
    return {"msg": "Meal logged"}

@app.get("/nutrition/suggestions")
def meal_suggestions():
    return {
        "breakfast": ["Poha with peanuts", "Moong Dal Chilla", "Ragi Dosa"],
        "lunch": ["Bajra Roti with Palak Paneer", "Brown Rice and Rajma"],
        "dinner": ["Light Khichdi", "Grilled Paneer Salad"],
        "snack": ["Roasted Makhana", "Methi Water"]
    }

# --- MEDICAL ENDPOINTS ---
@app.post("/medical/upload")
def upload_report(report: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_report = MedicalReport(
        user_id=current_user.id,
        report_type=report['type'],
        value=report['value'],
        notes=report.get('notes', '')
    )
    db.add(new_report)
    db.commit()
    return {"msg": "Report uploaded"}

@app.get("/medical/history")
def get_medical_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reports = db.query(MedicalReport).filter(MedicalReport.user_id == current_user.id).all()
    return reports

# --- ADMIN ENDPOINTS ---
@app.get("/admin/dashboard")
def admin_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    total_users = db.query(User).count()
    return {"total_users": total_users, "system_health": "Good"}

@app.post("/admin/retrain")
def admin_retrain(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    # Stub for retraining pipeline trigger
    return {"msg": "Retraining job queued on backend/ml/engine.py script"}
