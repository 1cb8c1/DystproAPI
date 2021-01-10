CREATE PROCEDURE create_distributor
    @name NVARCHAR(32),
    @discount FLOAT,
    @distributor_id INT OUT
AS
BEGIN

    /*CHECKS IF discount IS BIG ENOUGH*/
    IF(@discount < 0)
        THROW 50042, 'Discount is negative', 1

    /*CHECKS IF distributor ALREADY EXISTS*/
    IF((SELECT COUNT(name)
    FROM distributors
    WHERE name = @name AND archived = 0) != 0)
        THROW 50043, 'Distributor with such name already exists', 1

    /*ADDS distributor*/
    DECLARE @my_table TABLE(distributor_id INT)

    INSERT distributors
        (name, discount)
    OUTPUT INSERTED.distributor_id
            INTO @my_table
    VALUES(@name, @discount)

    /*CHECKS IF distributor WAS CREATED*/
    IF((SELECT COUNT(distributor_id)
    FROM @my_table) != 1)
        THROW 50044, 'Failed to create a distributor', 1

    /*RETURNS distributor_id*/
    SELECT @distributor_id = distributor_id
    FROM @my_table

END