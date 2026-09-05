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

const SummaryCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  toneClass: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  imageUrl?: string;
}> = ({ title, value, subtitle, toneClass, icon, imageUrl }) => (
  <div
    data-reveal
    className={`lift-card relative overflow-hidden rounded-[30px] border border-white/60 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] dark:border-brand-brown-700 ${toneClass}`}
  >
    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/40 blur-3xl"></div>
    <div className="relative flex items-center gap-4">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="h-16 w-16 rounded-[22px] border border-white/70 object-cover shadow-lg"
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/70 shadow-lg">
          <Icon name={icon} className="h-8 w-8 text-[#14324c]" />
        </div>
      )}
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.26em] text-brand-brown-500 dark:text-brand-brown-300">
          {title}
        </p>
        <p className="mt-2 text-4xl font-black text-[#14324c] dark:text-white">{value}</p>
        <p className="mt-2 text-sm font-medium text-brand-brown-600 dark:text-brand-brown-300">{subtitle}</p>
      </div>
    </div>
  </div>
);

const ActionStatCard: React.FC<{
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  accentClass: string;
  onClick: () => void;
}> = ({ title, description, icon, accentClass, onClick }) => (
  <button
    data-reveal
    onClick={onClick}
    className={`lift-card group relative overflow-hidden rounded-[30px] border border-white/10 p-6 text-left text-white shadow-[0_28px_70px_rgba(15,23,42,0.18)] ${accentClass}`}
  >
    <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-white/10 blur-2xl"></div>
    <div className="relative">
      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-[18px] bg-white/14 backdrop-blur-xl group-hover:scale-105">
        <Icon name={icon} className="h-7 w-7" />
      </div>
      <h4 className="text-2xl font-black">{title}</h4>
      <p className="mt-3 max-w-xs text-sm font-medium leading-relaxed text-white/78">{description}</p>
      <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.26em] text-white/90">
        Open
        <Icon name="chevron-right" className="h-4 w-4" />
      </div>
    </div>
  </button>
);

const ExternalLinkCard: React.FC<{
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  buttonText: string;
}> = ({ title, description, imageUrl, url, buttonText }) => (
  <div
    data-reveal
    className="group lift-card shell-panel overflow-hidden rounded-[34px] border border-white/60 dark:border-brand-brown-700"
  >
    <div className="relative h-56 overflow-hidden">
      <img src={imageUrl} alt={title} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06141d]/70 via-transparent to-transparent"></div>
      <div className="absolute left-5 top-5 section-ribbon text-[10px] font-black uppercase tracking-[0.28em] text-brand-brown-500 dark:text-brand-brown-200">
        Public Resource
      </div>
    </div>
    <div className="p-7 sm:p-8">
      <h4 className="text-2xl font-black text-[#14324c] dark:text-white">{title}</h4>
      <p className="mt-4 text-sm font-medium leading-relaxed text-brand-brown-600 dark:text-brand-brown-300">
        {description}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#14324c] px-6 py-3 text-sm font-black uppercase tracking-[0.22em] text-white shadow-lg hover:-translate-y-0.5 hover:bg-[#18405f] dark:bg-brand-green-600 dark:hover:bg-brand-green-500"
      >
        {buttonText}
        <Icon name="chevron-right" className="h-4 w-4" />
      </a>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onSelectAnimal, herd, onDeleteAnimal, language }) => {
  const t = useTranslations(language);
  const cattleCount = herd.filter(a => a.species === 'Cattle').length;
  const buffaloCount = herd.length - cattleCount;

  return (
    <div className="w-full overflow-x-hidden pb-16 sm:pb-24">
      <section className="main-stage px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="relative overflow-hidden rounded-xl border border-[#d9e1e4] shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
          <div className="absolute inset-0">
            <img src={imageAssets.ui.heroBg} className="h-full w-full object-cover" alt="Background" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(23,63,70,0.97),rgba(23,63,70,0.88)_60%,rgba(8,127,103,0.72))]"></div>
          </div>

          <div className="relative grid gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.8fr)] lg:items-end">
            <div data-reveal className="space-y-6">
              <div className="section-ribbon text-[12px] font-black uppercase tracking-[0.32em] text-red-600">
                Livestock overview
              </div>

              <div className="hero-mesh max-w-3xl rounded-lg p-7 text-white sm:p-9 lg:p-10">
                <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-white/86 backdrop-blur-xl">
                  Now managing {herd.length} animals
                </div>
                <h2 className="mt-6 text-4xl font-black leading-[0.95] text-white sm:text-5xl lg:text-6xl">
                  {t.hero_title}
                </h2>
                <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/78 sm:text-lg">
                  {t.hero_description}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={() => onNavigate('register')}
                    className="rounded-full bg-white px-6 py-3.5 text-sm font-black uppercase tracking-[0.2em] text-[#14324c] shadow-2xl hover:-translate-y-1"
                  >
                    Register Animal
                  </button>
                  <button
                    onClick={() => onNavigate('library')}
                    className="rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-black uppercase tracking-[0.2em] text-white backdrop-blur-xl hover:-translate-y-1 hover:bg-white/14"
                  >
                    Explore Breeds
                  </button>
                </div>
              </div>
            </div>

            <div data-reveal className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[28px] border border-white/12 bg-white/10 p-5 text-white shadow-xl backdrop-blur-xl">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/70">Total Herd</p>
                <p className="mt-3 text-4xl font-black">{herd.length}</p>
                <p className="mt-2 text-sm text-white/72">A live snapshot of your registered livestock.</p>
              </div>
              <div className="rounded-[28px] border border-white/12 bg-white/10 p-5 text-white shadow-xl backdrop-blur-xl">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/70">Cattle</p>
                <p className="mt-3 text-4xl font-black">{cattleCount}</p>
                <p className="mt-2 text-sm text-white/72">High visibility breeding and health records.</p>
              </div>
              <div className="rounded-[28px] border border-white/12 bg-white/10 p-5 text-white shadow-xl backdrop-blur-xl">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/70">Buffalo</p>
                <p className="mt-3 text-4xl font-black">{buffaloCount}</p>
                <p className="mt-2 text-sm text-white/72">Track production trends and core care history.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="main-stage px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <section className="mb-14 sm:mb-20">
          <div data-reveal className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="section-ribbon text-[10px] font-black uppercase tracking-[0.28em] text-brand-brown-500 dark:text-brand-brown-300">
                Your Command Center
              </div>
              <h3 className="mt-4 text-4xl font-black text-[#14324c] dark:text-white sm:text-5xl">{t.welcome_back}</h3>
            </div>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-brand-brown-600 dark:text-brand-brown-300 sm:text-base">
              {t.dashboard_subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <SummaryCard
              title={t.dashboard_total_herd}
              value={herd.length.toString()}
              subtitle="Your complete herd, updated in real time."
              toneClass="bg-gradient-to-br from-white via-[#fff8e8] to-[#ffe1d2] dark:from-brand-brown-900 dark:via-brand-brown-900 dark:to-brand-brown-800"
              icon="users"
            />
            <SummaryCard
              title={t.dashboard_total_cattle}
              value={cattleCount.toString()}
              subtitle="Cattle records with breed and profile tracking."
              toneClass="bg-gradient-to-br from-white via-[#eef8ff] to-[#d7f0ff] dark:from-brand-brown-900 dark:via-brand-brown-900 dark:to-brand-brown-800"
              imageUrl={imageAssets.stats.cattle}
              icon="cow"
            />
            <SummaryCard
              title={t.dashboard_total_buffalo}
              value={buffaloCount.toString()}
              subtitle="Buffalo inventory ready for performance analysis."
              toneClass="bg-gradient-to-br from-white via-[#f4ffe8] to-[#e0f4ca] dark:from-brand-brown-900 dark:via-brand-brown-900 dark:to-brand-brown-800"
              imageUrl={imageAssets.stats.buffalo}
              icon="cow"
            />
          </div>
        </section>

        <section className="mb-16 sm:mb-24">
          <div data-reveal className="mb-8 flex items-center gap-4 sm:mb-10">
            <div className="h-12 w-3 rounded-full bg-gradient-to-b from-brand-coral via-brand-gold to-brand-mint"></div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-brown-500 dark:text-brand-brown-300">
                Fast Actions
              </div>
              <h3 className="mt-2 text-3xl font-black text-[#14324c] dark:text-white sm:text-4xl">{t.stats_title}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <ActionStatCard
              title={t.nav_reports}
              description="Track milk production and vaccination schedules in one workspace."
              icon="shield-check"
              accentClass="bg-[linear-gradient(145deg,#0b3f55,#116c7c_52%,#18b488)]"
              onClick={() => onNavigate('semen')}
            />
            <ActionStatCard
              title={t.nav_library}
              description="Open the breed library and compare cattle and buffalo profiles quickly."
              icon="book-open"
              accentClass="bg-[linear-gradient(145deg,#14324c,#305f7a_50%,#62c3ff)]"
              onClick={() => onNavigate('library')}
            />
            <ActionStatCard
              title="Train Model"
              description="Fine-tune the bundled breed recognizer from inside the browser."
              icon="microscope"
              accentClass="bg-[linear-gradient(145deg,#4c2a14,#b96f2f_52%,#ffbf47)]"
              onClick={() => onNavigate('modelTraining')}
            />
            <ActionStatCard
              title={t.nav_vets}
              description="Find nearby veterinary help with a faster, friendlier search flow."
              icon="store-front"
              accentClass="bg-[linear-gradient(145deg,#5c2040,#b64567_52%,#ff7b62)]"
              onClick={() => onNavigate('vets')}
            />
          </div>
        </section>

        <section className="mb-16 sm:mb-24">
          <div data-reveal className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-3 rounded-full bg-gradient-to-b from-brand-mint to-brand-sky"></div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-brown-500 dark:text-brand-brown-300">
                  Live Records
                </div>
                <h3 className="mt-2 text-3xl font-black text-[#14324c] dark:text-white sm:text-4xl">
                  {t.dashboard_my_herd}
                </h3>
              </div>
            </div>
            <div className="section-ribbon text-[10px] font-black uppercase tracking-[0.28em] text-brand-brown-500 dark:text-brand-brown-300">
              Showing {herd.length} entries
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {herd.map(animal => (
              <div
                key={animal.tagId}
                data-reveal
                className="lift-card shell-panel overflow-hidden rounded-[36px] border border-white/70 dark:border-brand-brown-700"
              >
                <div className="relative h-64 overflow-hidden">
                  <AnimalImage animal={animal} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#06141d]/76 to-transparent"></div>
                  <div className="absolute left-5 top-5 rounded-full bg-white/82 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#14324c] backdrop-blur-xl">
                    {animal.species === 'Cattle' ? t.species_cattle : t.species_buffalo}
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.26em] text-white/72">Breed Profile</p>
                      <h4 className="mt-2 text-3xl font-black text-white">{animal.breed}</h4>
                    </div>
                    <div className="rounded-[20px] bg-white/10 px-4 py-3 text-right text-white backdrop-blur-xl">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/64">{t.dashboard_animal_id}</p>
                      <p className="mt-1 text-lg font-black">#{animal.tagId}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="grid grid-cols-2 gap-4 rounded-[26px] bg-brand-brown-50/70 p-4 dark:bg-brand-brown-800/40">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-brown-400">Registered</p>
                      <p className="mt-2 text-sm font-bold text-brand-brown-700 dark:text-brand-brown-200">{animal.registrationDate}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-brown-400">Species</p>
                      <p className="mt-2 text-sm font-bold text-brand-brown-700 dark:text-brand-brown-200">{animal.species}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      onClick={() => onSelectAnimal(animal)}
                      className="flex-1 rounded-full bg-[#14324c] px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white shadow-lg hover:-translate-y-0.5 hover:bg-[#18405f]"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onDeleteAnimal(animal.tagId)}
                      className="rounded-full bg-red-50 p-3.5 text-red-500 hover:-translate-y-0.5 hover:bg-red-100 dark:bg-brand-brown-800 dark:text-red-400"
                    >
                      <Icon name="x-mark" className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div data-reveal className="mb-8 flex items-center gap-4 sm:mb-12">
            <div className="h-12 w-3 rounded-full bg-gradient-to-b from-brand-gold to-brand-coral"></div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-brown-500 dark:text-brand-brown-300">
                Explore More
              </div>
              <h3 className="mt-2 text-3xl font-black text-[#14324c] dark:text-white sm:text-4xl">
                {t.external_links_title}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            <ExternalLinkCard
              title="DAHD Schemes and Programmes"
              description="Explore livestock development schemes, subsidies, and official programme updates in one place."
              imageUrl={imageAssets.ui.dahd}
              url="https://dahd.gov.in/schemes-programmes"
              buttonText={t.visit_link}
            />
            <ExternalLinkCard
              title="Pashupedia"
              description="Browse a digital encyclopedia of Indian breeds, field insights, and practical animal knowledge."
              imageUrl={imageAssets.ui.pashupedia}
              url="https://dahd.gov.in/pashupdia#gsc.tab=0"
              buttonText={t.visit_link}
            />
            <ExternalLinkCard
              title="National Dairy Development Board"
              description="Stay connected to national dairy initiatives, cooperative resources, and sector-wide updates."
              imageUrl={imageAssets.ui.nddb}
              url="https://www.nddb.coop/"
              buttonText={t.visit_link}
            />
          </div>
        </section>
      </div>
    </div>
  );
};
