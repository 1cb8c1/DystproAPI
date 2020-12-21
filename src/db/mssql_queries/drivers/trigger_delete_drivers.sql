IF EXISTS (SELECT *
FROM sys.objects
WHERE name = 'archive_drivers' AND type = 'TR')
DROP TRIGGER archive_drivers
GO

CREATE TRIGGER archive_drivers ON drivers
INSTEAD OF DELETE
AS 
BEGIN
    UPDATE drivers SET archived = 1 WHERE drivers.driver_id = ANY(SELECT driver_id
    FROM deleted)
END