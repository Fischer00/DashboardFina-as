export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
}

export interface Balance {
  total: number;
  income: number;
  expenses: number;
}

export interface Category {
  name: string;
  total: number;
  percentage: number;
}