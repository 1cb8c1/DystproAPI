CREATE PROCEDURE finish_create_dispatch
    @distributor_id INT,
    @dispatch_id INT
AS
SET XACT_ABORT ON
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
    BEGIN TRANSACTION

    /*CHECK IF dispatch ID IS IN THE TABLE*/
    IF((SELECT COUNT(dispatch_id)
    FROM dispatches WITH (XLOCK, ROWLOCK)
    WHERE dispatch_id = @dispatch_id AND distributor_id = @distributor_id) != 1)
        THROW 50023, 'Dispatch isnt in the table', 1

    /*CHECK IF ANY dispatch_state FOR THIS dispatch DOESNT ALREADY EXIST*/
    IF((SELECT COUNT(state)
    FROM dispatches_states
    WHERE dispatch_id = @dispatch_id) > 0)
        THROW 50024, 'State for this dispatch already exists', 1

    /*CHECK IF ALL dispatched_products ARE FROM THE SAME warehouse*/
    DECLARE @amount_of_warehouses INT

    SELECT @amount_of_warehouses = COUNT(DISTINCT products_warehouses.warehouse_name)
    FROM products_warehouses
        INNER JOIN (SELECT *
        FROM dispatched_products
        WHERE dispatch_id = @dispatch_id) AS dispatched ON dispatched.product_warehouse_id = products_warehouses.product_warehouse_id

    IF(@amount_of_warehouses != 1)
        THROW 50050, 'Reservations dont have the same warehouse', 1

    /*CREATE dispatch_state*/
    DECLARE @my_table2 TABLE(dispatch_id INT)
    INSERT dispatches_states
        (dispatch_id, state, date)
    OUTPUT INSERTED.dispatch_id INTO @my_table2
    VALUES(@dispatch_id , 'CREATED', GETDATE())

    /*CHECK IF dispatch_state WAS CREATED*/
    IF((SELECT COUNT(dispatch_id)
    FROM @my_table2) != 1)
        THROW 50025, 'Failed to create dispatch_status', 1


    COMMIT TRANSACTION
END