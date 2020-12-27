
CREATE FUNCTION get_dispatch_states(@distributor_id INT, @dispatch_id INT)
RETURNS TABLE AS
RETURN
SELECT dispatches_states.[state] , dispatches_states.[date]
FROM dispatches
    INNER JOIN dispatches_states ON dispatches_states.dispatch_id = dispatches.dispatch_id
        AND dispatches.dispatch_id = @dispatch_id AND dispatches.distributor_id = @distributor_id