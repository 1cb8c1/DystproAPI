CREATE TABLE vehicles
(
    vehicle_id INT IDENTITY(1,1) NOT NULL,
    registration_number VARCHAR(16) NOT NULL,
    distributor_id INT NOT NULL,
    archived BIT NOT NULL DEFAULT 0,
    PRIMARY KEY(vehicle_id),
    FOREIGN KEY(distributor_id) REFERENCES distributors(distributor_id)
)