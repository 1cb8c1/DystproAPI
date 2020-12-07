SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[get_products_names](@name VARCHAR(32))
RETURNS TABLE
AS
RETURN
    SELECT product_id, name
FROM products
WHERE name LIKE ('%' +@name + '%') AND archived = 0
GO
