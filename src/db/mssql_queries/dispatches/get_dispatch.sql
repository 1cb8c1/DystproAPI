CREATE FUNCTION get_dispatch(@distributor_id INT, @dispatch_id INT)
RETURNS TABLE AS
RETURN
SELECT dispatches.dispatch_id, dispatches.pickup_planned_date,
    drivers.driver_id, drivers.name, drivers.surname,
    vehicles.vehicle_id, vehicles.registration_number,
    warehouse.warehouse_name
FROM dispatches
    INNER JOIN vehicles ON vehicles.vehicle_id = dispatches.vehicle_id AND dispatch_id = @dispatch_id AND dispatches.distributor_id = @distributor_id
    INNER JOIN drivers ON drivers.driver_id = dispatches.driver_id
    LEFT OUTER JOIN (
    SELECT warehouse_name
    FROM dispatched_products
        INNER JOIN products_warehouses ON products_warehouses.product_warehouse_id = dispatched_products.product_warehouse_id
            AND dispatched_products.dispatch_id = @dispatch_id
    GROUP BY products_warehouses.warehouse_name
        ) AS warehouse ON 1 =1