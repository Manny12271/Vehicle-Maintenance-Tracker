import { useState, useEffect } from "react";

function Maintenance() {
    const [vehicles, setVehicles] = useState([]);
    const [records, setRecords] = useState([]);

    const [formData, setFormData] = useState({
        vehicle_id: "",
        service_type: "",
        mileage: "",
        cost: ""
    });

    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchVehicles();
        fetchRecords();
    }, []);

    async function fetchVehicles() {
        const response = await fetch(
            "http://localhost:5555/api/vehicles",
            {
                credentials: "include"
            }
        );

        if (response.ok) {
            const data = await response.json();
            setVehicles(data);
        }
    }

    async function fetchRecords() {
        const response = await fetch(
            "http://localhost:5555/api/maintenance",
            {
                credentials: "include"
            }
        );

        if (response.ok) {
            const data = await response.json();
            setRecords(data);
        }
    }

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await fetch(
            "http://localhost:5555/api/maintenance",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    ...formData,
                    service_date: new Date().toISOString().split("T")[0],
                    notes: ""
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            setMessage("Maintenance record added!");

            setFormData({
                vehicle_id: "",
                service_type: "",
                mileage: "",
                cost: ""
            });

            fetchRecords();
        } else {
            setMessage(data.error);
        }
    }

    return (
        <div>
            <h2>Maintenance Records</h2>

            <form onSubmit={handleSubmit}>
                <select
                    name="vehicle_id"
                    value={formData.vehicle_id}
                    onChange={handleChange}
                >
                    <option value="">
                        Select Vehicle
                    </option>

                    {vehicles.map((vehicle) => (
                        <option
                            key={vehicle.id}
                            value={vehicle.id}
                        >
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </option>
                    ))}
                </select>

                <br />
                <br />

                <input
                    name="service_type"
                    placeholder="Oil Change"
                    value={formData.service_type}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    name="mileage"
                    placeholder="Mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    name="cost"
                    placeholder="Cost"
                    value={formData.cost}
                    onChange={handleChange}
                />

                <br />
                <br />

                <button type="submit">
                    Add Maintenance Record
                </button>
            </form>

            <p>{message}</p>

            <hr />

            <h3>Your Vehicles</h3>

            {vehicles.map((vehicle) => (
                <div key={vehicle.id}>
                    <strong>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                    </strong>

                    <p>
                        Mileage: {vehicle.mileage}
                    </p>

                    <hr />
                </div>
            ))}

            <h3>Maintenance History</h3>

            {records.map((record) => {
                const vehicle = vehicles.find(
                    (v) => v.id === record.vehicle_id
                );

                return (
                    <div key={record.id}>
                        <h4>
                            {vehicle
                                ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
                                : "Unknown Vehicle"}
                        </h4>

                        <strong>{record.service_type}</strong>

                        <p>Date: {record.service_date}</p>

                        <p>Mileage: {record.mileage}</p>

                        <p>Cost: ${record.cost}</p>

                        <p>
                            Next Service Due:{" "}
                            {Number(record.mileage) + 6000} miles
                        </p>

                        <hr />
                    </div>
                );
            })}
        </div>
    );
}

export default Maintenance;