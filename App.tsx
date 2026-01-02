
import React, { useState, useCallback, useEffect } from 'react';
import { AppView, Participant } from './types';
import ParticipantManager from './components/ParticipantManager';
import LotterySection from './components/LotterySection';
import GroupingSection from './components/GroupingSection';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LIST_MANAGEMENT);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Load sample data initially if empty
  useEffect(() => {
    const saved = localStorage.getItem('hr_participants');
    if (saved) {
      setParticipants(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hr_participants', JSON.stringify(participants));
  }, [participants]);

  const handleUpdateParticipants = (newList: Participant[]) => {
    setParticipants(newList);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white shadow-xl flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-indigo-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-users-gear text-indigo-400"></i>
            HR Pro Toolbox
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setView(AppView.LIST_MANAGEMENT)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === AppView.LIST_MANAGEMENT ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-800'}`}
          >
            <i className="fas fa-list-ul w-5"></i>
            名單管理
          </button>
          <button
            onClick={() => setView(AppView.LUCKY_DRAW)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === AppView.LUCKY_DRAW ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-800'}`}
          >
            <i className="fas fa-trophy w-5"></i>
            獎品抽籤
          </button>
          <button
            onClick={() => setView(AppView.GROUPING)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === AppView.GROUPING ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-800'}`}
          >
            <i className="fas fa-layer-group w-5"></i>
            自動分組
          </button>
        </nav>
        <div className="p-4 border-t border-indigo-800 text-xs text-indigo-300 text-center">
          v1.0.0 &copy; 2024 HR Toolkit
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b h-16 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800 uppercase tracking-wider">
              {view === AppView.LIST_MANAGEMENT && '名單管理'}
              {view === AppView.LUCKY_DRAW && '獎品抽籤'}
              {view === AppView.GROUPING && '自動分組'}
            </h2>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
              目前人數: {participants.length}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500 hidden sm:block">
              {new Date().toLocaleDateString('zh-TW')}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full">
          {view === AppView.LIST_MANAGEMENT && (
            <ParticipantManager participants={participants} onUpdate={handleUpdateParticipants} />
          )}
          {view === AppView.LUCKY_DRAW && (
            <LotterySection participants={participants} />
          )}
          {view === AppView.GROUPING && (
            <GroupingSection participants={participants} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
