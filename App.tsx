import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginScreen } from './components/LoginScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { Dashboard } from './components/Dashboard';
import { RegistrationForm } from './components/RegistrationForm';
import { BreedDatabase } from './components/BreedDatabase';
import { SemenBank } from './components/SemenBank';
import { VetsNearby } from './components/VetsNearby';
import { AnimalProfile } from './components/AnimalProfile';
import { AboutUs } from './components/AboutUs';
import type { Animal, Language, Theme, MainView, User } from './types';
import { herd as initialHerd } from './data/herdData';
import { DesktopFooter } from './components/DesktopFooter';
import { Settings } from './components/Settings';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { authService } from './services/authService';
import { imageStore } from './services/imageStore';
import { ModelTraining } from './components/ModelTraining';

type AuthView = 'login' | 'signup' | 'forgotPassword';

interface HistoryState {
    view: MainView;
    selectedAnimal?: Animal | null;
}

const mainTabViews: Readonly<MainView[]> = ['dashboard', 'library', 'semen', 'vets', 'about'];
const isMainTabView = (view: MainView): boolean => mainTabViews.includes(view);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());
  const [authView, setAuthView] = useState<AuthView>('login');
  const [mainView, setMainView] = useState<MainView>('dashboard');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [herd, setHerd] = useState<Animal[]>(initialHerd);
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as HistoryState;
      if (state) {
        setMainView(state.view);
        setSelectedAnimal(state.selectedAnimal || null);
      } else {
        setMainView('dashboard');
        setSelectedAnimal(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.history.replaceState({ view: 'dashboard', selectedAnimal: null } as HistoryState, '');
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (revealElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -12% 0px',
      }
    );

    revealElements.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 420)}ms`);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [currentUser, mainView, authView]);

  const handleLogin = async (username: string, password: string) => {
    const user = await authService.login(username, password);
    setCurrentUser(user);
    navigateTo('dashboard');
  };
  
  const handleSignUp = async (username:string, email:string, password:string) => {
    const user = await authService.signup(username, email, password);
    setCurrentUser(user);
    navigateTo('dashboard');
  }

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setAuthView('login');
    setMainView('dashboard');
  };
  
  const handleSelectAnimal = (animal: Animal) => {
    setSelectedAnimal(animal);
    setMainView('animalProfile');
    window.history.pushState({ view: 'animalProfile', selectedAnimal: animal } as HistoryState, '');
  };

  const handleAddAnimal = (newAnimal: Animal) => {
    setHerd(prev => [...prev, newAnimal]);
    navigateTo('dashboard');
  };

  const handleDeleteAnimal = (tagId: string) => {
    const animal = herd.find(a => a.tagId === tagId);
    if (animal) imageStore.removeImage(animal.imageUrl);
    setHerd(prev => prev.filter(a => a.tagId !== tagId));
  };

  const navigateTo = (view: MainView) => {
    if (view !== 'animalProfile') setSelectedAnimal(null);
    if (view !== mainView) {
        setMainView(view);
        if (isMainTabView(view)) {
            window.history.replaceState({ view, selectedAnimal: null } as HistoryState, '');
        } else {
            window.history.pushState({ view, selectedAnimal: null } as HistoryState, '');
        }
    }
  };
  
  const renderView = () => {
    switch (mainView) {
      case 'dashboard': return <Dashboard herd={herd} onNavigate={navigateTo} onSelectAnimal={handleSelectAnimal} onDeleteAnimal={handleDeleteAnimal} language={language} />;
      case 'register': return <div className="main-stage px-4 sm:px-6 lg:px-8 py-8 sm:py-10" data-reveal><RegistrationForm onBack={() => navigateTo('dashboard')} onAddAnimal={handleAddAnimal} language={language} /></div>;
      case 'library': return <div className="main-stage px-4 sm:px-6 lg:px-8 py-8 sm:py-10" data-reveal><BreedDatabase onBack={() => navigateTo('dashboard')} language={language} /></div>;
      case 'semen': return <div className="main-stage px-4 sm:px-6 lg:px-8 py-8 sm:py-10" data-reveal><SemenBank herd={herd} onBack={() => navigateTo('dashboard')} language={language} /></div>;
      case 'vets': return <div className="main-stage px-4 sm:px-6 lg:px-8 py-8 sm:py-10" data-reveal><VetsNearby onBack={() => navigateTo('dashboard')} language={language} /></div>;
      case 'animalProfile': return selectedAnimal ? <div className="main-stage px-4 sm:px-6 lg:px-8 py-8 sm:py-10" data-reveal><AnimalProfile animal={selectedAnimal} onBack={() => navigateTo('dashboard')} language={language} /></div> : null;
      case 'settings': return <div className="main-stage px-4 sm:px-6 lg:px-8 py-8 sm:py-10" data-reveal><Settings user={currentUser!} onBack={() => navigateTo('dashboard')} theme={theme} onThemeToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} language={language} onLanguageChange={setLanguage} /></div>;
      case 'about': return <div className="main-stage px-4 sm:px-6 lg:px-8 py-8 sm:py-10"><AboutUs language={language} onBack={() => navigateTo('dashboard')} /></div>;
      case 'modelTraining': return <div className="main-stage px-4 sm:px-6 lg:px-8 py-8 sm:py-10" data-reveal><ModelTraining onBack={() => navigateTo('dashboard')} /></div>;
      default: return <Dashboard herd={herd} onNavigate={navigateTo} onSelectAnimal={handleSelectAnimal} onDeleteAnimal={handleDeleteAnimal} language={language} />;
    }
  };

  if (!currentUser) {
      return (
        <div className="app-shell flex min-h-screen flex-col text-brand-brown-900 dark:text-brand-brown-200">
            <div className="app-backdrop">
              <div className="app-orb app-orb-one"></div>
              <div className="app-orb app-orb-two"></div>
              <div className="app-orb app-orb-three"></div>
            </div>
            <Header isLoggedIn={false} onLogout={handleLogout} language={language} onLanguageChange={setLanguage} />
            <main className="relative z-10 flex-grow flex items-center justify-center p-6">
              {authView === 'login' && <LoginScreen onLogin={handleLogin} onSwitchToSignUp={() => setAuthView('signup')} onForgotPassword={() => setAuthView('forgotPassword')} language={language} />}
              {authView === 'signup' && <SignUpScreen onSignUp={handleSignUp} onSwitchToLogin={() => setAuthView('login')} language={language} />}
              {authView === 'forgotPassword' && <ForgotPasswordScreen onSwitchToLogin={() => setAuthView('login')} language={language} />}
            </main>
            <Footer language={language} />
        </div>
      );
  }

  return (
    <div className="app-shell flex min-h-screen flex-col text-brand-brown-900 dark:text-brand-brown-200">
        <div className="app-backdrop">
          <div className="app-orb app-orb-one"></div>
          <div className="app-orb app-orb-two"></div>
          <div className="app-orb app-orb-three"></div>
        </div>
        <Header 
          isLoggedIn={true} 
          onLogout={handleLogout} 
          language={language} 
          onLanguageChange={setLanguage} 
          onNavigate={navigateTo}
          currentView={mainView}
        />
        <div className="relative z-10 w-full flex-grow">
            <main className="w-full">
                {renderView()}
            </main>
            <div className="main-stage px-4 sm:px-6 lg:px-8 pb-8 mt-8 sm:mt-12">
              <DesktopFooter language={language} />
            </div>
        </div>
    </div>
  );
};

export default App;
