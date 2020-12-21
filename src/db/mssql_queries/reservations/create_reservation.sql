CREATE PROCEDURE create_reservation
    @distributor_id INT,
    @product_warehouse_id INT,
    @amount INT,
    @reservation_id INT OUTPUT
AS
SET XACT_ABORT ON
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
    BEGIN TRANSACTION
    IF(@amount < 1)
        THROW 50006, 'Trying to reserve amount that is too small (0)', 1


    /*CHECKS IF PRODUCT_WAREHOUSE EXISTS AND IF IS NOT ARCHIVED*/
    DECLARE @products_warehouses_count INT
    SELECT @products_warehouses_count = COUNT(product_warehouse_id)
    FROM products_warehouses 
    WITH(XLOCK, ROWLOCK)
    WHERE product_warehouse_id = @product_warehouse_id AND archived = 0
    IF(@products_warehouses_count != 1)
        THROW 50011, 'Number of product_warehouse with such id is not one', 1


    DECLARE @availableAmount INT
    DECLARE @product_id INT

    SELECT @availableAmount = amount, @product_id = product_id
    FROM products_warehouses WITH (XLOCK, ROWLOCK)
    WHERE product_warehouse_id = @product_warehouse_id AND archived = 0

    IF(@amount > @availableAmount)
        THROW 50007, 'Trying to reserve amount that is too big (not available)', 1



    /*IF product IS ARCHIVED, SO SHOULD product_warehouse BE. BUT CHECKING ANYWAYS*/
    DECLARE @price MONEY
    SELECT @price = price
    FROM products
    WHERE product_id = @product_id AND archived = 0

    DECLARE @discount FLOAT
    SELECT @discount = discount
    FROM distributors
    WHERE distributor_id = @distributor_id

    DECLARE @my_table table(reservation_id INT)

    INSERT reservations
        (distributor_id, product_warehouse_id, amount, reservation_date, price)
    OUTPUT INSERTED.reservation_id INTO @my_table
    VALUES(@distributor_id, @product_warehouse_id, @amount, GETDATE(), @price * @amount - (@price * @amount * @discount / 100.0))

    IF((SELECT COUNT(reservation_id)
    FROM @my_table) != 1)
         THROW 50008, 'Failed to create one reservation', 1

    SELECT @reservation_id = reservation_id
    FROM @my_table


    DECLARE @my_table2 table(product_warehouse_id INT)

    UPDATE products_warehouses SET amount = @availableAmount - @amount 
    OUTPUT INSERTED.product_warehouse_id INTO @my_table2
    WHERE product_warehouse_id = @product_warehouse_id AND archived = 0

    IF((SELECT COUNT(product_warehouse_id)
    FROM @my_table2) != 1)
        THROW 50009, 'Failed to update one product_warehouse', 1

    COMMIT TRANSACTION
END