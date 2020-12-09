CREATE TABLE products_warehouses
(
    product_warehouse_id INT IDENTITY(1,1) NOT NULL,
    warehouse_name VARCHAR(32) NOT NULL,
    product_id INT NOT NULL,
    amount INT NOT NULL,
    archived BIT NOT NULL DEFAULT 0,
    PRIMARY KEY(product_warehouse_id),
    FOREIGN KEY(warehouse_name) REFERENCES warehouses(name),
    FOREIGN KEY(product_id) REFERENCES products(product_id)
)