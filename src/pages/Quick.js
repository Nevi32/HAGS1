import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db, auth } from '../lib/firebase-config.mjs';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../contexts/ThemeContext';
import { getUserInfo, getMembers, getFinances, getNextProjectId } from '../utils/localStorage';
import { generateFinancialReport, generateMembersGroupsReport, generateProjectsReport } from '../utils/reportUtils';
import '../styles/quick.css';
import jsPDF from 'jspdf';
import logoImage from '../assets/h.jpg';

function Quick() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [isBackupInProgress, setIsBackupInProgress] = useState(false);
  const [isRestoreInProgress, setIsRestoreInProgress] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [backupStatus, setBackupStatus] = useState({});
  const [restoreStatus, setRestoreStatus] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const syncCollectionToFirestore = async (collectionName, data) => {
    if (!user) {
      console.error('User not authenticated');
      setBackupStatus(prev => ({ ...prev, [collectionName]: 'Failed: User not authenticated' }));
      return;
    }

    try {
      const collectionRef = collection(db, collectionName);
      let updatedCount = 0;
      let createdCount = 0;
      let deletedCount = 0;

      // Special handling for finances
      if (collectionName === 'finances') {
        const firestoreFinances = await getDocs(collectionRef);
        
        if (data.length === 0) {
          for (const doc of firestoreFinances.docs) {
            await deleteDoc(doc.ref);
            deletedCount++;
          }
          setBackupStatus(prev => ({
            ...prev,
            [collectionName]: `Success: Deleted all ${deletedCount} finance entries from Firestore`
          }));
          return;
        }
      }

      for (const item of data) {
        let queryConstraints = [];
        switch(collectionName) {
          case 'members':
            queryConstraints = [
              where('groupName', '==', item.groupName),
              where('fullName', '==', item.fullName),
              where('nationalId', '==', item.nationalId)
            ];
            break;
          case 'finances':
            queryConstraints = [
              where('expense', '==', item.expense),
              where('amount', '==', item.amount),
              where('date', '==', item.date)
            ];
            break;
          default:
            console.error(`Unsupported collection: ${collectionName}`);
            continue;
        }

        const q = query(collectionRef, ...queryConstraints);
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docRef = doc(db, collectionName, querySnapshot.docs[0].id);
          await updateDoc(docRef, item);
          updatedCount++;
        } else {
          await addDoc(collectionRef, item);
          createdCount++;
        }
      }

      setBackupStatus(prev => ({
        ...prev,
        [collectionName]: `Success: Updated ${updatedCount}, Created ${createdCount}, Deleted ${deletedCount}`
      }));
    } catch (error) {
      console.error(`Error syncing ${collectionName} with Firestore:`, error);
      setBackupStatus(prev => ({ ...prev, [collectionName]: `Failed: ${error.message}` }));
    }
  };

  const handleBackup = async () => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    setIsBackupInProgress(true);
    setBackupStatus({});

    const members = getMembers();
    const finances = getFinances();

    await syncCollectionToFirestore('members', members);
    await syncCollectionToFirestore('finances', finances);

    // Backup other data to localStorage
    const userInfo = getUserInfo();
    const lastProjectId = getNextProjectId();
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    localStorage.setItem('lastProjectId', lastProjectId);
    localStorage.setItem('theme', theme);

    setIsBackupInProgress(false);
  };

  const handleRestore = async () => {
    if (!user) {
      console.error('User not authenticated');
      setRestoreStatus('Failed: User not authenticated');
      return;
    }

    setIsRestoreInProgress(true);
    setRestoreStatus('Restoring data...');

    try {
      const collections = ['members', 'finances'];
      let restoredData = {};

      for (const collectionName of collections) {
        const collectionRef = collection(db, collectionName);
        const querySnapshot = await getDocs(collectionRef);
        
        restoredData[collectionName] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }

      // Update localStorage with restored data
      localStorage.setItem('hagsMembers', JSON.stringify(restoredData.members));
      localStorage.setItem('hagsFinances', JSON.stringify(restoredData.finances));

      setRestoreStatus('Data restored successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Restore failed:', error);
      setRestoreStatus(`Failed to restore data from Firestore: ${error.message}`);
    } finally {
      setIsRestoreInProgress(false);
    }
  };

  const handleGenerateReport = async (reportType) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    setIsGeneratingReport(true);
    let reportData;
    let fileName;

    try {
      switch (reportType) {
        case 'financial':
          reportData = await generateFinancialReport(getFinances(), getMembers());
          fileName = 'Financial_Report';
          break;
        case 'members':
          reportData = await generateMembersGroupsReport(getMembers());
          fileName = 'Members_and_Groups_Report';
          break;
        case 'projects':
          reportData = await generateProjectsReport(getMembers(), getFinances(), getNextProjectId());
          fileName = 'Projects_Report';
          break;
        default:
          throw new Error('Invalid report type');
      }

      const pdf = new jsPDF();

      // Add logo and title
      try {
        pdf.addImage(logoImage, 'JPEG', 10, 10, 20, 20);
      } catch (error) {
        console.error('Error adding logo to PDF:', error);
      }
      pdf.setFontSize(18);
      pdf.text('Hass Avocado Growers (HAGS)', 35, 25);

      // Add report content
      pdf.setFontSize(12);
      let y = 40;
      const lines = pdf.splitTextToSize(reportData.content, 180);
      lines.forEach(line => {
        if (y > 280) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(line, 10, y);
        y += 7;
      });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fullFileName = `${fileName}-${timestamp}.pdf`;
      pdf.save(fullFileName);
    } catch (error) {
      console.error('Error generating report:', error);
      // Optionally, show an error message to the user
    } finally {
      setIsGeneratingReport(false);
      setIsReportModalOpen(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`quick ${theme}`}>
      <Navbar />
      <main>
        <h1>Quick Actions</h1>
        <div className="backup-restore-container">
          <button
            className="backup-button"
            onClick={handleBackup}
            disabled={isBackupInProgress}
          >
            {isBackupInProgress ? 'Backing up...' : 'Backup Data to Firestore'}
          </button>
          <button
            className="restore-button"
            onClick={handleRestore}
            disabled={isRestoreInProgress}
          >
            {isRestoreInProgress ? 'Restoring...' : 'Restore Data from Firestore'}
          </button>
          <button
            className="reports-button"
            onClick={() => setIsReportModalOpen(true)}
          >
            Generate Reports
          </button>
        </div>
        {Object.keys(backupStatus).length > 0 && (
          <div className="backup-status">
            <h3>Backup Status:</h3>
            {Object.entries(backupStatus).map(([collection, status]) => (
              <p key={collection}>{collection}: {status}</p>
            ))}
          </div>
        )}
        {restoreStatus && (
          <div className="restore-status">
            <p>{restoreStatus}</p>
          </div>
        )}
        {isReportModalOpen && (
          <div className="report-modal">
            <div className="modal-content">
              <h2>Select Report Type</h2>
              <button 
                onClick={() => handleGenerateReport('financial')}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? 'Generating...' : 'Financial Report'}
              </button>
              <button 
                onClick={() => handleGenerateReport('members')}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? 'Generating...' : 'Members and Groups Report'}
              </button>
              <button 
                onClick={() => handleGenerateReport('projects')}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? 'Generating...' : 'Projects Report'}
              </button>
              <button 
                className="close-button" 
                onClick={() => setIsReportModalOpen(false)}
                disabled={isGeneratingReport}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Quick;
