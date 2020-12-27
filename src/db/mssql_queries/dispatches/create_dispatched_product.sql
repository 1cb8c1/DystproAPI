CREATE PROCEDURE create_dispatched_product
    @distributor_id INT,
    @dispatch_id INT,
    @reservation_id INT,
    @dispatched_product_id INT OUT
AS
SET XACT_ABORT ON
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
    BEGIN TRANSACTION

    /*CHECKING IF RESERVATION WITH SUCH ID EXISTS*/
    DECLARE @reservations_count INT
    SELECT @reservations_count = COUNT(reservation_id)
    FROM reservations WITH(XLOCK, ROWLOCK)
    WHERE reservation_id = @reservation_id AND distributor_id = @distributor_id
    IF(@reservations_count != 1)
        THROW 50014, 'Number of reservations with such reservation_id is not one', 1

    /*CHECKING IF DISPATCH WITH SUCH ID EXISTS*/
    DECLARE @dispatches_count INT
    SELECT @dispatches_count = COUNT(dispatch_id)
    FROM dispatches WITH(XLOCK,ROWLOCK)
    WHERE dispatch_id = @dispatch_id AND distributor_id = @distributor_id
    IF(@dispatches_count != 1)
        THROW 50015, 'Number of dispatches with such dispatch_id is not one', 1

    /*GETTING MORE INFO FROM RESERVATION*/
    DECLARE @product_warehouse_id INT
    DECLARE @amount INT
    DECLARE @price MONEY
    SELECT @product_warehouse_id = product_warehouse_id, @amount = amount, @price = price
    FROM reservations WITH(XLOCK, ROWLOCK)
    WHERE reservation_id = @reservation_id AND distributor_id = @distributor_id

    /*CREATING dispatched_product*/
    DECLARE @my_table TABLE(dispatched_product_id INT)

    INSERT dispatched_products
        (dispatch_id, product_warehouse_id, amount, price)
    OUTPUT INSERTED.dispatched_product_id INTO @my_table
    VALUES(@dispatch_id, @product_warehouse_id, @amount, @price)

    IF((SELECT COUNT(dispatched_product_id)
    FROM @my_table) != 1)
        THROW 50016, 'Failed to insert dispatched_product', 1

    SELECT @dispatched_product_id = dispatched_product_id
    FROM @my_table

    /*REMOVING reservation*/
    DECLARE @my_table2 TABLE(reservation_id INT)

    DELETE reservations OUTPUT DELETED.reservation_id INTO @my_table2 
    WHERE reservation_id = @reservation_id AND distributor_id = @distributor_id

    IF((SELECT COUNT(reservation_id)
    FROM @my_table2) != 1)
        THROW 50017, 'Failed to delete reservation', 1

    COMMIT TRANSACTION
END