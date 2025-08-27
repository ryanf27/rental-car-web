-- Create user role enum
CREATE TYPE user_role AS ENUM ('customer', 'admin');

-- Create car status enum
CREATE TYPE car_status AS ENUM ('available', 'rented', 'maintenance');

-- Create transmission enum
CREATE TYPE transmission_type AS ENUM ('manual', 'automatic');

-- Create booking status enum
CREATE TYPE booking_status AS ENUM ('pending_payment', 'confirmed', 'completed', 'cancelled');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  role user_role NOT NULL DEFAULT 'customer',
  PRIMARY KEY (id)
);

-- Create cars table
CREATE TABLE public.cars (
  id BIGSERIAL PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  transmission transmission_type NOT NULL,
  seats INTEGER NOT NULL,
  price_per_day DECIMAL(10, 2) NOT NULL,
  images JSONB,
  status car_status NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  car_id BIGINT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending_payment',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Cars policies
CREATE POLICY "Cars are viewable by everyone" 
ON public.cars FOR SELECT USING (true);

CREATE POLICY "Admin can manage cars" 
ON public.cars FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Bookings policies
CREATE POLICY "Users can view and create their own bookings" 
ON public.bookings FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all bookings" 
ON public.bookings FOR SELECT USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'User'), 
    'customer'
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();