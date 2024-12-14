# RapidXcel Logistics Backend

This is the backend service for the RapidXcel Logistics application, built using Flask.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ritwickrajmakhal/RapidXcel-Logistics.git
   cd RapidXcel-Logistics/backend
   ```

2. Create a virtual environment:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`
   ```

3. Install the dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Initialize the database:
   ```bash
   flask --app rapidxcel_logistics init-db
   ```

## Usage

1. Run the development server:

   ```bash
   flask --app rapidxcel_logistics run --debug
   ```

2. The server will start on `http://127.0.0.1:5000/`.

## API Endpoints

- `GET /api/couriers` - Get all couriers
- `GET /api/couriers/:id` - Get one courier
- `POST /api/couriers` - Add a new courier
- `PUT /api/couriers/:id` - Update a courier
- `DELETE /api/couriers/:id` - Delete a courier

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.
