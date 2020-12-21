IF EXISTS (SELECT *
FROM sys.objects
WHERE name = 'archive_vehicles' AND type = 'TR')
DROP TRIGGER archive_vehicles
GO

CREATE TRIGGER archive_vehicles ON vehicles
INSTEAD OF DELETE
AS 
BEGIN
    UPDATE vehicles SET archived = 1 WHERE vehicles.vehicle_id = ANY(SELECT vehicle_id
    FROM deleted)
END