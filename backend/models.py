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
    
    cycles = relationship("Cycle", back_populates="user")
    meals = relationship("Meal", back_populates="user")
    reports = relationship("MedicalReport", back_populates="user")

class Cycle(Base):
    __tablename__ = "cycles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    start_date = Column(Date)
    end_date = Column(Date)
    flow_intensity = Column(String) # light, medium, heavy
    pain_level = Column(Integer) # 1-10
    
    user = relationship("User", back_populates="cycles")

class Meal(Base):
    __tablename__ = "meals"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date)
    food_item = Column(String)
    calories = Column(Integer)
    macros = Column(String) # JSON-like string
    
    user = relationship("User", back_populates="meals")

class MedicalReport(Base):
    __tablename__ = "medical_reports"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    upload_date = Column(DateTime, default=datetime.datetime.utcnow)
    report_type = Column(String) # e.g., "glucose", "hormone"
    value = Column(Float)
    notes = Column(String)
    
    user = relationship("User", back_populates="reports")
