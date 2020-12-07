CREATE TABLE dispatched_products
(
    dispatched_product_id INT IDENTITY(1,1) NOT NULL,
    dispatch_id INT NOT NULL,
    product_warehouse_id INT NOT NULL,
    amount INT NOT NULL,
    price MONEY NOT NULL,

    PRIMARY KEY(dispatched_product_id),
    FOREIGN KEY(dispatch_id) REFERENCES dispatches(dispatch_id),
    FOREIGN KEY(product_warehouse_id) REFERENCES products_warehouses(product_warehouse_id)
)