IF EXISTS(SELECT *
FROM sys.objects
WHERE name = 'update_user' AND TYPE = 'TR')
DROP TRIGGER update_user
GO

CREATE TRIGGER update_user ON users
AFTER UPDATE
AS 
SET XACT_ABORT ON
SET CURSOR_CLOSE_ON_COMMIT ON /*WORKS ON ROLLBACK TOO*/
BEGIN
    BEGIN TRANSACTION

    DECLARE @db_cursor CURSOR
    DECLARE @distributor INT
    DECLARE @user_id INT



    SET @db_cursor = CURSOR FOR SELECT user_id, distributor
    FROM INSERTED
    OPEN @db_cursor

    FETCH NEXT FROM @db_cursor INTO @user_id, @distributor
    WHILE @@FETCH_STATUS = 0
	BEGIN
        DECLARE @distributor_id INT
        SET @distributor_id = @distributor
        IF(@distributor_id IS NOT NULL)
            BEGIN
            /*CHECKS IF distributor EXISTS*/
            IF((SELECT COUNT(distributor_id)
            FROM distributors
            WHERE distributor_id = @distributor_id) != 1)
                    THROW 50048, 'Distributor doesnt exist', 1

            /*UPDATES user*/
            DECLARE @my_table TABLE(user_id INT)

            UPDATE users SET distributor = @distributor_id  
                OUTPUT INSERTED.user_id INTO @my_table 
                WHERE user_id = @user_id

            /*CHECKS IF user WAS UPDATED*/
            IF((SELECT COUNT(user_id)
            FROM @my_table) != 1)
                    THROW 50049, 'Failed to update user', 1

            /*UPDATES user_roles*/
            DECLARE @my_table2 TABLE(user_id INT)

            INSERT users_roles
                (user_id, role_name)
            OUTPUT INSERTED.user_id INTO @my_table2
            VALUES(@user_id, 'DISTRIBUTOR')

            /*CHECKS IF users_roles WAS UPDATED*/
            IF((SELECT COUNT(user_id)
            FROM @my_table2) != 1)
                    THROW 50049, 'Failed to update user_roles', 1
        END
            ELSE
            BEGIN
            /*UPDATES user*/
            DECLARE @my_table3 TABLE(user_id INT)

            UPDATE users SET distributor = NULL
                OUTPUT INSERTED.user_id INTO @my_table3
                WHERE user_id = @user_id

            /*CHECKS IF user WAS UPDATED*/
            IF((SELECT COUNT(user_id)
            FROM @my_table3) != 1)
                    THROW 50049, 'Failed to update user', 1

            /*UPDATES user_roles*/
            DECLARE @my_table4 TABLE(user_id INT)

            DELETE users_roles OUTPUT DELETED.user_id INTO @my_table4 WHERE user_id = @user_id AND role_name = 'DISTRIBUTOR'

            /*CHECKS IF users_roles WAS UPDATED*/
            IF((SELECT COUNT(user_id)
            FROM @my_table4) != 1)
                    THROW 50049, 'Failed to update user_roles', 1

        END
        FETCH NEXT FROM @db_cursor INTO @user_id, @distributor
    END

    CLOSE @db_cursor
    DEALLOCATE @db_cursor

    COMMIT TRANSACTION
END
GO