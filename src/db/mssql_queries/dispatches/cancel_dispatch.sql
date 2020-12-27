CREATE PROCEDURE cancel_dispatch
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
        THROW 50019, 'Dispatch isnt in the table', 1

    /*CHECK IF dispatch_state CREATED FOR THIS dispatch EXISTS*/
    IF((SELECT COUNT(state)
    FROM dispatches_states WITH (XLOCK, ROWLOCK)
    WHERE dispatch_id = @dispatch_id AND state = 'CREATED') != 1)
        THROW 50020, 'Dispatch doesnt have status CREATED', 1

    /*CHECK IF dispatch_state CANCELED FOR THIS dispatch DOESNT ALREADY EXIST*/
    IF((SELECT COUNT(state)
    FROM dispatches_states
    WHERE dispatch_id = @dispatch_id AND state = 'CANCELED') > 0)
        THROW 50021, 'State for this dispatch already exists', 1

    /*CREATE dispatch_state*/
    DECLARE @my_table TABLE(dispatch_id INT)
    INSERT dispatches_states
        (dispatch_id, state, date)
    OUTPUT INSERTED.dispatch_id INTO @my_table
    VALUES(@dispatch_id , 'CANCELED', GETDATE())

    /*CHECK IF dispatch_state WAS CREATED*/
    IF((SELECT COUNT(dispatch_id)
    FROM @my_table) != 1)
        THROW 50022, 'Failed to create dispatch_status', 1


    /*GET AMOUNTS*/
    DECLARE @amounts_table TABLE(product_warehouse_id INT,
        total_amount INT)


    INSERT INTO @amounts_table
        (product_warehouse_id, total_amount)
    SELECT product_warehouse_id, SUM(ISNULL(amount, 0)) AS total_amount
    FROM dispatched_products WITH (XLOCK, ROWLOCK)
    WHERE dispatch_id = @dispatch_id
    GROUP BY product_warehouse_id


    /*UPDATE PRODUCTS AMOUNT IN WAREHOUSES*/
    UPDATE products_warehouses WITH(XLOCK, ROWLOCK) SET amount += (SELECT total_amount
    FROM @amounts_table AS amounts_table
    WHERE products_warehouses.product_warehouse_id = amounts_table.product_warehouse_id)
    WHERE products_warehouses.product_warehouse_id = ANY (SELECT product_warehouse_id
    FROM @amounts_table)


    COMMIT TRANSACTION
END