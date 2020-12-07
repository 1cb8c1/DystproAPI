CREATE TABLE products
(
    product_id INT NOT NULL IDENTITY(1,1),
    name VARCHAR(32) NOT NULL,
    price MONEY NOT NULL,
    weight FLOAT NOT NULL,
    unit_name VARCHAR(16) NOT NULL,
    unit_number FLOAT NOT NULL,
    archived BIT NOT NULL DEFAULT(0),
    PRIMARY KEY(product_id)
)