
import React, { useState, useEffect, useRef } from 'react';
import { Participant, LotteryResult } from '../types';
import { generateWinnerMessage } from '../services/geminiService';

interface Props {
  participants: Participant[];
}

const LotterySection: React.FC<Props> = ({ participants }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<Participant | null>(null);
  const [history, setHistory] = useState<LotteryResult[]>([]);
  const [displayPool, setDisplayPool] = useState<Participant[]>([]);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [aiMessage, setAiMessage] = useState<string>('');

  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Exclude existing winners if not allowing repeats
    if (!allowRepeat) {
      const winnerIds = new Set(history.map(h => h.winner.id));
      setDisplayPool(participants.filter(p => !winnerIds.has(p.id)));
    } else {
      setDisplayPool(participants);
    }
  }, [participants, history, allowRepeat]);

  const startDraw = () => {
    if (isSpinning || displayPool.length === 0) return;

    setIsSpinning(true);
    setCurrentWinner(null);
    setAiMessage('');
    
    let speed = 50;
    let duration = 3000;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      setAnimationIndex(prev => (prev + 1) % displayPool.length);

      if (elapsed < duration) {
        animationRef.current = window.setTimeout(animate, speed);
      } else {
        const finalWinner = displayPool[Math.floor(Math.random() * displayPool.length)];
        setCurrentWinner(finalWinner);
        setHistory(prev => [{ winner: finalWinner, timestamp: new Date() }, ...prev]);
        setIsSpinning(false);
        fetchAiMessage(finalWinner.name);
      }
    };

    animate();
  };

  const fetchAiMessage = async (name: string) => {
    const msg = await generateWinnerMessage(name);
    setAiMessage(msg);
  };

  const resetHistory = () => {
    setHistory([]);
    setCurrentWinner(null);
    setAiMessage('');
  };

  return (
    <div className="space-y-8">
      {/* Settings Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allowRepeat}
              onChange={(e) => setAllowRepeat(e.target.checked)}
              disabled={isSpinning}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <span className="text-sm font-medium text-slate-700">允許重複抽中</span>
          </label>
          <div className="text-sm text-slate-500">
            候選人數: <span className="font-bold text-indigo-600">{displayPool.length}</span>
          </div>
        </div>
        <button
          onClick={resetHistory}
          className="text-sm text-slate-400 hover:text-red-500 transition-colors"
        >
          重置抽獎紀錄
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Draw Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-indigo-900 rounded-[2rem] p-12 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500 opacity-10 rounded-full -ml-20 -mb-20"></div>

            {/* Slot Display */}
            <div className="relative z-10 w-full text-center">
              <div className="mb-8">
                <i className="fas fa-star text-yellow-400 text-4xl animate-pulse"></i>
              </div>

              <div className="h-24 flex items-center justify-center">
                {isSpinning ? (
                  <div className="text-6xl font-bold text-white tracking-widest drop-shadow-lg">
                    {displayPool[animationIndex]?.name || '...'}
                  </div>
                ) : currentWinner ? (
                  <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 animate-bounce tracking-widest">
                    {currentWinner.name}
                  </div>
                ) : (
                  <div className="text-3xl font-medium text-indigo-300">
                    {participants.length === 0 ? '請先匯入名單' : '準備好抽大獎了嗎？'}
                  </div>
                )}
              </div>

              {aiMessage && !isSpinning && (
                <div className="mt-8 bg-indigo-800/50 backdrop-blur p-4 rounded-xl border border-indigo-700 max-w-md mx-auto">
                  <p className="text-indigo-100 italic text-sm">" {aiMessage} "</p>
                </div>
              )}

              <div className="mt-12">
                <button
                  onClick={startDraw}
                  disabled={isSpinning || displayPool.length === 0}
                  className={`px-12 py-4 rounded-full text-xl font-bold transition-all shadow-xl transform active:scale-95 ${
                    isSpinning || displayPool.length === 0
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-yellow-500/40 hover:-translate-y-1'
                  }`}
                >
                  {isSpinning ? '正在開獎...' : '立即抽籤'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* History Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-[520px]">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <i className="fas fa-history text-indigo-400"></i>
            中獎紀錄
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-40">
                <i className="fas fa-box-open text-3xl mb-2"></i>
                <p className="text-sm">尚無開獎紀錄</p>
              </div>
            ) : (
              history.map((res, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="flex items-center gap-3">
                    <span className="bg-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600">
                      {history.length - i}
                    </span>
                    <span className="font-bold text-slate-800">{res.winner.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {res.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotterySection;
