CREATE FUNCTION get_product(@id INT)
RETURNS TABLE 
AS
RETURN
SELECT product_id, name, price, weight, unit_name, unit_number
FROM products
WHERE product_id = @id AND archived = 0
GO