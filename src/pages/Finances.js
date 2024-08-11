import React, { useState, useEffect, useRef, useContext } from 'react';
import Navbar from '../components/Navbar';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import '../styles/finances.css';
import { ThemeContext } from '../contexts/ThemeContext';
import { getMembers } from '../utils/memberStorage';
import { getFinances, saveFinance } from '../utils/financeStorage';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



function Finances() {
  const [financialData, setFinancialData] = useState({
    totalBalance: 0,
    completedPayments: 0,
    incompletePayments: 0,
    totalAmountPaid: 0,
    totalExpenses: 0,
    totalFormFee: 0,
  });
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expense, setExpense] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState({});

  const pieChartRef = useRef(null);
  const expensePieChartRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const members = getMembers();
    const expensesData = getFinances();

    const totalBalance = members.reduce((sum, member) => sum + Number(member.balance), 0);
    const totalAmountPaid = members.reduce((sum, member) => sum + Number(member.amountPaid), 0);
    const completedPayments = members.filter(member => 
      Number(member.amountToBePaid) === Number(member.amountPaid) && Number(member.balance) === 0
    ).length;
    const incompletePayments = members.length - completedPayments;
    const totalFormFee = members.reduce((sum, member) => sum + Number(member.formFee), 0);

    const aggregatedExpenses = expensesData.reduce((acc, expense) => {
      const key = expense.expense.toLowerCase();
      acc[key] = (acc[key] || 0) + Number(expense.amount);
      return acc;
    }, {});

    const totalExpenses = Object.values(aggregatedExpenses).reduce((sum, amount) => sum + amount, 0);

    setFinancialData({
      totalBalance,
      completedPayments,
      incompletePayments,
      totalAmountPaid,
      totalExpenses,
      totalFormFee,
    });

    setExpenses(aggregatedExpenses);

    const currentPieChartRef = pieChartRef.current;
    const currentExpensePieChartRef = expensePieChartRef.current;
    return () => {
      if (currentPieChartRef) {
        currentPieChartRef.destroy();
      }
      if (currentExpensePieChartRef) {
        currentExpensePieChartRef.destroy();
      }
    };
  }, []);

  const pieChartData = {
    labels: ['Completed Payments', 'Incomplete Payments'],
    datasets: [
      {
        data: [financialData.completedPayments, financialData.incompletePayments],
        backgroundColor: ['#36A2EB', '#FFCE56'],
      },
    ],
  };

  const expensePieChartData = {
    labels: Object.keys(expenses),
    datasets: [
      {
        data: Object.values(expenses),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? '#f8f9fa' : '#495057',
        },
      },
    },
  };

  const handleSaveExpense = () => {
    const newExpense = {
      expense: expense.trim().toLowerCase(),
      amount: Number(amount),
      date: new Date().toISOString(),
    };
    saveFinance(newExpense);
    setExpenses(prevExpenses => {
      const updatedExpenses = { ...prevExpenses };
      updatedExpenses[newExpense.expense] = (updatedExpenses[newExpense.expense] || 0) + newExpense.amount;
      return updatedExpenses;
    });
    setFinancialData(prevData => ({
      ...prevData,
      totalExpenses: prevData.totalExpenses + Number(amount)
    }));
    setShowExpenseForm(false);
    setExpense('');
    setAmount('');
  };

  return (
    <div className={`finances-page ${theme}`}>
      <Navbar />
      <main>
        <h1>Finances</h1>
        <div className="cards-container">
          <div className="card">
            <div className="title">Total Balance</div>
            <div className="value">KSh {financialData.totalBalance.toLocaleString()}</div>
          </div>
          <div className="card">
            <div className="title">Completed Payments</div>
            <div className="value">{financialData.completedPayments}</div>
          </div>
          <div className="card">
            <div className="title">Incomplete Payments</div>
            <div className="value">{financialData.incompletePayments}</div>
          </div>
          <div className="card">
            <div className="title">Total Amount Paid</div>
            <div className="value">KSh {financialData.totalAmountPaid.toLocaleString()}</div>
          </div>
          <div className="card" onClick={() => setShowExpenseForm(true)}>
            <div className="title">Expenses</div>
            <div className="value">KSh {financialData.totalExpenses.toLocaleString()}</div>
          </div>
          <div className="card">
            <div className="title">Total Form Fee</div>
            <div className="value">KSh {financialData.totalFormFee.toLocaleString()}</div>
          </div>
        </div>
        <div className="charts-container">
          <div className="chart-small">
            <h2>Payment Status</h2>
            <Pie ref={pieChartRef} data={pieChartData} options={chartOptions} />
          </div>
          <div className="chart-small">
            <h2>Expenses</h2>
            <Pie ref={expensePieChartRef} data={expensePieChartData} options={chartOptions} />
          </div>
        </div>
      </main>
      {showExpenseForm && (
        <div className="expense-form-popup">
          <h2>Add Expense</h2>
          <input
            type="text"
            placeholder="Expense"
            value={expense}
            onChange={(e) => setExpense(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={handleSaveExpense}>Save</button>
          <button onClick={() => setShowExpenseForm(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Finances;
