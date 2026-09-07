-- Comptes secretariat et securite, distincts du compte administrateur.
-- Mot de passe pour les deux : "changeme123" (a changer immediatement en production)
INSERT INTO employees (
    first_name, last_name, job_title, department_id,
    professional_email, password_hash, role, availability
)
SELECT
    'Secretariat', 'OSERO', 'Accueil et validation des visites',
    (SELECT id FROM departments WHERE name = 'Direction'),
    'secretariat@osero.local',
    '$2a$10$yO/UOKpfKBTODGBSSfh5b.qQktTXLx/3E0JYCiyd6TpeFe0b2qvp2', -- changeme123
    'SECRETARIAT', 'DISPONIBLE';

INSERT INTO employees (
    first_name, last_name, job_title, department_id,
    professional_email, password_hash, role, availability
)
SELECT
    'Securite', 'OSERO', 'Controle des entrees et sorties',
    (SELECT id FROM departments WHERE name = 'Direction'),
    'securite@osero.local',
    '$2a$10$yO/UOKpfKBTODGBSSfh5b.qQktTXLx/3E0JYCiyd6TpeFe0b2qvp2', -- changeme123
    'SECURITY', 'DISPONIBLE';
