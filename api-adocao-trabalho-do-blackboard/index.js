const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json()); 
app.use(express.static('.')); // Permite servir o index.html e script.js

const FILE_PATH = './animais67.json';

// Ler dados do arquivo JSON
const lerDados = () => {
    const dados = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(dados);
};

// Salvar dados no arquivo JSON
const salvarDados = (dados) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(dados, null, 2));
};

// Middleware de Validação dos campos do agendamento
const validarAgendamento = (req, res, next) => {
    const { nomePet, tipo, servico } = req.body;
    
    if (!nomePet || !tipo || !servico) {
        return res.status(400).json({ 
            erro: "Os campos 'Nome do Pet', 'Tipo' e 'Serviço' são obrigatórios!" 
        });
    }

    if (tipo !== 'cachorro' && tipo !== 'gato') {
        return res.status(400).json({ 
            erro: "O Pet-Shop67 atende APENAS cachorros e gatos." 
        });
    }

    next();
};

// ==========================================
// ROTAS DA API (PET-SHOP67)
// ==========================================

// 1. LISTAR AGENDAMENTOS (GET)
app.get('/agendamentos', (req, res) => {
    const agendamentos = lerDados();
    res.status(200).json(agendamentos);
});

// 2. BUSCAR AGENDAMENTO POR ID (GET)
app.get('/agendamentos/:id', (req, res) => {
    const agendamentos = lerDados();
    const item = agendamentos.find(a => a.id === req.params.id);

    if (!item) {
        return res.status(404).json({ erro: "Agendamento não encontrado." });
    }
    res.status(200).json(item);
});

// 3. CRIAR NOVO AGENDAMENTO (POST)
app.post('/agendamentos', validarAgendamento, (req, res) => {
    const agendamentos = lerDados();
    const { nomePet, tipo, servico, observacoes } = req.body;

    const novoAgendamento = {
        id: Date.now().toString(),
        nomePet: nomePet,
        tipo: tipo,
        servico: servico,
        observacoes: observacoes || "Nenhuma observação informada."
    };

    agendamentos.push(novoAgendamento);
    salvarDados(agendamentos);

    res.status(201).json({ mensagem: "Serviço agendado com sucesso!", agendamento: novoAgendamento });
});

// 4. ATUALIZAR AGENDAMENTO (PUT)
app.put('/agendamentos/:id', validarAgendamento, (req, res) => {
    const agendamentos = lerDados();
    const index = agendamentos.findIndex(a => a.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ erro: "Agendamento não encontrado para atualização." });
    }

    const { nomePet, tipo, servico, observacoes } = req.body;

    agendamentos[index] = {
        id: req.params.id,
        nomePet: nomePet,
        tipo: tipo,
        servico: servico,
        observacoes: observacoes || "Nenhuma observação informada."
    };

    salvarDados(agendamentos);
    res.status(200).json({ mensagem: "Agendamento atualizado com sucesso!", agendamento: agendamentos[index] });
});

// 5. CANCELAR/EXCLUIR AGENDAMENTO (DELETE)
app.delete('/agendamentos/:id', (req, res) => {
    let agendamentos = lerDados();
    const index = agendamentos.findIndex(a => a.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ erro: "Agendamento não encontrado." });
    }

    agendamentos = agendamentos.filter(a => a.id !== req.params.id);
    salvarDados(agendamentos);

    res.status(200).json({ mensagem: "Agendamento cancelado com sucesso!" });
});

// Servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Pet-Shop67 rodando com sucesso na porta ${PORT}`);
});