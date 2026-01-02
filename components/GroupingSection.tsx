
import React, { useState } from 'react';
import { Participant, Group } from '../types';
import { generateGroupNames } from '../services/geminiService';

interface Props {
  participants: Participant[];
}

const GroupingSection: React.FC<Props> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState<number>(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [theme, setTheme] = useState('職場菁英');

  const generateGroups = async () => {
    if (participants.length === 0) return;
    setIsGenerating(true);

    // Shuffle
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    
    // Calculate number of groups
    const groupCount = Math.ceil(shuffled.length / groupSize);
    
    // Get AI Names
    const names = await generateGroupNames(groupCount, theme);

    const newGroups: Group[] = [];
    for (let i = 0; i < groupCount; i++) {
      newGroups.push({
        id: Math.random().toString(36).substr(2, 9),
        name: names[i] || `第 ${i + 1} 組`,
        members: shuffled.slice(i * groupSize, (i + 1) * groupSize)
      });
    }

    setGroups(newGroups);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-600 mb-2">每組人數</label>
            <input
              type="number"
              min="2"
              max={participants.length}
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value) || 2)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-600 mb-2">命名主題 (AI 生成)</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1em_1em]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
            >
              <option value="職場菁英">職場菁英</option>
              <option value="宇宙探險">宇宙探險</option>
              <option value="動物森友">動物森友</option>
              <option value="超級英雄">超級英雄</option>
              <option value="美食饕客">美食饕客</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button
              onClick={generateGroups}
              disabled={isGenerating || participants.length === 0}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 disabled:bg-slate-300 disabled:shadow-none"
            >
              {isGenerating ? (
                <>
                  <i className="fas fa-circle-notch animate-spin"></i>
                  正在分析並命名小組...
                </>
              ) : (
                <>
                  <i className="fas fa-magic"></i>
                  一鍵智能分組
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Result Display */}
      {groups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, idx) => (
            <div key={group.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-md flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                  {group.name}
                </h4>
                <span className="text-xs font-medium text-slate-400">{group.members.length} 人</span>
              </div>
              <div className="p-4 space-y-2">
                {group.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-slate-700 text-sm">
                    <div className="w-2 h-2 rounded-full bg-indigo-300"></div>
                    {member.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {groups.length === 0 && participants.length > 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
          <i className="fas fa-users-viewfinder text-5xl text-slate-200 mb-4"></i>
          <p className="text-slate-400">設定完人數後點擊按鈕開始分組</p>
        </div>
      )}
    </div>
  );
};

export default GroupingSection;
