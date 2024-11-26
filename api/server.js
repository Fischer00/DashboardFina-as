import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'finance',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Inicializar banco de dados
async function initDB() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        description VARCHAR(200) NOT NULL,
        type ENUM('income', 'expense') NOT NULL
      )
    `);
  } finally {
    connection.release();
  }
}

initDB();

// Rotas
app.get('/api/balance', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expenses
      FROM transactions
    `);
    
    const result = rows[0];
    res.json({
      total: result.income - result.expenses,
      income: result.income,
      expenses: result.expenses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM transactions 
      ORDER BY date DESC 
      LIMIT 10
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  const { amount, category, date, description, type } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO transactions (amount, category, date, description, type) VALUES (?, ?, ?, ?, ?)',
      [amount, category, date, description, type]
    );
    
    const [newTransaction] = await pool.query(
      'SELECT * FROM transactions WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newTransaction[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});