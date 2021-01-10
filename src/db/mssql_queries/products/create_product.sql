CREATE PROCEDURE create_product
    @name NVARCHAR(32),
    @price MONEY,
    @weight FLOAT,
    @unit_name VARCHAR(16),
    @unit_number FLOAT,
    @product_id INT OUTPUT
AS
BEGIN

    IF((SELECT COUNT(name)
    FROM products
    WHERE name = @name AND archived = 0) != 0)
        THROW 50029, 'Product with such name already exists and is not archived', 1

    DECLARE @my_table table(product_id INT)

    INSERT products
        (name, price, weight, unit_name, unit_number)
    OUTPUT INSERTED.product_id
            INTO @my_table
    VALUES(@name, @price, @weight, @unit_name, @unit_number)

    IF((SELECT COUNT(product_id)
    FROM @my_table) != 0)
        THROW 50030, 'Failed to create a product', 1

    SELECT @product_id = product_id
    FROM @my_table

END