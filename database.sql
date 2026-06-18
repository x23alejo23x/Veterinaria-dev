-- =============================================================================
--  NURA VETCARE — Modelo relacional PostgreSQL
--  Versión: 1.1  |  Motor: PostgreSQL 15+  |  Compatible: Supabase
-- =============================================================================
--  Tablas:
--    1. users            — Veterinarios y staff con acceso al sistema
--    2. owners           — Propietarios de los pacientes
--    3. patients         — Pacientes (animales) de la clínica
--    4. medications      — Catálogo de medicamentos disponibles
--    5. prescriptions    — Prescripciones emitidas a pacientes
--    6. appointments     — Citas agendadas
--    7. clinical_notes   — Historial clínico / notas médicas
--
--  Convenciones:
--    - PKs: BIGINT autoincremental (GENERATED ALWAYS AS IDENTITY)
--    - Timestamps: TIMESTAMPTZ (con zona horaria)
--    - Soft-delete: columna deleted_at TIMESTAMPTZ (NULL = activo)
--    - ENUMs: tipos PostgreSQL reutilizables
--    - Índices: sobre todas las FK y campos de búsqueda frecuente
-- =============================================================================


-- -----------------------------------------------------------------------------
--  EXTENSIÓN OPCIONAL
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "unaccent";   -- búsquedas sin acentos (opcional)


-- =============================================================================
--  TIPOS ENUM
-- =============================================================================

-- Rol del usuario dentro del sistema
CREATE TYPE user_role AS ENUM (
  'admin',        -- Acceso total
  'vet',          -- Veterinario — puede crear notas, prescripciones y citas
  'receptionist'  -- Solo puede gestionar citas y propietarios
);

-- Estado clínico del paciente
CREATE TYPE patient_status AS ENUM (
  'Estable',
  'Tratamiento',
  'Observacion',
  'Preventivo',
  'Alta'
);

-- Sexo biológico del paciente
CREATE TYPE patient_sex AS ENUM (
  'Macho',
  'Hembra'
);

-- Tipo de cita
CREATE TYPE appointment_type AS ENUM (
  'General',
  'Urgencia',
  'Control',
  'Vacunación',
  'Cirugía'
);

-- Estado de la cita
CREATE TYPE appointment_status AS ENUM (
  'Pendiente',
  'Confirmada',
  'Cancelada',
  'Completada'
);

-- Estado de una prescripción
CREATE TYPE prescription_status AS ENUM (
  'Activa',
  'Finalizada',
  'Suspendida'
);


-- =============================================================================
--  1. TABLA: users
--     Veterinarios, recepcionistas y administradores con acceso al sistema.
--     La sesión se valida contra esta tabla (JWT o sesión propia).
-- =============================================================================
CREATE TABLE users (
  id              BIGINT        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username        VARCHAR(60)   NOT NULL UNIQUE,
  email           VARCHAR(120)  NOT NULL UNIQUE,
  password_hash   TEXT          NOT NULL,         -- bcrypt / argon2
  full_name       VARCHAR(80)   NOT NULL,
  role            user_role     NOT NULL DEFAULT 'vet',
  specialty       VARCHAR(80),                    -- Ej: "Medicina interna"
  phone           VARCHAR(30),
  active          BOOLEAN       NOT NULL DEFAULT TRUE,
  avatar_url      TEXT,
  last_login      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ                     -- NULL = activo
);

COMMENT ON TABLE  users             IS 'Veterinarios y staff con acceso al sistema';
COMMENT ON COLUMN users.role        IS 'admin | vet | receptionist';
COMMENT ON COLUMN users.deleted_at  IS 'Soft-delete: NULL = cuenta activa';


-- =============================================================================
--  2. TABLA: owners
--     Propietarios de los pacientes. Un propietario puede tener N pacientes.
-- =============================================================================
CREATE TABLE owners (
  id            BIGINT        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  full_name     VARCHAR(80)   NOT NULL,
  phone         VARCHAR(30)   NOT NULL,
  email         VARCHAR(120)  UNIQUE,
  address       TEXT,
  balance       NUMERIC(12,2) NOT NULL DEFAULT 0.00,  -- Saldo pendiente de pago
  last_contact  DATE,
  notes         TEXT,                                  -- Observaciones internas
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

COMMENT ON TABLE  owners         IS 'Propietarios de pacientes';
COMMENT ON COLUMN owners.balance IS 'Saldo pendiente de pago en pesos colombianos';


-- =============================================================================
--  3. TABLA: patients
--     Animales atendidos en la clínica. Cada paciente pertenece a un propietario.
-- =============================================================================
CREATE TABLE patients (
  id            BIGINT          PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  owner_id      BIGINT          NOT NULL REFERENCES owners(id) ON DELETE RESTRICT,
  name          VARCHAR(60)     NOT NULL,
  species       VARCHAR(40)     NOT NULL,   -- Canino, Felino, Ave, Reptil, Otro
  breed         VARCHAR(60),
  age           VARCHAR(20),                -- Texto libre: "4 años", "8 meses"
  weight_kg     NUMERIC(5,2),
  sex           patient_sex,
  color         VARCHAR(60),
  microchip     VARCHAR(30)     UNIQUE,     -- Número de microchip (único si existe)
  sterilized    BOOLEAN         NOT NULL DEFAULT FALSE,
  status        patient_status  NOT NULL DEFAULT 'Estable',
  last_visit    DATE,
  next_visit    TIMESTAMPTZ,
  photo_url     TEXT,
  created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

COMMENT ON TABLE  patients           IS 'Animales (pacientes) de la clínica';
COMMENT ON COLUMN patients.owner_id  IS 'FK → owners. ON DELETE RESTRICT: no se puede eliminar un propietario con pacientes activos';
COMMENT ON COLUMN patients.microchip IS 'Número único de microchip. NULL si no tiene';
COMMENT ON COLUMN patients.age       IS 'Texto libre porque la edad cambia con el tiempo y se actualiza manualmente';


-- =============================================================================
--  4. TABLA: medications
--     Catálogo de medicamentos disponibles en la clínica.
-- =============================================================================
CREATE TABLE medications (
  id              BIGINT        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name            VARCHAR(80)   NOT NULL UNIQUE,
  concentration   NUMERIC(8,2)  NOT NULL,   -- Valor numérico
  unit            VARCHAR(20)   NOT NULL,   -- Ej: "mg/ml", "mg/comprimido"
  category        VARCHAR(60)   NOT NULL,   -- Ej: "Antibiótico", "Antiinflamatorio"
  description     TEXT,
  active          BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

COMMENT ON TABLE  medications        IS 'Catálogo de medicamentos del formulario veterinario';
COMMENT ON COLUMN medications.active IS 'FALSE = medicamento descontinuado, no aparece en nuevas prescripciones';


-- =============================================================================
--  5. TABLA: prescriptions
--     Prescripciones emitidas a un paciente por un veterinario.
-- =============================================================================
CREATE TABLE prescriptions (
  id              BIGINT                PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  patient_id      BIGINT                NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  medication_id   BIGINT                NOT NULL REFERENCES medications(id) ON DELETE RESTRICT,
  vet_id          BIGINT                REFERENCES users(id) ON DELETE SET NULL,
  dose            VARCHAR(40)           NOT NULL,   -- Ej: "1.8 ml", "1 comprimido"
  frequency       VARCHAR(60)           NOT NULL,   -- Ej: "cada 12 horas"
  duration        VARCHAR(40)           NOT NULL,   -- Ej: "7 días", "indefinido"
  status          prescription_status   NOT NULL DEFAULT 'Activa',
  notes           TEXT,
  date            DATE                  NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ           NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ           NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  prescriptions               IS 'Prescripciones emitidas a pacientes';
COMMENT ON COLUMN prescriptions.vet_id        IS 'FK → users. SET NULL si el veterinario es eliminado';
COMMENT ON COLUMN prescriptions.medication_id IS 'FK → medications. RESTRICT: no se puede eliminar un medicamento con prescripciones activas';


-- =============================================================================
--  6. TABLA: appointments
--     Citas agendadas. Relaciona paciente, propietario y veterinario.
-- =============================================================================
CREATE TABLE appointments (
  id          BIGINT              PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  patient_id  BIGINT              NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  owner_id    BIGINT              REFERENCES owners(id) ON DELETE SET NULL,
  vet_id      BIGINT              REFERENCES users(id) ON DELETE SET NULL,
  date        DATE                NOT NULL,
  time        TIME                NOT NULL,
  type        appointment_type    NOT NULL DEFAULT 'General',
  status      appointment_status  NOT NULL DEFAULT 'Pendiente',
  notes       TEXT,
  created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  appointments          IS 'Citas agendadas en la clínica';
COMMENT ON COLUMN appointments.owner_id IS 'Desnormalización conveniente: evita JOIN extra para mostrar el nombre del propietario en la agenda';
COMMENT ON COLUMN appointments.vet_id   IS 'FK → users. SET NULL si el veterinario es eliminado';


-- =============================================================================
--  7. TABLA: clinical_notes
--     Historial clínico. Cada entrada es un evento médico asociado a un
--     paciente y un veterinario.
-- =============================================================================
CREATE TABLE clinical_notes (
  id          BIGINT       PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  patient_id  BIGINT       NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  vet_id      BIGINT       REFERENCES users(id) ON DELETE SET NULL,
  date        DATE         NOT NULL DEFAULT CURRENT_DATE,
  diagnosis   VARCHAR(120) NOT NULL,    -- Diagnóstico / motivo de consulta
  procedure   VARCHAR(200),             -- Procedimiento realizado
  notes       TEXT,                     -- Observaciones clínicas adicionales
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  clinical_notes           IS 'Historial clínico: una fila por evento médico';
COMMENT ON COLUMN clinical_notes.diagnosis IS 'Diagnóstico principal o motivo de consulta';
COMMENT ON COLUMN clinical_notes.procedure IS 'Descripción del procedimiento realizado';


-- =============================================================================
--  ÍNDICES
--  Cubren: FKs, búsquedas frecuentes y ordenación por fecha.
-- =============================================================================

-- users
CREATE INDEX idx_users_email  ON users(email)     WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role   ON users(role)      WHERE deleted_at IS NULL;

-- owners
CREATE INDEX idx_owners_email ON owners(email)     WHERE deleted_at IS NULL;
CREATE INDEX idx_owners_name  ON owners(full_name) WHERE deleted_at IS NULL;

-- patients
CREATE INDEX idx_patients_owner   ON patients(owner_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_patients_status  ON patients(status)   WHERE deleted_at IS NULL;
CREATE INDEX idx_patients_species ON patients(species)  WHERE deleted_at IS NULL;

-- medications
CREATE INDEX idx_medications_category ON medications(category) WHERE deleted_at IS NULL;

-- prescriptions
CREATE INDEX idx_rx_patient    ON prescriptions(patient_id);
CREATE INDEX idx_rx_medication ON prescriptions(medication_id);
CREATE INDEX idx_rx_vet        ON prescriptions(vet_id);
CREATE INDEX idx_rx_date       ON prescriptions(date DESC);
CREATE INDEX idx_rx_status     ON prescriptions(status);

-- appointments
CREATE INDEX idx_apts_patient ON appointments(patient_id);
CREATE INDEX idx_apts_owner   ON appointments(owner_id);
CREATE INDEX idx_apts_vet     ON appointments(vet_id);
CREATE INDEX idx_apts_date    ON appointments(date DESC, time);
CREATE INDEX idx_apts_status  ON appointments(status);

-- clinical_notes
CREATE INDEX idx_notes_patient ON clinical_notes(patient_id);
CREATE INDEX idx_notes_vet     ON clinical_notes(vet_id);
CREATE INDEX idx_notes_date    ON clinical_notes(date DESC);


-- =============================================================================
--  TRIGGERS — updated_at automático
--  Actualiza el campo updated_at en cada UPDATE sin necesidad de manejarlo
--  en la aplicación.
-- =============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_owners_updated_at
  BEFORE UPDATE ON owners
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_medications_updated_at
  BEFORE UPDATE ON medications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_prescriptions_updated_at
  BEFORE UPDATE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_clinical_notes_updated_at
  BEFORE UPDATE ON clinical_notes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- =============================================================================
--  ROW LEVEL SECURITY (RLS) — Supabase
--  Activar solo si usas Supabase Auth. Comentar si usas JWT propio.
-- =============================================================================

/*
ALTER TABLE users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners          ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients        ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_notes  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo usuarios autenticados pueden leer pacientes"
  ON patients FOR SELECT
  TO authenticated
  USING (true);
*/


-- =============================================================================
--  RESUMEN DEL MODELO
-- =============================================================================
--
--  users (1) ──────────────────────────── (N) prescriptions   [vet_id]
--  users (1) ──────────────────────────── (N) appointments    [vet_id]
--  users (1) ──────────────────────────── (N) clinical_notes  [vet_id]
--
--  owners (1) ─────────────────────────── (N) patients        [owner_id]
--  owners (1) ─────────────────────────── (N) appointments    [owner_id]
--
--  patients (1) ───────────────────────── (N) prescriptions   [patient_id]
--  patients (1) ───────────────────────── (N) appointments    [patient_id]
--  patients (1) ───────────────────────── (N) clinical_notes  [patient_id]
--
--  medications (1) ────────────────────── (N) prescriptions   [medication_id]
--
--  Total: 7 tablas | 6 ENUMs | 19 índices | 7 triggers | 1 función
--
-- =============================================================================
