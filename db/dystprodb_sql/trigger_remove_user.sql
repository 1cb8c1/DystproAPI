IF EXISTS(SELECT *
FROM sys.objects
WHERE name = 'remove_user' AND TYPE = 'TR')
DROP TRIGGER remove_user
GO

CREATE TRIGGER remove_user ON users
INSTEAD OF DELETE
AS BEGIN
    DELETE users_roles WHERE user_id = ANY(SELECT user_id
    FROM deleted)
    DELETE requests WHERE user_id = ANY(SELECT user_id
    FROM deleted)
    DELETE users FROM deleted WHERE users.user_id = ANY(SELECT user_id
    FROM deleted)
END
GO