CREATE TABLE dispatches
(
    dispatch_id INT IDENTITY(1,1) NOT NULL,
    distributor_id INT NOT NULL,
    driver_id INT NOT NULL,
    vehicle_id INT,
    pickup_planned_date DATETIME,

    PRIMARY KEY(dispatch_id),
    FOREIGN KEY(distributor_id) REFERENCES distributors(distributor_id),
    FOREIGN KEY(driver_id) REFERENCES drivers(driver_id),
    FOREIGN KEY(vehicle_id) REFERENCES vehicles(vehicle_id)
)