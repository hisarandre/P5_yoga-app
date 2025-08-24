
-- Teachers, Users, Sessions
INSERT INTO TEACHERS (id, first_name, last_name, created_at, updated_at) VALUES
(1, 'Margot', 'DELAHAYE', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
(2, 'Helene', 'THIERCELIN', '2025-02-01 00:00:00', '2025-02-01 00:00:00');

INSERT INTO USERS (id, first_name, last_name, admin, email, password, created_at, updated_at) VALUES
(1, 'Admin', 'Admin', TRUE, 'yoga@studio.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq', '2025-01-01 00:00:00', '2025-02-15 00:30:00'),
(2, 'User', 'Test', FALSE, 'test@example.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq', '2025-01-01 00:00:00', '2025-02-01 00:30:00');

INSERT INTO SESSIONS (id, name, description, date, teacher_id, created_at, updated_at) VALUES
(1, 'Yoga', 'Yoga session', '2025-02-01 10:00:00', 1, '2025-01-01 10:00:00', '2025-01-01 10:00:00'),
(2, 'Pilate', 'Pilate session', '2025-02-01 09:00:00', 2, '2025-01-01 10:00:00', '2025-01-01 10:00:00');

INSERT INTO PARTICIPATE (user_id, session_id) VALUES (1, 1);
INSERT INTO PARTICIPATE (user_id, session_id) VALUES (2, 2);

