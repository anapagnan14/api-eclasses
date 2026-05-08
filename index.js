const express = require('express');
const app = express();
app.use(express.json());

// ================================
// SIMULAÇÃO DE BANCO DE DADOS LOCAL
// ================================

let users = [
  { id: 1, name: "Eduardo Virmond", email: "eduardo@example.com", role: "teacher", created_at: new Date() },
  { id: 2, name: "Bryam Assolini", email: "bryam@example.com", role: "student", created_at: new Date() }
];

let classes = [
  { id: 1, name: "Banco de Dados", description: "3º Ano C - Técnico Desenvolvimento de Sistemas", teacher_id: 1 },
  { id: 2, name: "Programação Back-End", description: "3º Ano C - Médio Integrado", teacher_id: 1 }
];

let enrollments = [
  { id: 1, user_id: 2, class_id: 1 },
  { id: 2, user_id: 2, class_id: 2 }
];

let items = [
  { id: 1, name: "Livro de BD", quantity: 5, available: 5 },
  { id: 2, name: "Notebook", quantity: 3, available: 2 }
];

let loans = [
  { id: 1, user_id: 2, item_id: 1, loan_date: new Date(), return_date: null, status: "borrowed" }
];

// ================================
// ROTAS DE TESTE
// ================================

// Rota raiz
app.get('/', (req, res) => {
  res.send('Bem-vindo à API E-Classes! Teste as rotas /users, /classes, /enrollments, /items e /loans.');
});

// ================================
// ROTAS DE USUÁRIOS
// ================================
app.get('/users', (req, res) => res.json(users));

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  res.json(user);
});

app.post('/users', (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email || !role) return res.status(400).json({ error: "Nome, email e role são obrigatórios" });

  const newUser = { id: users.length ? users[users.length - 1].id + 1 : 1, name, email, role, created_at: new Date() };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  const { name, email, role } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;

  res.json(user);
});

app.delete('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Usuário não encontrado" });
  const [removed] = users.splice(index, 1);
  res.json(removed);
});

// ================================
// ROTAS DE CLASSES
// ================================
app.get('/classes', (req, res) => res.json(classes));

app.post('/classes', (req, res) => {
  const { name, description, teacher_id } = req.body;
  if (!name || !teacher_id) return res.status(400).json({ error: "Nome e teacher_id são obrigatórios" });

  const newClass = { id: classes.length ? classes[classes.length - 1].id + 1 : 1, name, description, teacher_id };
  classes.push(newClass);
  res.status(201).json(newClass);
});

// ================================
// ROTAS DE INSCRIÇÕES (ENROLLMENTS)
// ================================
app.get('/enrollments', (req, res) => res.json(enrollments));

app.post('/enrollments', (req, res) => {
  const { user_id, class_id } = req.body;
  if (!user_id || !class_id) return res.status(400).json({ error: "user_id e class_id são obrigatórios" });

  const newEnrollment = { id: enrollments.length ? enrollments[enrollments.length - 1].id + 1 : 1, user_id, class_id };
  enrollments.push(newEnrollment);
  res.status(201).json(newEnrollment);
});

// ================================
// ROTAS DE ITENS
// ================================
app.get('/items', (req, res) => res.json(items));

app.post('/items', (req, res) => {
  const { name, quantity, available } = req.body;
  if (!name) return res.status(400).json({ error: "Nome é obrigatório" });

  const newItem = { id: items.length ? items[items.length - 1].id + 1 : 1, name, quantity: quantity || 1, available: available || 1 };
  items.push(newItem);
  res.status(201).json(newItem);
});

// ================================
// ROTAS DE EMPRÉSTIMOS (LOANS)
// ================================
app.get('/loans', (req, res) => res.json(loans));

app.post('/loans', (req, res) => {
  const { user_id, item_id } = req.body;
  if (!user_id || !item_id) return res.status(400).json({ error: "user_id e item_id são obrigatórios" });

  const newLoan = { id: loans.length ? loans[loans.length - 1].id + 1 : 1, user_id, item_id, loan_date: new Date(), return_date: null, status: "borrowed" };
  loans.push(newLoan);
  res.status(201).json(newLoan);
});

app.put('/loans/:id/return', (req, res) => {
  const loan = loans.find(l => l.id === parseInt(req.params.id));
  if (!loan) return res.status(404).json({ error: "Empréstimo não encontrado" });

  loan.return_date = new Date();
  loan.status = "returned";
  res.json(loan);
});

// ================================
// INICIANDO O SERVIDOR
// ================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
