CREATE PROCEDURE remove_request_by_id
    @request_id INT,
    @user_id INT
AS
BEGIN
    DECLARE @requestsCount INT
    SELECT @requestsCount = COUNT(request_id)
    FROM requests
    WHERE request_id = @request_id AND user_id = @user_id

    IF(@requestsCount < 1)
        THROW 50003, 'Trying to delete request that doesnt exist for this distributor', 1

    DELETE requests WHERE request_id = @request_id AND user_id = @user_id
END