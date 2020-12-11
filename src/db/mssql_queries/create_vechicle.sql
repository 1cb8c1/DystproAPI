CREATE PROCEDURE create_vechicle
    @registration_number VARCHAR(16),
    @distributor_id INT,
    @vechicle_id INT OUT
AS
BEGIN
    DECLARE @vechiclesCount INT
    SELECT @vechiclesCount=COUNT(registration_number)
    FROM vechicles
    WHERE registration_number = @registration_number AND archived = 0

    IF(@vechiclesCount > 0)
        THROW 50004, 'Vechicle already exists', 1



    DECLARE @my_table table(vechicle_id INT)

    INSERT vechicles
        (registration_number, distributor_id)
    OUTPUT INSERTED.vechicle_id
            INTO @my_table
    VALUES(@registration_number, @distributor_id)

    SELECT @vechicle_id = vechicle_id
    FROM @my_table
END