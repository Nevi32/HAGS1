import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/regmembers.css';

function RegMembers() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`reg-members-page ${theme}`}>
      <Navbar />
      <main>
        <h1>Register Members</h1>
       
        <form className="registration-form">
          <section>
            <h2>Personal Information</h2>
            <label>
              Full Name:
              <input type="text" name="fullName" required />
            </label>
            <label>
              National ID:
              <input type="text" name="nationalId" required />
            </label>
            <label>
              Contact:
              <input type="tel" name="contact" required />
            </label>
            <label>
              Status:
              <input type="text" name="status" required />
            </label>
            <label>
              Group Name:
              <input type="text" name="groupName" required />
            </label>
            <label>
              Member Unique ID:
              <input type="text" name="memberUniqueId" required />
            </label>
            <label>
              Date of Admission:
              <input type="date" name="dateOfAdmission" required />
            </label>
            <label>
              Next of Kin:
              <input type="text" name="nextOfKin" required />
            </label>
            <label>
              Next of Kin Contact:
              <input type="tel" name="nextOfKinContact" required />
            </label>
          </section>

          <section>
            <h2>Project Information</h2>
            <label>
              Variety of Seedlings:
              <input type="text" name="varietyOfSeedlings" required />
            </label>
            <label>
              Number of Seedlings Ordered:
              <input type="number" name="numberOfSeedlingsOrdered" required />
            </label>
            <label>
              Amount to be Paid (Ksh):
              <input type="number" name="amountToBePaid" required />
            </label>
            <label>
              Deposit Paid (Ksh):
              <input type="number" name="depositPaid" required />
            </label>
            <label>
              Balance (Ksh):
              <input type="number" name="balance" required />
            </label>
            <label>
              Date of Payment:
              <input type="date" name="dateOfPayment" required />
            </label>
            <label>
              Date to Complete Payment:
              <input type="date" name="dateToCompletePayment" required />
            </label>
            <label>
              Amount Paid (Ksh):
              <input type="number" name="amountPaid" required />
            </label>
            <label>
              Form Fee (Ksh):
              <input type="number" name="formFee" required />
            </label>
          </section>

          <section>
            <h2>Area Information</h2>
            <label>
              County:
              <input type="text" name="county" required />
            </label>
            <label>
              Sub-County:
              <input type="text" name="subCounty" required />
            </label>
            <label>
              Ward:
              <input type="text" name="ward" required />
            </label>
            <label>
              Location:
              <input type="text" name="location" required />
            </label>
            <label>
              Sub-Location:
              <input type="text" name="subLocation" required />
            </label>
            <label>
              Village:
              <input type="text" name="village" required />
            </label>
          </section>

          <button type="submit">Register Member</button>
        </form>
      </main>
    </div>
  );
}

export default RegMembers;
