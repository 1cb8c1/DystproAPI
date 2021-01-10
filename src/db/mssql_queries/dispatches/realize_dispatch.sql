CREATE PROCEDURE realize_dispatch
    @distributor_id INT,
    @dispatch_id INT
AS
SET XACT_ABORT ON
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
    BEGIN TRANSACTION

    /*CHECK IF distributor EXISTS*/
    IF((SELECT COUNT(distributor_id)
    FROM distributors
    WHERE archived = 0 AND distributor_id = @distributor_id) != 1)
    THROW 50054, ' Distributor doesnt exist or is archived', 1

    /*CHECK IF dispatch EXISTS*/
    IF((SELECT COUNT(dispatch_id)
    FROM dispatches
    WHERE dispatch_id = @dispatch_id AND distributor_id = @distributor_id) != 1)
    THROW 50055, 'Dispatch doesnt exist or doesnt belong to this distributor', 1


    /*CHECK IF dispatch WAS CREATED*/
    IF(
    (
        SELECT COUNT(dispatches_states.dispatch_id)
    FROM dispatches_states WITH(XLOCK, ROWLOCK)
        INNER JOIN dispatches ON dispatches_states.dispatch_id = dispatches.dispatch_id
    WHERE dispatches.distributor_id = @distributor_id AND dispatches_states.state = 'CREATED'
    ) != 1)
        THROW 50052, 'Dispatch doesnt have status created yet', 1


    /*CHECK IF dispatch WASNT CANCELED*/
    IF(
    (
        SELECT COUNT(dispatches_states.dispatch_id)
    FROM dispatches_states WITH(XLOCK, ROWLOCK)
        INNER JOIN dispatches ON dispatches_states.dispatch_id = dispatches.dispatch_id
    WHERE dispatches.distributor_id = @distributor_id AND dispatches_states.state = 'CANCELED'
    ) != 0)
        THROW 50053, 'Cant realize canceled dispatch', 1

    /*CREATE dispatch_state REALIZED*/
    DECLARE @my_table TABLE(dispatch_id INT)
    INSERT dispatches_states
        (dispatch_id, state, date)
    OUTPUT INSERTED.dispatch_id INTO @my_table
    VALUES(@dispatch_id , 'REALIZED', GETDATE())

    /*CHECK IF dispatch_state WAS CREATED*/
    IF((SELECT COUNT(dispatch_id)
    FROM @my_table) != 1)
        THROW 50056, 'Failed to create dispatch_status', 1


    COMMIT TRANSACTION
END