
import React, { useState } from 'react';
import { Participant } from '../types';

interface Props {
  participants: Participant[];
  onUpdate: (newList: Participant[]) => void;
}

const ParticipantManager: React.FC<Props> = ({ participants, onUpdate }) => {
  const [textInput, setTextInput] = useState('');

  const handleAddFromText = () => {
    const names = textInput
      .split(/[\n,]+/)
      .map(n => n.trim())
      .filter(n => n.length > 0);
    
    if (names.length === 0) return;

    const newParticipants: Participant[] = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));

    onUpdate([...participants, ...newParticipants]);
    setTextInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
      
      const newParticipants: Participant[] = lines.map(line => {
        // Simple CSV parse: take first column
        const name = line.split(',')[0].replace(/"/g, '').trim();
        return {
          id: Math.random().toString(36).substr(2, 9),
          name
        };
      }).filter(p => p.name !== 'Name' && p.name !== '姓名'); // Skip header if present

      onUpdate([...participants, ...newParticipants]);
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const clearAll = () => {
    if (confirm('確定要清除所有名單嗎？')) {
      onUpdate([]);
    }
  };

  const removeItem = (id: string) => {
    onUpdate(participants.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <i className="fas fa-plus-circle text-indigo-500"></i>
              新增成員
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">貼上姓名 (以換行或逗號分隔)</label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full h-32 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                placeholder="例如：王小明, 李大華, 張小芬..."
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleAddFromText}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
              >
                加入名單
              </button>
            </div>

            <div className="relative border-t border-slate-100 pt-4">
              <div className="absolute inset-x-0 -top-3 flex justify-center">
                <span className="bg-white px-2 text-xs text-slate-400">或</span>
              </div>
              <label className="block w-full cursor-pointer bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-100 transition-colors">
                <i className="fas fa-file-csv text-slate-400 text-2xl mb-2"></i>
                <span className="block text-sm text-slate-600 font-medium">上傳 CSV 檔案</span>
                <span className="block text-xs text-slate-400 mt-1">只取第一欄為姓名</span>
                <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        </section>

        {/* List Preview */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-700">成員預覽 ({participants.length})</h3>
            <button
              onClick={clearAll}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              全部清空
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {participants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <i className="fas fa-ghost text-4xl mb-2 opacity-20"></i>
                <p>目前還沒有人喔</p>
              </div>
            ) : (
              participants.map((p, idx) => (
                <div key={p.id} className="group flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <span className="text-slate-700">
                    <span className="text-slate-400 text-xs mr-3 font-mono">{String(idx + 1).padStart(2, '0')}</span>
                    {p.name}
                  </span>
                  <button
                    onClick={() => removeItem(p.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ParticipantManager;
