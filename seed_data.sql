-- Create 50 Fake Users
DO $$ 
BEGIN
    FOR i IN 1..50 LOOP
        INSERT INTO users (username, email, hashed_password, role, age, weight, height, bmi)
        VALUES (
            'user' || i, 
            'user' || i || '@example.com', 
            'password123', 
            'user', 
            floor(random() * (45-18+1) + 18), 
            floor(random() * (100-45+1) + 45), 
            160, 
            floor(random() * (35-18+1) + 18)
        );
    END LOOP;
END $$;

-- Create an Admin User
INSERT INTO users (username, email, hashed_password, role, age, weight, height, bmi)
VALUES ('admin', 'admin@example.com', 'admin123', 'admin', 30, 60, 165, 22.0);

-- Insert Indian Food DB
CREATE TABLE IF NOT EXISTS indian_foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    calories_per_100g INTEGER,
    category VARCHAR(50)
);

INSERT INTO indian_foods (name, calories_per_100g, category) VALUES
('Roti', 297, 'Carbs'),
('Brown Rice', 111, 'Carbs'),
('Dal Makhani', 330, 'Protein'),
('Moong Dal', 116, 'Protein'),
('Palak Paneer', 234, 'Protein/Fat'),
('Poha', 110, 'Carbs'),
('Upma', 130, 'Carbs'),
('Makhana', 347, 'Snack'),
('Methi Water', 5, 'Drink'),
('Ragi Dosa', 120, 'Carbs');
-- (Truncated to 10 for immediate demo, script implies a larger DB could be inserted)
