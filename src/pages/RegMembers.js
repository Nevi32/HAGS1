import React, { useContext, useState } from 'react';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../contexts/ThemeContext';
import { saveNewMember } from '../utils/memberStorage';
import '../styles/regmembers.css';

function RegMembers() {
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    contact: '',
    status: '',
    groupName: '',
    memberUniqueId: '',
    dateOfAdmission: '',
    nextOfKin: '',
    nextOfKinContact: '',
    varietyOfSeedlings: '',
    numberOfSeedlingsOrdered: '',
    amountToBePaid: '',
    depositPaid: '',
    balance: '',
    dateOfPayment: '',
    dateToCompletePayment: '',
    amountPaid: '',
    formFee: '',
    county: '',
    subCounty: '',
    ward: '',
    location: '',
    subLocation: '',
    village: ''
  });

  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      saveNewMember(formData);
      setPopup({ show: true, message: 'Member registered successfully!', type: 'success' });
      // Reset form after submission
      setFormData({
        fullName: '',
        nationalId: '',
        contact: '',
        status: '',
        groupName: '',
        memberUniqueId: '',
        dateOfAdmission: '',
        nextOfKin: '',
        nextOfKinContact: '',
        varietyOfSeedlings: '',
        numberOfSeedlingsOrdered: '',
        amountToBePaid: '',
        depositPaid: '',
        balance: '',
        dateOfPayment: '',
        dateToCompletePayment: '',
        amountPaid: '',
        formFee: '',
        county: '',
        subCounty: '',
        ward: '',
        location: '',
        subLocation: '',
        village: ''
      });
    } catch (error) {
      setPopup({ show: true, message: 'Error registering member. Please try again.', type: 'error' });
    }
    setTimeout(() => setPopup({ show: false, message: '', type: '' }), 3000);
  };

  return (
    <div className={`reg-members-page ${theme}`}>
      <Navbar />
      <main>
        <h1>Register Members</h1>
       
        {popup.show && (
          <div className={`popup ${popup.type}`}>
            {popup.message}
          </div>
        )}

        <form className="registration-form" onSubmit={handleSubmit}>
          <section>
            <h2>Personal Information</h2>
            <label>
              Full Name:
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </label>
            <label>
              National ID:
              <input type="text" name="nationalId" value={formData.nationalId} onChange={handleChange} required />
            </label>
            <label>
              Contact:
              <input type="tel" name="contact" value={formData.contact} onChange={handleChange} required />
            </label>
            <label>
              Status:
              <input type="text" name="status" value={formData.status} onChange={handleChange} required />
            </label>
            <label>
              Group Name:
              <input type="text" name="groupName" value={formData.groupName} onChange={handleChange} required />
            </label>
            <label>
              Member Unique ID:
              <input type="text" name="memberUniqueId" value={formData.memberUniqueId} onChange={handleChange} required />
            </label>
            <label>
              Date of Admission:
              <input type="date" name="dateOfAdmission" value={formData.dateOfAdmission} onChange={handleChange} required />
            </label>
            <label>
              Next of Kin:
              <input type="text" name="nextOfKin" value={formData.nextOfKin} onChange={handleChange} required />
            </label>
            <label>
              Next of Kin Contact:
              <input type="tel" name="nextOfKinContact" value={formData.nextOfKinContact} onChange={handleChange} required />
            </label>
          </section>

          <section>
            <h2>Project Information</h2>
            <label>
              Variety of Seedlings:
              <input type="text" name="varietyOfSeedlings" value={formData.varietyOfSeedlings} onChange={handleChange} required />
            </label>
            <label>
              Number of Seedlings Ordered:
              <input type="number" name="numberOfSeedlingsOrdered" value={formData.numberOfSeedlingsOrdered} onChange={handleChange} required />
            </label>
            <label>
              Amount to be Paid (Ksh):
              <input type="number" name="amountToBePaid" value={formData.amountToBePaid} onChange={handleChange} required />
            </label>
            <label>
              Deposit Paid (Ksh):
              <input type="number" name="depositPaid" value={formData.depositPaid} onChange={handleChange} required />
            </label>
            <label>
              Balance (Ksh):
              <input type="number" name="balance" value={formData.balance} onChange={handleChange} required />
            </label>
            <label>
              Date of Payment:
              <input type="date" name="dateOfPayment" value={formData.dateOfPayment} onChange={handleChange} required />
            </label>
            <label>
              Date to Complete Payment:
              <input type="date" name="dateToCompletePayment" value={formData.dateToCompletePayment} onChange={handleChange} required />
            </label>
            <label>
              Amount Paid (Ksh):
              <input type="number" name="amountPaid" value={formData.amountPaid} onChange={handleChange} required />
            </label>
            <label>
              Form Fee (Ksh):
              <input type="number" name="formFee" value={formData.formFee} onChange={handleChange} required />
            </label>
          </section>

          <section>
            <h2>Area Information</h2>
            <label>
              County:
              <input type="text" name="county" value={formData.county} onChange={handleChange} required />
            </label>
            <label>
              Sub-County:
              <input type="text" name="subCounty" value={formData.subCounty} onChange={handleChange} required />
            </label>
            <label>
              Ward:
              <input type="text" name="ward" value={formData.ward} onChange={handleChange} required />
            </label>
            <label>
              Location:
              <input type="text" name="location" value={formData.location} onChange={handleChange} required />
            </label>
            <label>
              Sub-Location:
              <input type="text" name="subLocation" value={formData.subLocation} onChange={handleChange} required />
            </label>
            <label>
              Village:
              <input type="text" name="village" value={formData.village} onChange={handleChange} required />
            </label>
          </section>

          <button type="submit">Register Member</button>
        </form>
      </main>
    </div>
  );
}

export default RegMembers;
