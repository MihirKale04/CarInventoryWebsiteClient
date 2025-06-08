const API_BASE_URL = 'http://localhost:3000/cars'; // <-- UPDATE THIS IP/PORT IF NECESSARY

const CarAPI = {
    // Fetches all cars from the API
    async fetchCars() {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                // If response status is not 2xx, throw an error
                const errorBody = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            }
            const cars = await response.json();
            return cars;
        } catch (error) {
            console.error('Error fetching cars:', error);
            throw error; // Re-throw to be caught by the component
        }
    },

    // Adds a new car to the API
    async addCar(car) {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(car), // Convert JavaScript object to JSON string
            });

            if (!response.ok) {
                console.log(JSON.stringify(car))
                const errorBody = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            }
            const addedCar = await response.json(); // Backend returns the added car with ID
            return addedCar;
        } catch (error) {
            console.error('Error adding car:', error);
            throw error;
        }
    },

    // Deletes a car by ID
    async deleteCar(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok && response.status !== 204) { // 204 No Content has no body, so don't try to parse JSON
                const errorBody = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            }
            // No content expected for 204, so no response.json()
        } catch (error) {
            console.error(`Error deleting car with ID ${id}:`, error);
            throw error;
        }
    },

    // Deletes all cars
    async deleteAllCars() {
        try {
            const response = await fetch(`${API_BASE_URL}/all`, {
                method: 'DELETE',
            });

            if (!response.ok && response.status !== 204) {
                const errorBody = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            }
        } catch (error) {
            console.error('Error deleting all cars:', error);
            throw error;
        }
    }
};

export default CarAPI; // Export the API service