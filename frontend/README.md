# Vehicle Maintenance Tracker

## Project Description

Vehicle Maintenance Tracker is a full stack web application that helps users keep track of their vehicles and maintenance history. Users can create an account, log in securely, add vehicles, update vehicle information, record maintenance services, and view upcoming service intervals.

The application was built as a capstone project using React for the frontend and Flask for the backend.

## Features

### User Authentication

* User registration
* User login
* Session based authentication
* Protected routes and resources

### Vehicle Management

* Add vehicles
* View vehicles
* Update vehicle mileage
* Delete vehicles

### Maintenance Tracking

* Add maintenance records
* View maintenance history
* Associate maintenance records with specific vehicles
* Calculate next service interval based on mileage

## Technology Stack

### Frontend

* React
* React Router
* JavaScript
* HTML
* CSS

### Backend

* Flask
* Flask SQLAlchemy
* Flask Bcrypt
* Flask CORS

### Database

* SQLite

### Version Control

* Git
* GitHub

## Installation and Setup

### Backend

Navigate to the backend folder:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask server:

```bash
python app.py
```

The backend runs on:

```text
http://localhost:5555
```

### Frontend

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Database Structure

### Users

* id
* username
* email
* password_hash

### Vehicles

* id
* make
* model
* year
* mileage
* user_id

### Maintenance Records

* id
* service_type
* service_date
* mileage
* cost
* notes
* vehicle_id

## Future Improvements

* Vehicle editing form
* Maintenance record editing
* Service reminder notifications
* Vehicle images
* Dashboard analytics
* Deployment to Render

## Author

Manuel Alfaro
