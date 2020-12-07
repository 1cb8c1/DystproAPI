CREATE TABLE password_recovery_attempts
(
    attempt_id INT IDENTITY(1,1) NOT NULL,
    ip VARCHAR(64) NOT NULL,
    email VARCHAR(64),
    date DATETIME,
    PRIMARY KEY(attempt_id)
)