import React from 'react';
import { Icon } from './Icon';
import type { Animal, Language, MainView } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { AnimalImage } from './AnimalImage';
import { imageAssets } from '../data/imageAssets';

interface DashboardProps {
  onNavigate: (view: Exclude<MainView, 'animalProfile' | 'dashboard'>) => void;
  onSelectAnimal: (animal: Animal) => void;
  herd: Animal[];
  onDeleteAnimal: (tagId: string) => void;
  language: Language;
}

const SummaryCard: React.FC<{ title: string; value: string; colorClass: string; icon: any; imageUrl?: string }> = ({ title, value, colorClass, icon, imageUrl }) => (
  <div className={`flex items-center p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-brand-brown-800 ${colorClass} transition-transform hover:scale-[1.02] md:hover:scale-105`}>
    <div className="mr-4 md:mr-5">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow-md" />
      ) : (
        <div className="bg-white/50 p-2.5 md:p-3 rounded-full">
          <Icon name={icon} className="w-6 h-6 md:w-8 md:h-8 text-brand-brown-700" />
        </div>
      )}
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] md:text-sm font-bold text-brand-brown-600 dark:text-brand-brown-300 uppercase tracking-wider">{title}</span>
      <span className="text-2xl md:text-3xl font-black text-brand-brown-900 dark:text-brand-brown-100">{value}</span>
    </div>
  </div>
);

const ActionStatCard: React.FC<{ title: string; icon: any; onClick: () => void }> = ({ title, icon, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-[#104b5c] p-6 md:p-8 rounded-xl border border-[#1a5d6e] flex flex-col items-center justify-center text-center shadow-md transition-all hover:bg-[#155a6e] hover:shadow-2xl group w-full"
  >
    <div className="bg-white/10 p-3 md:p-4 rounded-full mb-3 md:mb-4 group-hover:scale-110 transition-transform">
      <Icon name={icon} className="w-6 h-6 md:w-8 md:h-8 text-white" />
    </div>
    <h4 className="text-white text-sm md:text-lg font-black uppercase tracking-widest">{title}</h4>
  </button>
);

const ExternalLinkCard: React.FC<{ title: string; description: string; imageUrl: string; url: string; buttonText: string }> = ({ title, description, imageUrl, url, buttonText }) => (
  <div className="bg-white dark:bg-brand-brown-900 rounded-[28px] md:rounded-[32px] overflow-hidden shadow-lg border border-gray-100 dark:border-brand-brown-800 flex flex-col h-full group transition-all duration-500 hover:shadow-2xl">
    <div className="h-48 md:h-64 overflow-hidden relative">
      <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute inset-0 bg-black/5"></div>
    </div>
    <div className="p-6 md:p-10 flex flex-col flex-grow">
      <h4 className="text-xl md:text-2xl font-black text-brand-brown-900 dark:text-brand-brown-100 mb-2 md:mb-4">{title}</h4>
      <p className="text-brand-brown-600 dark:text-brand-brown-400 mb-6 md:mb-10 text-sm md:text-lg leading-relaxed line-clamp-3">{description}</p>
      <div className="mt-auto">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex w-full md:w-auto justify-center px-6 md:px-10 py-3 md:py-3.5 bg-[#f8fafc] dark:bg-brand-brown-800 text-brand-brown-700 dark:text-brand-brown-200 text-sm md:text-base font-bold rounded-xl hover:bg-brand-green-50 hover:text-brand-green-700 transition-all border border-gray-200 dark:border-brand-brown-700"
        >
          {buttonText}
        </a>
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onSelectAnimal, herd, onDeleteAnimal, language }) => {
  const t = useTranslations(language);
  const cattleCount = herd.filter(a => a.species === 'Cattle').length;
  const buffaloCount = herd.length - cattleCount;

  return (
    <div className="animate-fade-in w-full bg-slate-50 dark:bg-brand-brown-950 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[400px] md:h-[500px] w-full flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img src={imageAssets.ui.heroBg} className="w-full h-full object-cover" alt="Background" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20 md:to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-start w-full max-w-[1440px] py-12 md:py-0">
          <div className="flex items-center gap-8 mb-6 md:mb-10">
              <div className="bg-white p-3 md:p-5 rounded-[20px] md:rounded-[28px] shadow-2xl flex items-center group cursor-default">
                <div className="bg-brand-green-600 p-1.5 md:p-2 rounded-lg md:rounded-xl mr-2 md:mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Icon name="cow" className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <span className="text-xl md:text-3xl font-black tracking-tighter text-brand-green-800 uppercase">Pashudhan</span>
              </div>
          </div>
          
          <h2 className="text-3xl md:text-6xl font-black text-white mb-4 md:mb-6 tracking-tighter drop-shadow-2xl max-w-4xl leading-tight">
            {t.hero_title}
          </h2>
          <p className="text-base md:text-xl text-white/80 max-w-2xl leading-relaxed font-medium drop-shadow-xl mb-8 md:mb-10 border-l-4 border-brand-green-500 pl-4 md:pl-8">
            {t.hero_description}
          </p>
          
          <button 
            onClick={() => onNavigate('register')}
            className="group flex items-center gap-3 md:gap-4 px-6 md:px-10 py-4 md:py-5 bg-[#104b5c] text-white text-lg md:text-xl font-black rounded-xl md:rounded-2xl shadow-2xl hover:bg-[#155a6e] transition-all transform hover:-translate-y-1 active:scale-95"
          >
            <Icon name="plus-circle" className="w-6 h-6 md:w-7 md:h-7" />
            <span>Register Animal</span>
          </button>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative z-20 w-full">
        <div className="container mx-auto px-6 md:px-12 py-10 md:py-16 w-full max-w-[1440px]">
          
          {/* Welcome & Summary Section */}
          <div className="mb-12 md:mb-20 text-center">
              <h3 className="text-3xl md:text-5xl font-black text-[#104b5c] dark:text-brand-green-400 mb-2 md:mb-4">{t.welcome_back}</h3>
              <p className="text-base md:text-xl text-brand-brown-600 dark:text-brand-brown-400 mb-8 md:mb-12">{t.dashboard_subtitle}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                  <SummaryCard 
                    title={t.dashboard_total_herd} 
                    value={herd.length.toString()} 
                    colorClass="bg-[#e2efdf] dark:bg-brand-green-900/20" 
                    icon="users"
                  />
                  <SummaryCard 
                    title={t.dashboard_total_cattle} 
                    value={cattleCount.toString()} 
                    colorClass="bg-[#e0f2fe] dark:bg-brand-light-blue-800/10" 
                    imageUrl={imageAssets.stats.cattle}
                    icon="cow"
                  />
                  <SummaryCard 
                    title={t.dashboard_total_buffalo} 
                    value={buffaloCount.toString()} 
                    colorClass="bg-[#fef9c3] dark:bg-brand-light-yellow-800/10" 
                    imageUrl={imageAssets.stats.buffalo}
                    icon="cow"
                  />
              </div>
          </div>

          {/* Key Statistics / Quick Actions Section */}
          <section className="mb-16 md:mb-28">
            <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
               <div className="w-2 md:w-3 h-8 md:h-10 bg-[#104b5c] rounded-full"></div>
               <h3 className="text-2xl md:text-3xl font-black text-[#104b5c] dark:text-brand-green-400 tracking-tight">
                  {t.stats_title}
               </h3>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              <ActionStatCard title={t.vaccinations} icon="shield-check" onClick={() => onNavigate('semen')} />
              <ActionStatCard title={t.nav_library} icon="book-open" onClick={() => onNavigate('library')} />
              <ActionStatCard title={t.nav_reports} icon="chart-bar" onClick={() => onNavigate('semen')} />
              <ActionStatCard title={t.nav_vets} icon="store-front" onClick={() => onNavigate('vets')} />
            </div>
          </section>

          {/* My Herd Section */}
          <section className="mb-16 md:mb-28">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 md:mb-16 gap-4">
                  <div className="flex items-center gap-4 md:gap-6">
                      <div className="w-3 md:w-4 h-10 md:h-12 bg-brand-green-500 rounded-full"></div>
                      <h3 className="text-3xl md:text-4xl font-black text-[#104b5c] dark:text-brand-green-400 tracking-tight">
                          {t.dashboard_my_herd}
                      </h3>
                  </div>
                  <span className="text-sm md:text-xl font-bold text-gray-400">Showing {herd.length} entries</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                  {herd.map(animal => (
                      <div key={animal.tagId} className="group flex flex-col p-1 bg-white dark:bg-brand-brown-900 rounded-[32px] md:rounded-[40px] shadow-lg border border-gray-100 dark:border-brand-brown-800 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                        <div className="relative h-56 md:h-64 w-full overflow-hidden rounded-t-[30px] md:rounded-t-[38px]">
                           <AnimalImage animal={animal} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                           <div className="absolute top-4 left-4 md:top-6 md:left-6 px-3 py-1.5 md:px-4 md:py-2 bg-white/90 backdrop-blur text-[#104b5c] font-black rounded-lg md:rounded-xl shadow-lg uppercase text-[10px] md:text-sm tracking-widest">
                              {animal.species === 'Cattle' ? t.species_cattle : t.species_buffalo}
                           </div>
                        </div>
                        <div className="p-6 md:p-8 flex-grow">
                          <h4 className="text-2xl md:text-3xl font-black text-brand-brown-900 dark:text-brand-brown-100 mb-3 md:mb-4">{animal.breed}</h4>
                          <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                             <div className="flex items-center justify-between py-1.5 md:py-2 border-b border-gray-50 dark:border-brand-brown-800">
                                <span className="text-brand-brown-400 font-bold uppercase tracking-widest text-[10px]">{t.dashboard_animal_id}</span>
                                <span className="text-brand-brown-900 dark:text-brand-brown-200 font-black text-base md:text-lg tabular-nums">{animal.tagId}</span>
                             </div>
                             <div className="flex items-center justify-between py-1.5 md:py-2">
                                <span className="text-brand-brown-400 font-bold uppercase tracking-widest text-[10px]">Registered</span>
                                <span className="text-brand-brown-600 dark:text-brand-brown-400 font-bold text-sm">{animal.registrationDate}</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-3 md:gap-4">
                            <button 
                              onClick={() => onSelectAnimal(animal)}
                              className="flex-grow flex items-center justify-center gap-2 md:gap-3 py-3.5 md:py-4 text-brand-green-700 bg-brand-green-50 dark:bg-brand-brown-800 rounded-xl md:rounded-2xl font-black text-sm md:text-base hover:bg-brand-green-100 transition-all"
                            >
                              <Icon name="pencil" className="w-4 h-4 md:w-5 md:h-5" />
                              View Profile
                            </button>
                            <button 
                              onClick={() => onDeleteAnimal(animal.tagId)}
                              className="p-3.5 md:p-4 text-red-400 bg-red-50 dark:bg-brand-brown-800 rounded-xl md:rounded-2xl hover:text-red-600 transition-all"
                            >
                              <Icon name="x-mark" className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                          </div>
                        </div>
                      </div>
                  ))}
              </div>
          </section>

          {/* External Links Section */}
          <section className="pb-12">
            <div className="flex items-center gap-4 md:gap-6 mb-10 md:mb-16">
               <div className="w-3 md:w-4 h-10 md:h-12 bg-amber-500 rounded-full"></div>
               <h3 className="text-3xl md:text-4xl font-black text-[#104b5c] dark:text-brand-green-400 tracking-tight">
                  {t.external_links_title}
               </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <ExternalLinkCard 
                 title="DAHD Schemes and Programmes"
                 description="DAHD Multi-Scheme Programs pave the way for inclusive livestock growth. Explore government initiatives and subsidies."
                 imageUrl={imageAssets.ui.dahd}
                 url="https://dahd.gov.in/schemes-programmes"
                 buttonText={t.visit_link}
              />
              <ExternalLinkCard 
                 title="Pashupedia"
                 description="Discovering the secrets of every animal, made simple for you. Digital encyclopedia for Indian breeds."
                 imageUrl={imageAssets.ui.pashupedia}
                 url="https://dahd.gov.in/pashupdia#gsc.tab=0"
                 buttonText={t.visit_link}
              />
              <ExternalLinkCard 
                 title="National Dairy Development Board"
                 description="NDDB: Committed to rural India's socio-economic growth through cooperative dairy development."
                 imageUrl={imageAssets.ui.nddb}
                 url="https://www.nddb.coop/"
                 buttonText={t.visit_link}
              />
            </div>
          </section>

        </div>
      </div>
      
      <style>{`
        .line-clamp-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};
