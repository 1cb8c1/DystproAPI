
CREATE FUNCTION get_dispatched_products(@distributor_id INT, @dispatch_id INT)
RETURNS TABLE AS
RETURN
SELECT products.name , dispatched_products.amount, dispatched_products.price
FROM dispatched_products
    INNER JOIN dispatches
    ON dispatches.dispatch_id = dispatched_products.dispatch_id
        AND dispatches.dispatch_id = @dispatch_id
        AND dispatches.distributor_id = @distributor_id
    INNER JOIN products_warehouses
    ON products_warehouses.product_warehouse_id = dispatched_products.product_warehouse_id
    INNER JOIN products
    ON products.product_id = products_warehouses.product_id