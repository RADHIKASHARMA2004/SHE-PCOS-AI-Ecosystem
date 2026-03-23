from sqlalchemy import Column, Integer, String, Float, Boolean, Date, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user") # "user" or "admin"
    age = Column(Integer)
    weight = Column(Float)
    height = Column(Float)
    bmi = Column(Float)
    pregnancy_mode = Column(Boolean, default=False)
    birth_control = Column(String, default="None")
    
    # Advanced Onboarding Profiling
    country = Column(String, default="Unknown")
    intent = Column(String, default="Track Period") 
    cycle_regularity = Column(String, default="Unknown")
    lifestyle_habits = Column(String) # JSON string: sleep, stress
    
    # 12-Step Flo Architecture Expansions
    health_conditions = Column(String) # JSON or Comma Sep
    symptom_baseline = Column(String) # JSON or Comma Sep
    sexual_activity = Column(String, default="Unknown")
    sleep_hours = Column(Float, default=7.0)
    activity_level = Column(String, default="Sedentary")
    
    # Dietary Prefs
    diet_type = Column(String, default="Omnivore")
    allergies = Column(String, default="[]")
    primary_goal = Column(String, default="Hormone Balance")
    health_concerns = Column(String, default="[]") # JSON list of strings e.g. ["bloating", "acne"]
    avoidances = Column(String, default="[]") # JSON list of strings e.g. ["brinjal", "rajma"]

    cycles = relationship("Cycle", back_populates="user")
    meal_logs = relationship("MealLog", back_populates="user")
    nutrition_targets = relationship("DailyNutritionTarget", back_populates="user")
    reports = relationship("MedicalReport", back_populates="user")

class Cycle(Base):
    __tablename__ = "cycles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    start_date = Column(Date)
    end_date = Column(Date)
    flow_intensity = Column(String) # light, medium, heavy
    pain_level = Column(Integer) # 1-10
    
    # Advanced PCOS Tracking
    bbt = Column(Float) # Basal Body Temp (2 decimal places)
    cervical_mucus = Column(String) # dry, sticky, creamy, egg_white
    symptoms = Column(String) # JSON string: cramps, bloating, mood
    clots = Column(Boolean, default=False)
    spotting = Column(Boolean, default=False)
    lh_test_result = Column(String) # positive, negative
    acne_scale = Column(Integer) # 1-10
    hair_loss_scale = Column(Integer) # 1-10
    insulin_symptoms = Column(String) # JSON string: cravings, crashes
    
    user = relationship("User", back_populates="cycles")

class FoodItem(Base):
    __tablename__ = "food_items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    calories_per_100g = Column(Float)
    protein = Column(Float)
    carbs = Column(Float)
    fats = Column(Float)
    
    iron = Column(Float, default=0.0)
    calcium = Column(Float, default=0.0)
    vitamin_d3 = Column(Float, default=0.0)
    b12 = Column(Float, default=0.0)
    zinc = Column(Float, default=0.0)
    
    gi_index = Column(Float)
    is_dairy_free = Column(Boolean, default=False)
    is_gluten_free = Column(Boolean, default=False)
    
    tags = Column(String) # comma-separated like 'pcos_friendly,iron_rich'
    meal_type = Column(String) # Breakfast, Lunch, Snack, Dinner

class MealLog(Base):
    __tablename__ = "meal_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    food_item_id = Column(Integer, ForeignKey("food_items.id"))
    meal_type = Column(String) # Breakfast, Lunch, Snack, Dinner
    portion_size_grams = Column(Float)
    logged_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="meal_logs")
    food_item = relationship("FoodItem")

class DailyNutritionTarget(Base):
    __tablename__ = "daily_nutrition_targets"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date)
    target_calories = Column(Float)
    target_protein = Column(Float)
    target_carbs = Column(Float)
    target_fats = Column(Float)
    
    user = relationship("User", back_populates="nutrition_targets")

class MedicalReport(Base):
    __tablename__ = "medical_reports"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    upload_date = Column(DateTime, default=datetime.datetime.utcnow)
    report_type = Column(String)   # e.g., "hormone", "metabolic", "vitamin"
    value = Column(Float)          # legacy single-value field
    notes = Column(String)         # raw OCR text or user notes

    # ── Structured lab values ──────────────────────────────────────────────
    # Hormone panel
    lh           = Column(Float)   # LH (mIU/mL)
    fsh          = Column(Float)   # FSH (mIU/mL)
    lh_fsh_ratio = Column(Float)   # Computed: LH / FSH
    prolactin    = Column(Float)   # Prolactin (ng/mL)
    testosterone = Column(Float)   # Total Testosterone (ng/dL)
    amh          = Column(Float)   # Anti-Mullerian Hormone (ng/mL)

    # Metabolic panel
    fasting_insulin = Column(Float)   # μIU/mL
    fasting_glucose = Column(Float)   # mg/dL
    homa_ir         = Column(Float)   # Computed: (Insulin × Glucose) / 405

    # Vitamins & minerals
    vitamin_d3 = Column(Float)   # ng/mL
    b12        = Column(Float)   # pg/mL
    ferritin   = Column(Float)   # ng/mL

    # Ultrasound markers
    follicle_count  = Column(Integer)   # antral follicle count
    ovarian_volume  = Column(Float)     # mL per ovary

    user = relationship("User", back_populates="reports")

