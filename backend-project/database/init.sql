-- CWSMS Database Schema
-- Entity Relationship: Package, Car, ServicePackage (links Car+Package), Payment (links to ServicePackage)

CREATE DATABASE IF NOT EXISTS CWSMS;
USE CWSMS;

-- Package: PackageNumber PK, PackageName, PackageDescription, PackagePrice
CREATE TABLE IF NOT EXISTS Package (
  PackageNumber INT AUTO_INCREMENT PRIMARY KEY,
  PackageName VARCHAR(100) NOT NULL,
  PackageDescription VARCHAR(255) NOT NULL,
  PackagePrice DECIMAL(10,2) NOT NULL
);

-- Car: PlateNumber PK, CarType, CarSize, DriverName, PhoneNumber
CREATE TABLE IF NOT EXISTS Car (
  PlateNumber VARCHAR(20) PRIMARY KEY,
  CarType VARCHAR(50) NOT NULL,
  CarSize VARCHAR(50) NOT NULL,
  DriverName VARCHAR(100) NOT NULL,
  PhoneNumber VARCHAR(20) NOT NULL
);

-- ServicePackage (ServiceRecord): RecordNumber PK, PlateNumber FK, PackageNumber FK, ServiceDate
CREATE TABLE IF NOT EXISTS ServicePackage (
  RecordNumber INT AUTO_INCREMENT PRIMARY KEY,
  PlateNumber VARCHAR(20) NOT NULL,
  PackageNumber INT NOT NULL,
  ServiceDate DATE NOT NULL,
  FOREIGN KEY (PlateNumber) REFERENCES Car(PlateNumber) ON DELETE CASCADE,
  FOREIGN KEY (PackageNumber) REFERENCES Package(PackageNumber) ON DELETE CASCADE
);

-- Payment: PaymentNumber PK, RecordNumber FK, AmountPaid, PaymentDate
CREATE TABLE IF NOT EXISTS Payment (
  PaymentNumber INT AUTO_INCREMENT PRIMARY KEY,
  RecordNumber INT NOT NULL,
  AmountPaid DECIMAL(10,2) NOT NULL,
  PaymentDate DATE NOT NULL,
  FOREIGN KEY (RecordNumber) REFERENCES ServicePackage(RecordNumber) ON DELETE CASCADE
);

-- User table for session-based login (username, password)
CREATE TABLE IF NOT EXISTS User (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Package data
INSERT INTO Package (PackageName, PackageDescription, PackagePrice) VALUES
('Basic wash', 'Exterior hand wash', 5000),
('Classic wash', 'Interior hand wash', 10000),
('Premium wash', 'Exterior and Interior hand wash', 20000);

-- Default receptionist user (username: receptionist, password: receptionist123)
INSERT INTO User (username, password) VALUES ('receptionist', 'receptionist123')
ON DUPLICATE KEY UPDATE username=username;
