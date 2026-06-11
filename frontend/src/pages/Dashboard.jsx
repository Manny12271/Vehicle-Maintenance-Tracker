import { useState, useEffect } from "react";

function Dashboard() {
    const [vehicle, setVehicle] = useState({
        make: "",
        model: "",
        year: "",
        mileage: ""
    });

    const [vehicles, setVehicles] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchVehicles();
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

    async function updateVehicle(vehicle) {
        const response = await fetch(
            `http://localhost:5555/api/vehicles/${vehicle.id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    mileage: Number(vehicle.mileage) + 1000
                })
            }
        );

        if (response.ok) {
            fetchVehicles();
        }
    }

    async function deleteVehicle(id) {
        const response = await fetch(
            `http://localhost:5555/api/vehicles/${id}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        if (response.ok) {
            fetchVehicles();
        }
    }

    function handleChange(e) {
        setVehicle({
            ...vehicle,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await fetch(
            "http://localhost:5555/api/vehicles",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(vehicle)
            }
        );

        const data = await response.json();

        if (response.ok) {
            setMessage(
                `${data.year} ${data.make} ${data.model} added successfully!`
            );

            setVehicle({
                make: "",
                model: "",
                year: "",
                mileage: ""
            });

            fetchVehicles();
        }
    }

    return (
        <div>
            <h2>Vehicle Dashboard</h2>

            <form onSubmit={handleSubmit}>
                <input
                    name="make"
                    placeholder="Make"
                    value={vehicle.make}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    name="model"
                    placeholder="Model"
                    value={vehicle.model}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    name="year"
                    placeholder="Year"
                    value={vehicle.year}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    name="mileage"
                    placeholder="Mileage"
                    value={vehicle.mileage}
                    onChange={handleChange}
                />

                <br />
                <br />

                <button type="submit">
                    Add Vehicle
                </button>
            </form>

            <p>{message}</p>

            <hr />

            <h3>My Vehicles</h3>

            {vehicles.map((vehicle) => (
                <div key={vehicle.id}>
                    <strong>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                    </strong>

                    <p>
                        Mileage: {vehicle.mileage}
                    </p>

                    <button
                        onClick={() => updateVehicle(vehicle)}
                    >
                        Update Mileage +1000
                    </button>

                    {" "}

                    <button
                        onClick={() => deleteVehicle(vehicle.id)}
                    >
                        Delete Vehicle
                    </button>

                    <hr />
                </div>
            ))}
        </div>
    );
}

export default Dashboard;