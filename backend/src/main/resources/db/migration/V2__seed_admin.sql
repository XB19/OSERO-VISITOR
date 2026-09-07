-- Compte administrateur par defaut (mot de passe: "changeme123" - a changer immediatement)
-- Hash BCrypt genere pour "changeme123"
INSERT INTO departments (id, name) VALUES (gen_random_uuid(), 'Direction');

INSERT INTO buildings (id, name) VALUES (gen_random_uuid(), 'Batiment A');

INSERT INTO employees (
    first_name, last_name, job_title, department_id,
    professional_email, password_hash, role, availability
)
SELECT
    'Admin', 'OSERO', 'Administrateur systeme',
    (SELECT id FROM departments WHERE name = 'Direction'),
    'admin@osero.local',
    '$2a$10$yO/UOKpfKBTODGBSSfh5b.qQktTXLx/3E0JYCiyd6TpeFe0b2qvp2', -- changeme123
    'ADMIN', 'DISPONIBLE';
