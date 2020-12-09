CREATE TABLE reservations
(
    reservation_id INT IDENTITY(1,1) NOT NULL,
    distributor_id INT NOT NULL,
    product_warehouse_id INT NOT NULL,
    amount INT NOT NULL,
    reservation_date DATETIME,
    price MONEY NOT NULL,
    PRIMARY KEY(reservation_id),
    FOREIGN KEY(distributor_id) REFERENCES distributors(distributor_id),
    FOREIGN KEY(product_warehouse_id) REFERENCES products_warehouses(product_warehouse_id)
)