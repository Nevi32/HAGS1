import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../contexts/ThemeContext';
import { getUserInfo, getMembers, getFinances, getNextProjectId } from '../utils/localStorage';
import { downloadFile, uploadFile } from '../utils/fileUtils';
import '../styles/quick.css';

function Quick() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [isBackupInProgress, setIsBackupInProgress] = useState(false);
  const [isRestoreInProgress, setIsRestoreInProgress] = useState(false);

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
    downloadFile('hags-backup.json', JSON.stringify(backupData));
    setIsBackupInProgress(false);
  };

  const handleRestore = async () => {
    setIsRestoreInProgress(true);
    const backupData = await uploadFile('hags-backup.json');
    if (backupData) {
      localStorage.setItem('userInfo', JSON.stringify(backupData.userInfo));
      localStorage.setItem('hagsMembers', JSON.stringify(backupData.members));
      localStorage.setItem('hagsFinances', JSON.stringify(backupData.finances));
      localStorage.setItem('lastProjectId', backupData.lastProjectId);
      setIsRestoreInProgress(false);
      navigate('/dashboard');
    } else {
      setIsRestoreInProgress(false);
    }
  };

  return (
    <div className={`quick ${theme}`}>
      <Navbar />
      <main>
        <h1>Backup and Restore</h1>
        <div className="backup-restore-container">
          <button
            className="backup-button"
            onClick={handleBackup}
            disabled={isBackupInProgress}
          >
            {isBackupInProgress ? 'Backing up...' : 'Backup'}
          </button>
          <button
            className="restore-button"
            onClick={handleRestore}
            disabled={isRestoreInProgress}
          >
            {isRestoreInProgress ? 'Restoring...' : 'Restore'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default Quick;