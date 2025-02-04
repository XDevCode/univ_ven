const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Configuración de CORS y JSON
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta "frontend"
app.use(express.static(path.join(__dirname, "/docs")));

// Conexión a la base de datos SQLite
const db = new sqlite3.Database("./database.db");

// Endpoint para obtener todas las áreas
app.get("/api/areas", (req, res) => {
    const query = "SELECT * FROM areas";
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Endpoint para obtener carreras por área
app.get("/api/careers", (req, res) => {
    const areaId = req.query.area_id;
    if (!areaId) {
        return res.status(400).json({ error: "Se requiere el parámetro area_id" });
    }
    const query = "SELECT * FROM careers WHERE area_id = ?";
    db.all(query, [areaId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Endpoint para obtener universidades por carrera
app.get("/api/universities", (req, res) => {
    const careerId = req.query.career_id;
    if (!careerId) {
        return res.status(400).json({ error: "Se requiere el parámetro career_id" });
    }
    const query = `
        SELECT u.* FROM universities u
        JOIN career_university cu ON u.id = cu.university_id
        WHERE cu.career_id = ?
    `;
    db.all(query, [careerId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Ruta para servir el archivo HTML principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/docs/index.html"));
});

// Ruta para servir la página de carreras
app.get("/area", (req, res) => {
    res.sendFile(path.join(__dirname, "/docs/index.html"));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});