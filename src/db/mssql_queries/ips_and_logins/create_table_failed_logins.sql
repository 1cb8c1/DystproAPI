CREATE TABLE failed_logins
(
    failed_id INT IDENTITY(1,1) NOT NULL,
    ip VARCHAR(45),
    date DATETIME,
    PRIMARY KEY(failed_id)
)