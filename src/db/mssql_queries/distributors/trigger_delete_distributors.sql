IF EXISTS (SELECT *
FROM sys.objects
WHERE name = 'archive_distributors' AND type = 'TR')
DROP TRIGGER archive_distributors
GO

CREATE TRIGGER archive_distributors ON distributors
INSTEAD OF DELETE
AS 
BEGIN
    UPDATE distributors SET archived = 1 WHERE distributors.distributor_id = ANY(SELECT distributor_id
    FROM deleted)
    DELETE users WHERE distributor_id = ANY(SELECT distributor_id
    FROM deleted)
END