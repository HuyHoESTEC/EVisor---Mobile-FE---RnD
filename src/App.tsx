import { useCallback, useEffect, useState } from 'react'
import LoginScreen from './screens/Auth/LoginScreen';
import HomeScreen from './screens/Main/HomeScreen';
import ScanMenu from './screens/Scan/ScanMenu';
import InventoryFormContainer from './screens/Scan/InventoryForm/InventoryFormContainer';
import InstallationFormContainer from './screens/Scan/InstallationForm/InstallationFormContainer';
// import { ToastMessage } from './components/ToastMessage';
import '../src/App.css';
import NotFoundScreen from './screens/NotFound/NotFoundScreen';
import { ScreenType, ToastType, User } from './types/common';
import { ToastMessage } from './components/ToastMessage';
import { AuthProvider, useAuth } from './context/AuthContext';

interface ToastState {
  message: string;
  type: '' | ToastType;
}
// Defind key to save screen status in local storage
const LAST_SCREEN_KEY = 'lastScreen';

const AppContent = ({ onToast }: { onToast: (message: string, type: ToastType) => void }) => {
  // Use: Get user information, login and logout function from Context
  const { user, logout, login } = useAuth();
  // Define screen status based on user from local storage/context
  // const initialScreen: ScreenType = user ? 'HOME' : 'LOGIN';
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    const storedScreen = localStorage.getItem(LAST_SCREEN_KEY);
    if (user && storedScreen && storedScreen !== 'LOGIN') {
      return storedScreen as ScreenType;
    }
    return user ? 'HOME' : 'LOGIN'
  });
  useEffect(() => {
    if (currentScreen !== 'LOGIN' && user) {
      localStorage.setItem(LAST_SCREEN_KEY, currentScreen);
    } else if (user) {
      localStorage.removeItem(LAST_SCREEN_KEY);
    }
  }, [currentScreen, user]);
  // Solve logic move screen when change user (by refresh or expire token)
  useEffect(() => {
    if (user && currentScreen === 'LOGIN') {
      setCurrentScreen('HOME');
    } else if (!user && currentScreen !== 'LOGIN') {
      setCurrentScreen('LOGIN');
    }
  }, [user, currentScreen]);

  // Funciont logout: call logout function from Context 
  const handleLogout = () => {
    logout(false);
    setCurrentScreen('LOGIN');
    onToast("Đã đăng xuất.", 'success');
  };

  const handleNavigate = useCallback((screen: ScreenType) => {
    setCurrentScreen(screen);
  }, []);

  const loginWrapper = (userInfo: User) => {
    login(userInfo);
    setCurrentScreen('HOME');
    onToast("Đăng nhập thành công!", 'success');
  };

  const renderScreen = () => {
    if (!user) {
      return <LoginScreen onLogin={loginWrapper} onToast={onToast} />;
    }

    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen user={user} onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'SCAN_MENU':
        return <ScanMenu onNavigate={handleNavigate} />;
      case 'INVENTORY_FORM':
        return <InventoryFormContainer user={user} onToast={onToast} onBack={() => handleNavigate('SCAN_MENU')} onNavigate={handleNavigate} />;
      case 'INSTALLATION_FORM':
        return <InstallationFormContainer user={user} onToast={onToast} onBack={() => handleNavigate('SCAN_MENU')} onNavigate={handleNavigate} />;
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
  return renderScreen();
};

function App() {
  const [toast, setToast] = useState<ToastState>({ message: '', type: '' });
  const handleToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast({ message: '', type: '' });
  }, []);

  return (
    <div className='app-wrapper'>
      <ToastMessage 
        message={toast.message}
        type={toast.type as ToastType}
        onClose={closeToast}
      />
      <AuthProvider onToast={handleToast}>
        <AppContent onToast={handleToast} />
      </AuthProvider>
    </div>
  )
};

export default App;