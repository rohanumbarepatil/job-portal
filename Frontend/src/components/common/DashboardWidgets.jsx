import React from 'react';

export const KpiCard = ({ label, value, icon, trend }) => (
  <div className="bg-white rounded-xl p-5 border border-slate-200 flex flex-col hover:border-blue-300 hover:shadow-sm transition-all">
    <div className="flex justify-between items-start mb-2">
      <div className="text-slate-500 text-sm font-medium">{label}</div>
      {icon && <div className="text-slate-400">{icon}</div>}
    </div>
    <div className="flex items-end gap-3">
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      {trend && (
        <div className={`text-xs font-bold mb-1 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </div>
      )}
    </div>
  </div>
);

export const SectionCard = ({ title, children, action, actionText }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col h-full hover:shadow-sm transition-all">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-base font-bold text-slate-900 m-0">{title}</h2>
      {action && <div onClick={action} className="text-sm font-bold text-blue-600 cursor-pointer hover:text-blue-800">{actionText || 'View All'}</div>}
    </div>
    <div className="flex-1 flex flex-col">
      {children}
    </div>
  </div>
);
