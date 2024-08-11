import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../contexts/ThemeContext';
import { getUserInfo, getMembers, getFinances, getNextProjectId } from '../utils/localStorage';
import { downloadFile, uploadFile } from '../utils/fileUtils';
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

  const handleBackup = () => {
    setIsBackupInProgress(true);
    const userInfo = getUserInfo();
    const members = getMembers();
    const finances = getFinances();
    const lastProjectId = getNextProjectId();
    const backupData = {
      userInfo,
      members,
      finances,
      lastProjectId,
    };
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `hags-backup-${timestamp}.json`;
    
    downloadFile(filename, JSON.stringify(backupData));
    setIsBackupInProgress(false);
  };

  const handleRestore = async () => {
    setIsRestoreInProgress(true);
    try {
      const backupData = await uploadFile();
      if (backupData) {
        localStorage.setItem('userInfo', JSON.stringify(backupData.userInfo));
        localStorage.setItem('hagsMembers', JSON.stringify(backupData.members));
        localStorage.setItem('hagsFinances', JSON.stringify(backupData.finances));
        localStorage.setItem('lastProjectId', backupData.lastProjectId);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Restore failed:', error);
    } finally {
      setIsRestoreInProgress(false);
    }
  };

  const handleGenerateReport = async (reportType) => {
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
            {isBackupInProgress ? 'Backing up...' : 'Backup Data'}
          </button>
          <button
            className="restore-button"
            onClick={handleRestore}
            disabled={isRestoreInProgress}
          >
            {isRestoreInProgress ? 'Restoring...' : 'Restore Data'}
          </button>
          <button
            className="reports-button"
            onClick={() => setIsReportModalOpen(true)}
          >
            Generate Reports
          </button>
        </div>
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

