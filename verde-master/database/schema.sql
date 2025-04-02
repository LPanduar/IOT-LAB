-- Esquema de base de datos para MySQL Workbench

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS sistema_monitoreo_agricola;
USE sistema_monitoreo_agricola;

-- Tabla para almacenar datos históricos de sensores
CREATE TABLE IF NOT EXISTS datos_historicos (
                                                id INT AUTO_INCREMENT PRIMARY KEY,
                                                temperatura DECIMAL(5,2) NOT NULL,
    humedad DECIMAL(5,2) NOT NULL,
    velocidad_viento DECIMAL(5,2) NOT NULL,
    radiacion_solar DECIMAL(6,2) NOT NULL,
    presion DECIMAL(6,2) NOT NULL,
    nivel_co2 DECIMAL(6,2) NOT NULL,
    probabilidad_lluvia DECIMAL(5,2) NOT NULL,
    consumo_energia DECIMAL(6,2) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_fecha (fecha_registro)
    );

-- Tabla para almacenar información de parcelas
CREATE TABLE IF NOT EXISTS parcelas (
                                        id INT PRIMARY KEY,
                                        nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    responsable VARCHAR(100) NOT NULL,
    tipo_cultivo VARCHAR(100) NOT NULL,
    ultimo_riego DATETIME NOT NULL,
    latitud DECIMAL(10,6),
    longitud DECIMAL(10,6),
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Tabla para almacenar datos de sensores por parcela
CREATE TABLE IF NOT EXISTS sensores_parcela (
                                                id INT AUTO_INCREMENT PRIMARY KEY,
                                                parcela_id INT NOT NULL,
                                                temperatura DECIMAL(5,2) NOT NULL,
    humedad DECIMAL(5,2) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parcela_id) REFERENCES parcelas(id),
    INDEX idx_parcela_fecha (parcela_id, fecha_registro)
    );

-- Tabla para almacenar parcelas eliminadas
CREATE TABLE IF NOT EXISTS parcelas_eliminadas (
                                                   id INT PRIMARY KEY,
                                                   nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    responsable VARCHAR(100) NOT NULL,
    tipo_cultivo VARCHAR(100) NOT NULL,
    ultimo_riego DATETIME NOT NULL,
    latitud DECIMAL(10,6),
    longitud DECIMAL(10,6),
    ultima_temperatura DECIMAL(5,2),
    ultima_humedad DECIMAL(5,2),
    fecha_eliminacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Procedimiento almacenado para registrar una parcela eliminada
DELIMITER //
CREATE PROCEDURE registrar_parcela_eliminada(IN p_id INT)
BEGIN
    DECLARE v_temp DECIMAL(5,2);
    DECLARE v_hum DECIMAL(5,2);

    -- Obtener los últimos datos de sensores para esta parcela
SELECT temperatura, humedad INTO v_temp, v_hum
FROM sensores_parcela
WHERE parcela_id = p_id
ORDER BY fecha_registro DESC
    LIMIT 1;

-- Insertar en la tabla de parcelas eliminadas
INSERT INTO parcelas_eliminadas (
    id, nombre, ubicacion, responsable, tipo_cultivo,
    ultimo_riego, latitud, longitud,
    ultima_temperatura, ultima_humedad
)
SELECT
    id, nombre, ubicacion, responsable, tipo_cultivo,
    ultimo_riego, latitud, longitud,
    v_temp, v_hum
FROM parcelas
WHERE id = p_id;

-- Marcar como inactiva en la tabla principal
UPDATE parcelas SET activa = FALSE WHERE id = p_id;
END //
DELIMITER ;

-- Trigger para detectar cambios en los datos de sensores
DELIMITER //
CREATE TRIGGER verificar_cambios_sensores
    BEFORE INSERT ON datos_historicos
    FOR EACH ROW
BEGIN
    DECLARE v_ultimo_temp DECIMAL(5,2);
    DECLARE v_ultimo_hum DECIMAL(5,2);
    DECLARE v_ultimo_lluvia DECIMAL(5,2);
    DECLARE v_ultimo_sol DECIMAL(6,2);

    -- Obtener los últimos valores registrados
    SELECT temperatura, humedad, probabilidad_lluvia, radiacion_solar
    INTO v_ultimo_temp, v_ultimo_hum, v_ultimo_lluvia, v_ultimo_sol
    FROM datos_historicos
    ORDER BY fecha_registro DESC
        LIMIT 1;

    -- Si no hay cambios significativos, cancelar la inserción
    IF (ABS(NEW.temperatura - v_ultimo_temp) < 0.5 AND
        ABS(NEW.humedad - v_ultimo_hum) < 1.0 AND
        ABS(NEW.probabilidad_lluvia - v_ultimo_lluvia) < 1.0 AND
        ABS(NEW.radiacion_solar - v_ultimo_sol) < 5.0) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No hay cambios significativos en los datos';
END IF;
END //
DELIMITER ;

-- Índices para optimizar consultas
CREATE INDEX idx_parcelas_activas ON parcelas(activa);
CREATE INDEX idx_datos_historicos_fecha ON datos_historicos(fecha_registro);
CREATE INDEX idx_sensores_parcela_id ON sensores_parcela(parcela_id);

