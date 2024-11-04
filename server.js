const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3003; 

// Dados de LEDs armazenados em memória
let leds = [
  { nome: "Sala", status: 0 }, // 0 para desligada, 1 para ligada
  { nome: "Quarto 1", status: 0 },
  { nome: "Quarto 2", status: 0 },
  { nome: "Banheiro", status: 0 },
  { nome: "Garagem", status: 0 },
  { nome: "Alarme", status: 0 },
  { nome: "Luzes Externas", status: 0 }
];

// Middleware para monitorar requisições
app.use((req, res, next) => {
  console.log(`Método: ${req.method}, Rota: ${req.url}`);
  next();
});

// Habilita CORS
app.use(cors()); 
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Para servir arquivos estáticos

// Rota para obter o estado das LEDs
app.get("/api/leds", (req, res) => {
  try {
    res.json(leds); // Enviando os dados armazenados
  } catch (error) {
    console.error("Erro ao enviar dados das LEDs:", error);
    res.status(500).json({ message: "Erro no servidor ao obter dados das LEDs." });
  }
});

// Rota para adicionar uma nova LED
app.post("/api/leds", (req, res) => {
  try {
    const { nome, status } = req.body;

    // Validação dos dados recebidos
    if (typeof nome !== "string" || nome.trim() === "") {
      return res.status(400).json({ message: "Nome inválido fornecido." });
    }
    if (typeof status !== "number" || (status !== 0 && status !== 1)) {
      return res.status(400).json({ message: "Status inválido fornecido. Deve ser 0 ou 1." });
    }

    // Verifica se a LED já existe
    const ledExistente = leds.find((led) => led.nome === nome);
    if (ledExistente) {
      return res.status(400).json({ message: "LED já existe." });
    }

    // Adiciona a nova LED ao array
    leds.push({ nome, status });
    res.status(201).json({ message: "LED adicionada com sucesso!", led: { nome, status } });
  } catch (error) {
    console.error("Erro ao adicionar LED:", error);
    res.status(500).json({ message: "Erro no servidor ao adicionar LED." });
  }
});

// Rota para atualizar o estado de uma LED
app.put("/api/leds/:nome", (req, res) => {
  try {
    const nome = req.params.nome;
    const { status } = req.body;

    // Validação do status recebido
    if (typeof status !== "number" || (status !== 0 && status !== 1)) {
      return res.status(400).json({ message: "Status inválido fornecido. Deve ser 0 ou 1." });
    }

    const led = leds.find((led) => led.nome === nome);
    if (led) {
      led.status = status; // Atualiza o estado da LED
      res.json({
        message: `LED ${nome} atualizada para ${status ? "ligada" : "desligada"}`,
        led,
      });
    } else {
      res.status(404).json({ message: "LED não encontrada." });
    }
  } catch (error) {
    console.error(`Erro ao atualizar LED:`, error);
    res.status(500).json({ message: "Erro no servidor ao atualizar LED." });
  }
});

// Rota para deletar uma LED
app.delete('/api/leds/:nome', (req, res) => {
  try {
    const nome = req.params.nome; // Nome da LED a ser deletada

    // Encontra o índice da LED na lista
    const index = leds.findIndex(led => led.nome === nome);
    if (index !== -1) {
      leds.splice(index, 1); // Remove a LED do array
      res.json({ message: `LED ${nome} deletada com sucesso.` });
    } else {
      res.status(404).json({ message: 'LED não encontrada.' });
    }
  } catch (error) {
    console.error('Erro ao deletar LED:', error);
    res.status(500).json({ message: 'Erro no servidor ao deletar LED.' });
  }
});

// Rota para lidar com rotas de API não encontradas
app.all("/api/*", (req, res) => {
  res.status(404).json({ message: "Rota de API não encontrada." });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
