CREATE TABLE drivers
(
    driver_id INT IDENTITY(1,1) NOT NULL,
    name NVARCHAR(32) NOT NULL,
    surname NVARCHAR(32) NOT NULL,
    distributor_id INT NOT NULL,
    archived BIT NOT NULL DEFAULT 0,
    PRIMARY KEY(driver_id),
    FOREIGN KEY(distributor_id) REFERENCES distributors(distributor_id)
)