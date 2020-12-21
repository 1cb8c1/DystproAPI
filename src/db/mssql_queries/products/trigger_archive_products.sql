IF EXISTS (SELECT *
FROM sys.objects
WHERE name = 'archive_products' AND type = 'TR')
DROP TRIGGER archive_products
GO

CREATE TRIGGER archive_products ON products
INSTEAD OF DELETE
AS 
BEGIN
    UPDATE products SET archived = 1 WHERE products.product_id = ANY(SELECT product_id
    FROM deleted)
    UPDATE products_warehouses SET archived = 1 WHERE product_id = ANY(SELECT product_id
    FROM deleted)
END