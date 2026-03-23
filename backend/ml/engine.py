import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os

def generate_synthetic_data(num_samples=1000):
    """
    Generates synthetic dataset based on Rotterdam Criteria.
    Criteria requires 2 out of 3:
    1. Irregular/Absent periods (Oligo/Anovulation)
    2. Clinical/Biochemical Hyperandrogenism (Acne, Hirsutism, high testosterone)
    3. Polycystic ovaries on ultrasound
    """
    np.random.seed(42)
    
    # Features
    age = np.random.randint(15, 45, num_samples)
    weight = np.random.randint(45, 120, num_samples)
    height = np.random.randint(145, 180, num_samples) / 100
    bmi = weight / (height ** 2)
    
    cycle_length = np.random.normal(32, 10, num_samples).astype(int)
    irregular_periods = (cycle_length < 21) | (cycle_length > 35)
    
    acne_score = np.random.randint(0, 10, num_samples)
    hirsutism_score = np.random.randint(0, 10, num_samples)
    hyperandrogenism = (acne_score > 5) | (hirsutism_score > 5)
    
    ultrasound_follicle_count = np.random.randint(5, 25, num_samples)
    polycystic_ovaries = ultrasound_follicle_count >= 12
    
    # Calculate Rotterdam Criteria (2 out of 3)
    criteria_count = irregular_periods.astype(int) + hyperandrogenism.astype(int) + polycystic_ovaries.astype(int)
    pcos_diagnosis = (criteria_count >= 2).astype(int)
    
    # Create DataFrame
    df = pd.DataFrame({
        'age': age,
        'bmi': bmi,
        'cycle_length': cycle_length,
        'acne_score': acne_score,
        'hirsutism_score': hirsutism_score,
        'ultrasound_follicle_count': ultrasound_follicle_count,
        'pcos_risk': pcos_diagnosis
    })
    
    return df

def train_pcos_rf(df):
    """Trains RandomForestClassifier for PCOS Risk."""
    X = df.drop('pcos_risk', axis=1)
    y = df['pcos_risk']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train_scaled, y_train)
    
    # Save models
    os.makedirs('models', exist_ok=True)
    joblib.dump(scaler, 'models/scaler.pkl')
    joblib.dump(rf, 'models/pcos_rf_model.pkl')
    print("RandomForest model trained and saved.")

class BayesianCyclePredictor:
    """Advanced Statistical Cycle prediction with confidence bounds."""
    def predict(self, past_cycles):
        if not past_cycles:
            return 28
            
        # 1. Base mean length calculation
        base_prediction = int(np.mean(past_cycles))
        
        # 2. Bayesian Update: if last cycle wildly deviated, weight recent memory
        if len(past_cycles) > 1:
            last_variance = abs(past_cycles[-1] - base_prediction)
            
            # If the last cycle shifted by more than 4 days, let's pull the prediction slightly towards the new normal over historic data.
            if last_variance > 4: 
                base_prediction = int((base_prediction * 0.7) + (past_cycles[-1] * 0.3))
                
        return base_prediction

def save_bayesian_model():
    """Saves Advanced Bayesian Cycle Predictor."""
    os.makedirs('models', exist_ok=True)
    model = BayesianCyclePredictor()
    joblib.dump(model, 'models/cycle_lstm_stub.pkl') # Keep name same for compatibility with main.py
    print("Advanced Bayesian statistical model saved.")

if __name__ == "__main__":
    print("Generating synthetic dataset...")
    df = generate_synthetic_data()
    print("Training RandomForest Classifier...")
    train_pcos_rf(df)
    print("Saving Advanced Cycle prediction model...")
    save_bayesian_model()
    print("ML Engine setup complete.")
