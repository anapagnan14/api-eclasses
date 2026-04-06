const express = require('express');
const app = express();

// Simulando um "banco de dados" com um array
let usuarios = [
  { id: 1, nome: 'João', email: 'joao@email.com' },
  { id: 2, nome: 'Maria', email: 'maria@email.com' }
];

// Middleware para permitir requisições com corpo JSON
app.use(express.json());

// Rota raiz (GET /)
app.get('/', (req, res) => {
  res.send(`Bem vindo a API e-class, existem ${usuarios.length} usuários cadastrados!`);
});

// Rota para pegar todos os usuários (GET /usuarios)
app.get('/usuarios', (req, res) => {
  res.json(usuarios);
});

// Rota para pegar um usuário por nome (GET /usuarios/nome/:nome)
app.get('/usuarios/nome/:nome', (req, res) => {
  const nome = req.params.nome.toLowerCase();
  const usuario = usuarios.filter(u => u.nome.toLowerCase().includes(nome));
  
  if (usuario.length === 0) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }
  res.json(usuario);
});

// Rota para criar um novo usuário (POST /usuarios)
app.post('/usuarios', (req, res) => {
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
  }

  const novoUsuario = {
    id: usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1,
    nome,
    email
  };

  usuarios.push(novoUsuario);

  res.status(201).json(novoUsuario);
});

// Rota para atualizar um usuário (PUT /usuarios/:id)
app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;

  const usuario = usuarios.find(u => u.id === parseInt(id));

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }

  if (nome) usuario.nome = nome;
  if (email) usuario.email = email;

  res.json(usuario);
});

// Rota para deletar um usuário (DELETE /usuarios/:id)
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;

  const index = usuarios.findIndex(u => u.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }

  const [removido] = usuarios.splice(index, 1);
  res.json(removido);
});

// Inicializando o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});