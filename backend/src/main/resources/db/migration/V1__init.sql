-- OSERO VISITOR - schema initial

CREATE TABLE departments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(120) NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE buildings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(120) NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE floors (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    label       VARCHAR(60) NOT NULL, -- ex: "R+2"
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (building_id, label)
);

CREATE TABLE offices (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    floor_id    UUID NOT NULL REFERENCES floors(id) ON DELETE CASCADE,
    label       VARCHAR(60) NOT NULL, -- ex: "Bureau 204"
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (floor_id, label)
);

CREATE TABLE employees (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name          VARCHAR(80) NOT NULL,
    last_name           VARCHAR(80) NOT NULL,
    job_title           VARCHAR(120),
    department_id       UUID REFERENCES departments(id) ON DELETE SET NULL,
    professional_phone  VARCHAR(30),
    professional_email  VARCHAR(160) NOT NULL UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,
    role                VARCHAR(20) NOT NULL DEFAULT 'EMPLOYEE', -- ADMIN, EMPLOYEE, SECURITY
    building_id         UUID REFERENCES buildings(id) ON DELETE SET NULL,
    floor_id            UUID REFERENCES floors(id) ON DELETE SET NULL,
    office_id           UUID REFERENCES offices(id) ON DELETE SET NULL,
    availability        VARCHAR(20) NOT NULL DEFAULT 'DISPONIBLE', -- DISPONIBLE, ABSENT, INDISPONIBLE
    active              BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE visits (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_first_name  VARCHAR(80) NOT NULL,
    visitor_last_name   VARCHAR(80) NOT NULL,
    reason              VARCHAR(30) NOT NULL, -- RENDEZ_VOUS, REUNION, PARTENAIRE, LIVRAISON, RECRUTEMENT, DEPOT_DOCUMENT, AUTRE
    reason_detail       VARCHAR(255),
    employee_id         UUID NOT NULL REFERENCES employees(id),
    status              VARCHAR(30) NOT NULL DEFAULT 'NOUVELLE_DEMANDE',
    location_snapshot   VARCHAR(255),
    refusal_reason      VARCHAR(255),
    arrival_time        TIMESTAMPTZ NOT NULL DEFAULT now(),
    notified_at         TIMESTAMPTZ,
    responded_at        TIMESTAMPTZ,
    closed_at           TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_visits_status ON visits(status);
CREATE INDEX idx_visits_employee ON visits(employee_id);
CREATE INDEX idx_visits_arrival_time ON visits(arrival_time);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_offices_floor ON offices(floor_id);
CREATE INDEX idx_floors_building ON floors(building_id);
