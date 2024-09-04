import React, { useContext, useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../contexts/ThemeContext';
import { getMembers, saveMembers } from '../utils/memberStorage';
import '../styles/receipts.css';

function ReceiptManager() {
  const { theme } = useContext(ThemeContext);
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  const loadMembers = useCallback(() => {
    const storedMembers = getMembers();
    setMembers(storedMembers);
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const filteredMembers = members.filter(member => 
    member.fullName.toLowerCase().replace(/\s+/g, '').includes(searchTerm.toLowerCase().replace(/\s+/g, '')) ||
    member.groupName.toLowerCase().replace(/\s+/g, '').includes(searchTerm.toLowerCase().replace(/\s+/g, ''))
  );

  const handleCardClick = (member) => {
    setSelectedMember(member);
  };

  const handleClosePopup = () => {
    setSelectedMember(null);
  };

  const handleSavePayment = (updatedMember) => {
    const updatedMembers = members.map(m => 
      m.projectId === updatedMember.projectId ? updatedMember : m
    );
    setMembers(updatedMembers);
    saveMembers(updatedMembers);
    setSelectedMember(null);
  };

  return (
    <div className={`receipts-page ${theme}`}>
      <Navbar />
      <main>
        <h1>Receipts Manager</h1>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search by member name or group..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="receipts-list">
          {filteredMembers.map((member) => (
            <div key={member.projectId} className="receipt-card" onClick={() => handleCardClick(member)}>
              <h2>{member.fullName}</h2>
              <p><strong>Group:</strong> {member.groupName}</p>
              <p><strong>Contact:</strong> {member.contact}</p>
              <p><strong>Receipt ID:</strong> {member.projectId}</p>
              <p><strong>Seedlings:</strong> {member.varietyOfSeedlings} ({member.numberOfSeedlingsOrdered})</p>
              <p><strong>Amount to be Paid:</strong> Ksh {member.amountToBePaid}</p>
              <p><strong>Amount Paid:</strong> Ksh {member.amountPaid}</p>
              <p><strong>Deposit Paid:</strong> Ksh {member.depositPaid}</p>
              <p><strong>Balance:</strong> Ksh {member.balance}</p>
              <p><strong>Payment Date:</strong> {member.dateOfPayment}</p>
              <p><strong>Complete Payment By:</strong> {member.dateToCompletePayment}</p>
            </div>
          ))}
        </div>
      </main>
      {selectedMember && (
        <PaymentPopup 
          member={selectedMember} 
          onSave={handleSavePayment} 
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}

function PaymentPopup({ member, onSave, onClose }) {
  const [payments, setPayments] = useState(member.payments || [
    {
      amount: member.amountPaid,
      date: member.dateOfPayment,
      receiptNo: 'R001',
      balance: member.balance
    }
  ]);

  const handleAddPayment = () => {
    setPayments([...payments, { amount: '', date: '', receiptNo: '', balance: '' }]);
  };

  const handlePaymentChange = (index, field, value) => {
    const updatedPayments = payments.map((payment, i) => 
      i === index ? { ...payment, [field]: value } : payment
    );
    setPayments(updatedPayments);
  };

  const handleSave = () => {
    const updatedMember = {
      ...member,
      payments: payments,
      amountPaid: payments.reduce((sum, payment) => sum + Number(payment.amount), 0),
      balance: payments[payments.length - 1].balance
    };
    onSave(updatedMember);
  };

  return (
    <div className="payment-popup-overlay">
      <div className="payment-popup">
        <h2>{member.fullName} - Payments</h2>
        <table>
          <thead>
            <tr>
              <th>Amount Paid</th>
              <th>Date of Payment</th>
              <th>Receipt No</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index}>
                <td>
                  <input 
                    type="number" 
                    value={payment.amount} 
                    onChange={(e) => handlePaymentChange(index, 'amount', e.target.value)}
                    readOnly={index === 0}
                  />
                </td>
                <td>
                  <input 
                    type="date" 
                    value={payment.date} 
                    onChange={(e) => handlePaymentChange(index, 'date', e.target.value)}
                    readOnly={index === 0}
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    value={payment.receiptNo} 
                    onChange={(e) => handlePaymentChange(index, 'receiptNo', e.target.value)}
                    readOnly={index === 0}
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    value={payment.balance} 
                    onChange={(e) => handlePaymentChange(index, 'balance', e.target.value)}
                    readOnly={index === 0}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleAddPayment}>Add Payment</button>
        <div className="popup-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default ReceiptManager;