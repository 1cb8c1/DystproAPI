IF EXISTS (SELECT *
FROM sys.objects
WHERE name = 'archive_warehouses' AND type = 'TR')
DROP TRIGGER archive_warehouses
GO

CREATE TRIGGER archive_warehouses ON warehouses
INSTEAD OF DELETE
AS 
BEGIN
    UPDATE warehouses SET archived = 1 WHERE warehouses.name = ANY(SELECT name
    FROM deleted)
    UPDATE products_warehouses SET archived = 1 WHERE warehouse_name = ANY(SELECT name
    FROM deleted)
END