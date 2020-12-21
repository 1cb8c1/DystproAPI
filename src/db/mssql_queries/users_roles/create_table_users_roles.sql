CREATE TABLE users_roles
(
    user_id INT NOT NULL,
    role_name VARCHAR(32) NOT NULL,
    PRIMARY KEY(user_id, role_name),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(role_name) REFERENCES roles(name)
)