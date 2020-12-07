CREATE TABLE vechicles
(
    registration_number VARCHAR(16) NOT NULL UNIQUE,
    distributor_id INT NOT NULL,
    archived BIT NOT NULL DEFAULT 0,
    PRIMARY KEY(registration_number),
    FOREIGN KEY(distributor_id) REFERENCES distributors(distributor_id)
)