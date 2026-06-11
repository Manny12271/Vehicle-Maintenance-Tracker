from flask import Flask, request, session, jsonify
from flask_cors import CORS

from config import db, bcrypt
from models import User, Vehicle, MaintenanceRecord

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "vehicle-maintenance-secret-key"
app.config["SESSION_COOKIE_HTTPONLY"] = True

db.init_app(app)
bcrypt.init_app(app)

CORS(app, supports_credentials=True)


@app.route("/")
def home():
    return {
        "message": "Vehicle Maintenance Tracker API Running"
    }


# =========================
# AUTH ROUTES
# =========================

@app.post("/api/signup")
def signup():

    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields required"}), 400

    existing_user = User.query.filter(
        (User.username == username) |
        (User.email == email)
    ).first()

    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    user = User(
        username=username,
        email=email
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    session["user_id"] = user.id

    return jsonify(user.to_dict()), 201


@app.post("/api/login")
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        session["user_id"] = user.id
        return jsonify(user.to_dict())

    return jsonify({
        "error": "Invalid email or password"
    }), 401


@app.delete("/api/logout")
def logout():

    session.pop("user_id", None)

    return jsonify({
        "message": "Logged out successfully"
    })


@app.get("/api/check_session")
def check_session():

    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "Unauthorized"
        }), 401

    user = User.query.get(user_id)

    return jsonify(user.to_dict())


# =========================
# VEHICLE ROUTES
# =========================

@app.get("/api/vehicles")
def get_vehicles():

    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "Unauthorized"
        }), 401

    vehicles = Vehicle.query.filter_by(
        user_id=user_id
    ).all()

    return jsonify([
        vehicle.to_dict()
        for vehicle in vehicles
    ])


@app.post("/api/vehicles")
def create_vehicle():

    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "Unauthorized"
        }), 401

    data = request.get_json()

    vehicle = Vehicle(
        make=data.get("make"),
        model=data.get("model"),
        year=data.get("year"),
        mileage=data.get("mileage"),
        user_id=user_id
    )

    db.session.add(vehicle)
    db.session.commit()

    return jsonify(vehicle.to_dict()), 201


@app.patch("/api/vehicles/<int:id>")
def update_vehicle(id):

    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "Unauthorized"
        }), 401

    vehicle = Vehicle.query.get(id)

    if not vehicle:
        return jsonify({
            "error": "Vehicle not found"
        }), 404

    if vehicle.user_id != user_id:
        return jsonify({
            "error": "Forbidden"
        }), 403

    data = request.get_json()

    vehicle.make = data.get("make", vehicle.make)
    vehicle.model = data.get("model", vehicle.model)
    vehicle.year = data.get("year", vehicle.year)
    vehicle.mileage = data.get("mileage", vehicle.mileage)

    db.session.commit()

    return jsonify(vehicle.to_dict())


@app.delete("/api/vehicles/<int:id>")
def delete_vehicle(id):

    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "Unauthorized"
        }), 401

    vehicle = Vehicle.query.get(id)

    if not vehicle:
        return jsonify({
            "error": "Vehicle not found"
        }), 404

    if vehicle.user_id != user_id:
        return jsonify({
            "error": "Forbidden"
        }), 403

    db.session.delete(vehicle)
    db.session.commit()

    return jsonify({
        "message": "Vehicle deleted"
    })


# =========================
# MAINTENANCE ROUTES
# =========================

@app.get("/api/maintenance")
def get_maintenance():

    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "Unauthorized"
        }), 401

    vehicles = Vehicle.query.filter_by(
        user_id=user_id
    ).all()

    vehicle_ids = [vehicle.id for vehicle in vehicles]

    records = MaintenanceRecord.query.filter(
        MaintenanceRecord.vehicle_id.in_(vehicle_ids)
    ).all()

    return jsonify([
        record.to_dict()
        for record in records
    ])


@app.post("/api/maintenance")
def create_maintenance():

    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "Unauthorized"
        }), 401

    data = request.get_json()

    vehicle = Vehicle.query.get(
        data.get("vehicle_id")
    )

    if not vehicle:
        return jsonify({
            "error": "Vehicle not found"
        }), 404

    if vehicle.user_id != user_id:
        return jsonify({
            "error": "Forbidden"
        }), 403

    record = MaintenanceRecord(
        service_type=data.get("service_type"),
        service_date=data.get("service_date"),
        mileage=data.get("mileage"),
        cost=data.get("cost"),
        notes=data.get("notes"),
        vehicle_id=data.get("vehicle_id")
    )

    db.session.add(record)
    db.session.commit()

    return jsonify(record.to_dict()), 201


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(port=5555, debug=True)
