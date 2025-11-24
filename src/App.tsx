import { useCallback, useState } from 'react'
import LoginScreen from './screens/Auth/LoginScreen';
import HomeScreen from './screens/Main/HomeScreen';
import ScanMenu from './screens/Scan/ScanMenu';
import InventoryFormContainer from './screens/Scan/InventoryForm/InventoryFormContainer';
import InstallationFormContainer from './screens/Scan/InstallationForm/InstallationFormContainer';
// import { ToastMessage } from './components/ToastMessage';
import '../src/App.css';
import NotFoundScreen from './screens/NotFound/NotFoundScreen';
import { ScreenType, ToastType, User } from './types/common';

interface ToastState {
  message: string;
  type: '' | ToastType;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('LOGIN');
  const [toast, setToast] = useState<ToastState>({ message: '', type: '' });
  
  const handleToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  const handleLogin = (userInfo: User) => {
    setUser(userInfo);
    setCurrentScreen('HOME');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('LOGIN');
    handleToast("Đã đăng xuất.", 'success');
  };

  const handleNavigate = useCallback((screen: ScreenType) => {
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
        return <InventoryFormContainer user={user} onToast={handleToast} onBack={() => handleNavigate('SCAN_MENU')} onNavigate={handleNavigate} />;
      case 'INSTALLATION_FORM':
        return <InstallationFormContainer user={user} onToast={handleToast} onBack={() => handleNavigate('SCAN_MENU')} onNavigate={handleNavigate} />;
      case 'SETTINGS':
        return <NotFoundScreen />;
      case 'INFORMATION':
        return <NotFoundScreen />;
      case 'DASHBOARD':
        return <NotFoundScreen />;
      case 'WORK_MANAGEMENT':
        return <NotFoundScreen />;
      case 'WAREHOUSE_MANAGEMENT':
        return <NotFoundScreen />;
      default:
        return <HomeScreen user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
    }
  };

  return (
    <div className='app-wrapper'>
      {/* <ToastMessage 
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })}
      /> */}
      {renderScreen()}
    </div>
  )
};

export default App;