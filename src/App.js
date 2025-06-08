import React, { useState, useEffect } from 'react';
import CarAPI from './services/CarAPI'; // Import your API service
import './App.css'; // Basic styling (can be customized)

function App() {
    const [cars, setCars] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // State for the Add Car form
    const [newCar, setNewCar] = useState({ make: '', model: '', year: '', price: '' });
    const [addCarError, setAddCarError] = useState(null);

    // State for delete confirmation
    const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

    // --- Fetch Cars Function ---
    const fetchCars = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedCars = await CarAPI.fetchCars();
            setCars(fetchedCars);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Add Car Function ---
    const handleAddCar = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        setAddCarError(null);

        // Basic client-side validation
        if (!newCar.make.trim() || !newCar.model.trim() || !newCar.year || !newCar.price) {
            setAddCarError('All fields are required.');
            return;
        }
        if (isNaN(newCar.year) || isNaN(newCar.price)) {
            setAddCarError('Year and Price must be numbers.');
            return;
        }
        if (parseInt(newCar.year) <= 1900 || parseInt(newCar.year) > new Date().getFullYear() + 1) {
            setAddCarError('Year must be valid.');
            return;
        }
        if (parseInt(newCar.price) <= 0 || parseInt(newCar.price) >= 1000000) {
            setAddCarError('Price must be between 1 and 999999.');
            return;
        }

        try {
            // Send newCar data to API. Backend expects year/price as numbers.
            const carToAdd = {
                make: newCar.make.trim(),
                model_name: newCar.model.trim(),
                year: parseInt(newCar.year),
                price: parseInt(newCar.price)
            };
            await CarAPI.addCar(carToAdd);
            setNewCar({ make: '', model: '', year: '', price: '' }); // Clear form
            fetchCars(); // Refresh the list of cars
        } catch (err) {
            setAddCarError(err.message);
        }
    };

    // --- Delete Car Function ---
    const handleDeleteCar = async (id) => {
        try {
            await CarAPI.deleteCar(id);
            setCars(cars.filter(car => car.car_id !== id)); // Optimistically update UI
        } catch (err) {
            setError(err.message); // Set error message if delete fails
            fetchCars(); // Re-fetch to ensure data consistency
        }
    };

    // --- Delete All Cars Function ---
    const handleDeleteAllCars = async () => {
        try {
            await CarAPI.deleteAllCars();
            setCars([]); // Clear all cars from UI
            setShowDeleteAllConfirm(false); // Close confirmation
        } catch (err) {
            setError(err.message);
        }
    };

    // useEffect hook to fetch cars when the component mounts
    useEffect(() => {
        fetchCars();
    }, []); // Empty dependency array means it runs once on mount

    return (
        <div className="App">
            <header className="App-header">
                <h1>Car Inventory</h1>
            </header>
            <main>
                {/* --- Add Car Form --- */}
                <section className="add-car-section">
                    <h2>Add New Car</h2>
                    <form onSubmit={handleAddCar}>
                        <input
                            type="text"
                            placeholder="Make"
                            value={newCar.make}
                            onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Model"
                            value={newCar.model}
                            onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Year"
                            value={newCar.year}
                            onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={newCar.price}
                            onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
                        />
                        <button type="submit" disabled={isLoading}>Add Car</button>
                        {addCarError && <p className="error-message">{addCarError}</p>}
                    </form>
                </section>

                <hr />

                {/* --- Car List --- */}
                <section className="car-list-section">
                    <h2>Available Cars</h2>
                    {isLoading && <p>Loading cars...</p>}
                    {error && <p className="error-message">Error: {error}</p>}
                    {!isLoading && !error && cars.length === 0 && (
                        <p>No cars in inventory. Add one above!</p>
                    )}
                    {!isLoading && !error && cars.length > 0 && (
                        <ul className="car-list">
                            {cars.map((car) => (
                                <li key={car.car_id} className="car-item">
                                    <div className="car-details">
                                        <span>{car.make} {car.model_name} ({car.year})</span>
                                        <span>Price: ${car.price}</span>
                                    </div>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteCar(car.car_id)}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* --- Delete All Button --- */}
                <section className="delete-all-section">
                    <button
                        className="delete-all-button"
                        onClick={() => setShowDeleteAllConfirm(true)}
                        disabled={isLoading}
                    >
                        Delete All Cars
                    </button>
                    {showDeleteAllConfirm && (
                        <div className="confirmation-dialog">
                            <p>Are you sure you want to delete ALL cars? This cannot be undone.</p>
                            <button onClick={handleDeleteAllCars}>Yes, Delete All</button>
                            <button onClick={() => setShowDeleteAllConfirm(false)}>Cancel</button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;