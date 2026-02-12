-- Users table (for both students and counsellors)
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    roll_no VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student', 'counsellor', 'admin')) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    profile_image TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Students specific table
CREATE TABLE students (
    id UUID REFERENCES users(id) PRIMARY KEY,
    roll_no VARCHAR(50) UNIQUE NOT NULL,
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    father_mobile VARCHAR(20),
    mother_mobile VARCHAR(20),
    father_occupation VARCHAR(255),
    mother_occupation VARCHAR(255),
    address TEXT,
    place VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    mobile VARCHAR(20),
    aadhar_number VARCHAR(12),
    semester INTEGER,
    year INTEGER,
    branch VARCHAR(100),
    section VARCHAR(10),
    residence VARCHAR(50),
    hostel_name VARCHAR(255),
    hostel_admission_date DATE,
    hostel_fee DECIMAL(10,2),
    hostel_balance DECIMAL(10,2),
    bus_no VARCHAR(50),
    bus_route VARCHAR(255),
    bus_fee DECIMAL(10,2),
    bus_balance DECIMAL(10,2),
    tuition_fee DECIMAL(10,2),
    tuition_rtf DECIMAL(10,2),
    tuition_mq DECIMAL(10,2),
    tuition_nrtf DECIMAL(10,2),
    concession DECIMAL(10,2),
    balance_fee DECIMAL(10,2),
    attendance_percentage DECIMAL(5,2),
    attendance_data JSONB DEFAULT '{}'::jsonb,
    backlogs_data JSONB DEFAULT '{}'::jsonb,
    csp_project_title TEXT,
    project_guide VARCHAR(255),
    internship_details TEXT,
    moocs_courses TEXT[],
    extra_activities TEXT,
    remarks TEXT,
    is_hosteller BOOLEAN DEFAULT FALSE,
    is_dayscholar BOOLEAN DEFAULT FALSE,
    counsellor_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Counsellors specific table
CREATE TABLE counsellors (
    id UUID REFERENCES users(id) PRIMARY KEY,
    counsellor_id VARCHAR(50) UNIQUE NOT NULL,
    assigned_year INTEGER,
    assigned_semester INTEGER,
    assigned_branch VARCHAR(100),
    assigned_section VARCHAR(10),
    max_students INTEGER DEFAULT 30,
    current_students INTEGER DEFAULT 0,
    assignments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Counselling records table
CREATE TABLE counselling_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) NOT NULL,
    counsellor_id UUID REFERENCES counsellors(id) NOT NULL,
    semester INTEGER NOT NULL,
    academic_year VARCHAR(20),
    backlogs TEXT[],
    csp_project_title TEXT,
    project_guide VARCHAR(255),
    internship_details TEXT,
    moocs_courses TEXT[],
    extra_activities TEXT[],
    remarks TEXT,
    counselling_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Student semester updates
CREATE TABLE semester_updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) NOT NULL,
    year INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    branch VARCHAR(100) NOT NULL,
    section VARCHAR(10) NOT NULL,
    counsellor_id UUID REFERENCES counsellors(id),
    status VARCHAR(20) DEFAULT 'pending',
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin activities log
CREATE TABLE admin_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES users(id) NOT NULL,
    action VARCHAR(255) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);