import React, { useState, useEffect, useRef, useContext } from 'react';
import Navbar from '../components/Navbar';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import '../styles/finances.css';
import { ThemeContext } from '../contexts/ThemeContext';
import { getMembers } from '../utils/memberStorage';
import { getFinances, saveFinance } from '../utils/financeStorage';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Finances() {
  const [financialData, setFinancialData] = useState({
    totalBalance: 0,
    completedPayments: 0,
    totalAmountPaid: 0,
    totalExpenses: 0,
    totalFormFee: 0,
  });
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expense, setExpense] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState([]);

  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const members = getMembers();
    const expensesData = getFinances();

   
    const totalBalance = members.reduce((sum, member) => sum + Number(member.balance), 0);
    const totalAmountPaid = members.reduce((sum, member) => sum + Number(member.amountPaid), 0);
    const completedPayments = members.filter(member => 
      Number(member.amountToBePaid) === Number(member.amountPaid) && Number(member.balance) === 0
    ).length;
    const totalExpenses = expensesData.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const totalFormFee = members.reduce((sum, member) => sum + Number(member.formFee), 0);

    setFinancialData({
      
      totalBalance,
      completedPayments,
      totalAmountPaid,
      totalExpenses,
      totalFormFee,
    });

    setExpenses(expensesData);

    const currentPieChartRef = pieChartRef.current;
    const currentBarChartRef = barChartRef.current;
    return () => {
      if (currentPieChartRef) {
        currentPieChartRef.destroy();
      }
      if (currentBarChartRef) {
        currentBarChartRef.destroy();
      }
    };
  }, []);

  const pieChartData = {
    labels: ['Completed Payments', 'Pending Payments'],
    datasets: [
      {
        data: [financialData.completedPayments, getMembers().length - financialData.completedPayments],
        backgroundColor: ['#36A2EB', '#FFCE56'],
      },
    ],
  };

  const barChartData = {
    labels: expenses.map(expense => expense.expense),
    datasets: [
      {
        label: 'Expenses',
        data: expenses.map(expense => expense.amount),
        backgroundColor: '#FF6384',
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
      expense,
      amount: Number(amount),
      date: new Date().toISOString(),
    };
    saveFinance(newExpense);
    setExpenses([...expenses, newExpense]);
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
            <Bar ref={barChartRef} data={barChartData} options={chartOptions} />
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
