IF EXISTS (SELECT *
FROM sys.objects
WHERE name = 'archive_products_warehouses' AND type = 'TR')
DROP TRIGGER archive_products_warehouses
GO

CREATE TRIGGER archive_products_warehouses ON products_warehouses
INSTEAD OF DELETE
AS 
BEGIN
    UPDATE products_warehouses SET archived = 1 WHERE products_warehouses.product_warehouse_id = ANY(SELECT product_warehouse_id
    FROM deleted)
END