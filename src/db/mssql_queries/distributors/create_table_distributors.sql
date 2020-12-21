CREATE TABLE distributors
(
    distributor_id INT IDENTITY(1,1) NOT NULL,
    name NVARCHAR(32) NOT NULL UNIQUE,
    discount float,
    archived BIT NOT NULL DEFAULT 0,
    PRIMARY KEY(distributor_id)
)