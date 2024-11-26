import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardCard } from './components/DashboardCard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { ExpenseChart } from './components/ExpenseChart';
import { Transaction, Balance, Category } from './types/finance';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({ total: 0, income: 0, expenses: 0 });
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchData = async () => {
    try {
      const [transactionsRes, balanceRes] = await Promise.all([
        axios.get('http://localhost:3000/api/transactions'),
        axios.get('http://localhost:3000/api/balance')
      ]);

      setTransactions(transactionsRes.data);
      setBalance(balanceRes.data);

      // Calcular categorias para o gráfico
      const expensesByCategory = transactionsRes.data
        .filter((t: Transaction) => t.type === 'expense')
        .reduce((acc: any, curr: Transaction) => {
          acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
          return acc;
        }, {});

      const totalExpenses = Object.values(expensesByCategory).reduce((a: any, b: any) => a + b, 0);
      
      const categoryData = Object.entries(expensesByCategory).map(([name, total]) => ({
        name,
        total: total as number,
        percentage: ((total as number) / totalExpenses) * 100
      }));

      setCategories(categoryData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTransactionSubmit = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      await axios.post('http://localhost:3000/api/transactions', transaction);
      fetchData();
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gerenciamento Financeiro</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Saldo Total"
            amount={balance.total}
            trend={10}
            type="balance"
          />
          <DashboardCard
            title="Receitas"
            amount={balance.income}
            trend={5}
            type="income"
          />
          <DashboardCard
            title="Despesas"
            amount={balance.expenses}
            trend={-2}
            type="expense"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <TransactionForm onSubmit={handleTransactionSubmit} />
            <TransactionList transactions={transactions} />
          </div>
          <ExpenseChart categories={categories} />
        </div>
      </div>
    </div>
  );
}

export default App;