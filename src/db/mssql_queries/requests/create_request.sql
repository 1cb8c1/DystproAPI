CREATE PROCEDURE create_request
    @user_id INT,
    @info VARCHAR(512),
    @request_id INT OUTPUT
AS
BEGIN
    DECLARE @count INT
    SElECT @count = COUNT(user_id)
    FROM requests
    WHERE user_id = @user_id
    IF(@count >= 5)
        THROW 50002, 'Trying to create request over limit', 1



    DECLARE @my_table table(request_id INT)

    INSERT requests
        (user_id, info)
    OUTPUT INSERTED.request_id
            INTO @my_table
    VALUES(@user_id, @info)

    SELECT @request_id = request_id
    FROM @my_table
END