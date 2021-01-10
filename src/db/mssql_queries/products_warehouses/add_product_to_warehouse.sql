CREATE PROCEDURE add_product_to_warehouse
    @product_id INT,
    @warehouse_name NVARCHAR(32),
    @amount INT,
    @product_warehouse_id INT OUTPUT

AS
SET XACT_ABORT ON
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
    BEGIN TRANSACTION

    /*CHECKS IF amount IS NON NEGATIVE NUMBER*/
    IF(@amount < 0)
    THROW 50037, 'Amount is smaller than 0', 1

    /*CHECKS IF product WITH SUCH id EXISTS AND IS NOT ARCHIVED*/
    IF((SELECT COUNT(product_id)
    FROM products WITH (XLOCK, ROWLOCK)
    WHERE product_id = @product_id AND archived = 0) != 1)
        THROW 50038, 'Product with such id doesnt exist or is archived', 1

    /*CHECKS IF warehouse WITH SUCH name EXISTS AND IS NOT ARCHIVED*/
    IF((SELECT COUNT(name)
    FROM warehouses WITH (XLOCK, ROWLOCK)
    WHERE name = @warehouse_name AND archived = 0) != 1)
        THROW 50039, 'Warehouse with such id doesnt exist or is archived', 1

    /*CHECKS IF product IN SUCH warehouse DOESNT ALREADY EXIST*/
    IF((SELECT COUNT(product_warehouse_id)
    FROM products_warehouses WITH (XLOCK, ROWLOCK)
    WHERE product_id = @product_id AND warehouse_name = @warehouse_name) != 0)
        THROW 50040, 'Product is already in such warehouse', 1

    /*INSERT product_warehouse*/
    DECLARE @my_table table(product_warehouse_id INT)

    INSERT products_warehouses
        (product_id, warehouse_name, amount)
    OUTPUT INSERTED.product_warehouse_id INTO @my_table
    VALUES
        (@product_id, @warehouse_name, @amount)

    /*CHECK IF product_warehouse WAS INSERTED*/
    IF((SELECT COUNT(product_warehouse_id)
    FROM @my_table) != 1)
        THROW 50041, 'Failed to insert product_warehouse', 1

    /*RETURN product_warehouse_id*/
    SELECT @product_warehouse_id = product_warehouse_id
    FROM @my_table

    COMMIT TRANSACTION
END