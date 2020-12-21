CREATE PROCEDURE cancel_reservation
    @distributor_id INT,
    @reservation_id INT
AS
SET XACT_ABORT ON
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
    BEGIN TRANSACTION

    /*LOCKING AND CHECKING IF THERE IS SUCH RESERVATION*/
    DECLARE @reservations_count INT
    SELECT @reservations_count = COUNT(reservation_id)
    FROM reservations WITH (XLOCK, ROWLOCK)
    WHERE reservation_id = @reservation_id
    IF(@reservations_count != 1)
        THROW 50010, 'Number of reservations with such id is not one', 1


    /*OBTAINING reserved_amount and product_warehouse_id*/
    DECLARE @reserved_amount INT
    DECLARE @product_warehouse_id INT
    SELECT @product_warehouse_id = product_warehouse_id, @reserved_amount = amount
    FROM reservations
    WHERE reservation_id = @reservation_id

    /*LOCKING AND CHECKING IF products_warehouses WITH SUCH ID EXISTS*/
    DECLARE @products_warehouses_count INT
    SELECT @products_warehouses_count = COUNT(product_warehouse_id)
    FROM products_warehouses WITH (XLOCK, ROWLOCK)
    WHERE product_warehouse_id = @product_warehouse_id
    IF(@products_warehouses_count != 1)
        THROW 50011, 'Number of product_warehouse with such id is not one', 1

    /*REMOVING RESERVATION*/
    DECLARE @my_table table(reservation_id INT)
    DELETE reservations
    OUTPUT DELETED.reservation_id INTO @my_table 
    WHERE reservation_id = @reservation_id

    IF((SELECT COUNT(reservation_id)
    FROM @my_table) != 1)
        THROW 50012, 'Failed to delete one reservation', 1

    /*UPDATING products_warehouses*/
    DECLARE @my_table2 table(product_warehouse_id INT)
    UPDATE products_warehouses SET amount += @reserved_amount 
    OUTPUT INSERTED.product_warehouse_id INTO @my_table2
    WHERE product_warehouse_id = @product_warehouse_id

    IF((SELECT COUNT(product_warehouse_id)
    FROM @my_table2) != 1)
        THROW 50013, 'Failed to update one product_warehouse', 1


    COMMIT TRANSACTION
END