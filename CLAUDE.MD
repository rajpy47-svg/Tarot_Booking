# Booking System Requirements

## Component: User Booking Form
- Technology: React
- Fields:
  - Name
  - Date of Birth
  - Partner Name
  - Brief Problem Description
  - Payment Info
- Functionality: 
  - Generate a unique booking ID after form submission
  - Send data to Node backend
  - Persist booking in the database

## Component: Database Schema
- Technology: PostgreSQL or MongoDB
- Fields to Store:
  - Unique Booking ID
  - Name
  - Date of Birth
  - Partner Name
  - Problem Description
  - Payment Status
  - Created At (timestamp)
- Ensure unique booking ID for each record
- Validate all user inputs before saving to the database

## Backend
- Technology: Node.js + Express
- Route: POST /bookings
- Process: Receive form data, generate unique booking ID, validate fields, save to DB, return booking confirmation

## Note
- Keep the system lightweight
- Secure sensitive data
- Ensure booking ID uniqueness