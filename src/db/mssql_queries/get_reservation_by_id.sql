CREATE FUNCTION get_reservation_by_id(@reservation_id INT, @distributor_id INT)
RETURNS TABLE
AS
RETURN
SELECT
    reservations.reservation_id, reservations.product_warehouse_id,
    reservations.amount, reservations.reservation_date,
    reservations.price, products.product_id,
    products.name, products_warehouses.warehouse_name
FROM reservations
    INNER JOIN products_warehouses
    ON products_warehouses.product_warehouse_id = reservations.product_warehouse_id
        AND reservations.distributor_id = @distributor_id
        AND reservations.reservation_id = @reservation_id
    INNER JOIN products ON products_warehouses.product_id = products.product_id