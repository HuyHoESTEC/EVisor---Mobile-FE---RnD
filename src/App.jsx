import { useCallback, useState } from 'react'
import './style.css' // Gọi file CSS đã tạo
import LoginScreen from './screens/Auth/LoginScreen';
import HomeScreen from './screens/Main/HomeScreen';
import ScanMenu from './screens/Scan/ScanMenu';
import InventoryFormContainer from './screens/Scan/InventoryForm/InventoryFormContainer';
import InstallationFormContainer from './screens/Scan/InstallationForm/InstallationFormContainer';
import { ToastMessage } from './components/ToastMessage';

function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('LOGIN');
  const [toast, setToast] = useState({ message: '', type: '' });
  
  const handleToast = useCallback((message, type) => {
    setToast({ message, type });
  }, []);

  const handleLogin = (userInfo) => {
    setUser(userInfo);
    setCurrentScreen('HOME');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('LOGIN');
    handleToast("Đã đăng xuất.", 'success');
  };

  const handleNavigate = useCallback((screen) => {
    setCurrentScreen(screen);
  }, []);

  const renderScreen = () => {
    if (currentScreen === 'LOGIN') {
      return <LoginScreen onLogin={handleLogin} onToast={handleToast} />;
    }
    if (!user) return <LoginScreen onLogin={handleLogin} onToast={handleToast} />;

    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen user={user} onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'SCAN_MENU':
        return <ScanMenu onNavigate={handleNavigate} />;
      case 'INVENTORY_FORM':
        return <InventoryFormContainer user={user} onToast={handleToast} onBack={() => handleNavigate('SCAN_MENU')} />;
      case 'INSTALLATION_FORM':
        return <InstallationFormContainer user={user} onToast={handleToast} onBack={() => handleNavigate('SCAN_MENU')} />;
      default:
        return <HomeScreen user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
    }
  };

  return (
    <div className='app-wrapper'>
      <ToastMessage 
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })}
      />
      {renderScreen()}
    </div>
  )
};

export default App;