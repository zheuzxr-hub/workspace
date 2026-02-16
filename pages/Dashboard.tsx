
import React from 'react';
import { TOOLS } from '../constants';
import { Tool } from '../types';

interface DashboardProps {
  onSelectTool: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool }) => {
  return (
    <div className="max-w-[1200px] mx-auto py-10 px-6 animate-in fade-in duration-500">
      {/* Row 1 */}
      <section className="mb-16">
        <h1 className="text-3xl font-bold text-black mb-8 google-font">Potencialize sua sala de aula com IA</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS.slice(0, 4).map((tool) => (
            <ToolCard key={tool.id} tool={tool} onClick={() => onSelectTool(tool.id)} />
          ))}
        </div>
      </section>

      {/* Row 2 */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-black google-font">Descubra e recrie ideias de apps</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-black hover:bg-gray-50 transition-colors shadow-sm">
            <span>Explorar galeria de apps</span>
            <i className="fas fa-arrow-right text-xs"></i>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS.map((tool) => (
            <ToolCard key={`remix-${tool.id}`} tool={tool} onClick={() => onSelectTool(tool.id)} />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-8 text-center italic font-medium">explore variações e exporte o código.</p>
      </section>
    </div>
  );
};

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-md transition-all duration-200 text-left flex flex-col h-[220px] relative overflow-hidden"
    >
      <div className="mb-4">
        <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
          <i className={`fas ${tool.icon} text-blue-300 text-lg`}></i>
        </div>
      </div>
      <h3 className="text-base font-bold text-black mb-2 google-font">{tool.title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 font-medium">{tool.description}</p>
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
         <i className="fas fa-external-link-alt text-[10px] text-gray-300"></i>
      </div>
    </button>
  );
};

export default Dashboard;
