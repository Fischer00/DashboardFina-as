from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import Transaction, TransactionResponse
from .database import Database
from typing import List
from datetime import datetime

app = FastAPI()
db = Database()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializa o banco de dados
db.init_db()

@app.get("/api/balance")
async def get_balance():
    with db.get_cursor() as cursor:
        cursor.execute("""
            SELECT 
                COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
                COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expenses
            FROM transactions
        """)
        
        result = cursor.fetchone()
        income = float(result['income'])
        expenses = float(result['expenses'])
        
        return {
            "total": income - expenses,
            "income": income,
            "expenses": expenses
        }

@app.get("/api/transactions")
async def get_transactions():
    with db.get_cursor() as cursor:
        cursor.execute("""
            SELECT 
                id,
                amount,
                category,
                TO_CHAR(date, 'YYYY-MM-DD') as date,
                description,
                type
            FROM transactions
            ORDER BY date DESC
            LIMIT 10
        """)
        
        return cursor.fetchall()

@app.post("/api/transactions")
async def create_transaction(transaction: Transaction):
    with db.get_cursor() as cursor:
        cursor.execute("""
            INSERT INTO transactions (amount, category, date, description, type)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, amount, category, TO_CHAR(date, 'YYYY-MM-DD') as date, description, type
        """, (
            transaction.amount,
            transaction.category,
            transaction.date,
            transaction.description,
            transaction.type
        ))
        
        return cursor.fetchone()