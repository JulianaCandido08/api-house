import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";  // Importando fileURLToPath do módulo 'url'
import { dirname } from "path";  // Importando dirname de 'path'

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 3003;

// Conectar ao banco de dados SQLite
const dbPath = process.env.DB_PATH || path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao abrir o banco de dados:", err.message);
    process.exit(1); // Encerra o servidor caso haja erro na conexão com o banco
  } else {
    console.log("Banco de dados conectado com sucesso!");
    db.run(
      `CREATE TABLE IF NOT EXISTS leds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        status INTEGER NOT NULL DEFAULT 0
      );`,
      (err) => {
        if (err) {
          console.error("Erro ao criar a tabela:", err.message);
          process.exit(1); // Encerra o servidor caso a tabela não possa ser criada
        }
      }
    );
  }
});

// Middleware para monitorar requisições
app.use((req, res, next) => {
  console.log(`Método: ${req.method}, Rota: ${req.url}`);
  next();
});

// Habilita CORS
app.use(cors());
app.use(bodyParser.json());

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

// Rota para obter o estado das LEDs
app.get("/api/leds", (req, res) => {
  db.all("SELECT id, nome, status FROM leds", [], (err, rows) => {
    if (err) {
      console.error("Erro ao obter LEDs do banco:", err.message);
      return res
        .status(500)
        .json({ message: "Erro no servidor ao obter dados das LEDs." });
    }
    res.json(rows);
  });
});

// Rota para adicionar uma nova LED
app.post("/api/leds", (req, res) => {
  const { nome, status } = req.body;

  if (typeof nome !== "string" || nome.trim() === "") {
    return res.status(400).json({ message: "Nome inválido fornecido." });
  }
  if (typeof status !== "number" || (status !== 0 && status !== 1)) {
    return res
      .status(400)
      .json({ message: "Status inválido fornecido. Deve ser 0 ou 1." });
  }

  db.get("SELECT id FROM leds WHERE nome = ?", [nome], (err, row) => {
    if (err) {
      console.error("Erro ao verificar LED existente:", err.message);
      return res
        .status(500)
        .json({ message: "Erro ao verificar a LED no banco." });
    }
    if (row) {
      return res.status(400).json({ message: "LED já existe." });
    }

    db.run(
      "INSERT INTO leds (nome, status) VALUES (?, ?)",
      [nome, status],
      function (err) {
        if (err) {
          console.error("Erro ao adicionar LED:", err.message);
          return res
            .status(500)
            .json({ message: "Erro ao adicionar LED no banco." });
        }
        res.status(201).json({
          message: "LED adicionada com sucesso!",
          led: { id: this.lastID, nome, status },
        });
      }
    );
  });
});

// Rota para atualizar o estado de uma LED
app.put("/api/leds/:nome", (req, res) => {
  const nome = req.params.nome;
  const { status } = req.body;

  if (typeof status !== "number" || (status !== 0 && status !== 1)) {
    return res
      .status(400)
      .json({ message: "Status inválido fornecido. Deve ser 0 ou 1." });
  }

  // Verificar se a LED existe no banco
  db.get("SELECT id FROM leds WHERE nome = ?", [nome], (err, row) => {
    if (err) {
      console.error("Erro ao verificar LED:", err.message);
      return res.status(500).json({ message: "Erro ao verificar a LED no banco." });
    }
    if (!row) {
      return res.status(404).json({ message: "LED não encontrada." });
    }

    // Atualizar o estado da LED
    db.run(
      "UPDATE leds SET status = ? WHERE nome = ?",
      [status, nome],
      function (err) {
        if (err) {
          console.error("Erro ao atualizar LED:", err.message);
          return res
            .status(500)
            .json({ message: "Erro ao atualizar LED no banco." });
        }
        res.json({
          message: `LED ${nome} atualizada para ${
            status ? "ligada" : "desligada"
          }`,
          led: { nome, status },
        });
      }
    );
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
