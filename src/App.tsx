import React, { useState } from 'react';
import { LayoutDashboard, Users, Megaphone, BarChart3, Settings, Sparkles, UserPlus, Send, Loader2, DollarSign, Target, TrendingUp, Briefcase, Wallet, ChevronDown, Check, Share2, Lock } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { AnimatePresence, motion } from 'motion/react';

const getAi = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    console.error("GEMINI API KEY is missing. Please add it to your environment variables or token.env file.");
    // Return a dummy object to prevent complete crash if missing, handle errors at generation time
    return {
      models: {
        generateContent: async () => {
          throw new Error("API Key missing. Cannot generate content.");
        }
      }
    } as unknown as GoogleGenAI;
  }
  return new GoogleGenAI({ apiKey: key });
};

type Lead = {
  id: string;
  name: string;
  value: number;
  status: 'Discovery' | 'Proposal Sent' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  date: string;
};

type Campaign = {
  id: string;
  platform: string;
  budget: number;
  spent: number;
  status: 'Active' | 'Paused' | 'Completed';
  leadsGenerated: number;
};

type SocialPost = {
  id: string;
  platform: string;
  type?: string;
  topic: string;
  date: string;
  status: string;
  likes?: string;
  caption?: string;
  mediaPrompt?: string;
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [activeCompany, setActiveCompany] = useState('Montana Design Co');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'Montana Design Company', value: 150000, status: 'Negotiation', date: '2026-04-15' },
    { id: '2', name: 'Pintlar Peak Coffee', value: 45000, status: 'Proposal Sent', date: '2026-04-15' },
  ]);
  
  const tools = [
    { id: 'home', label: 'Home', icon: <LayoutDashboard size={16} /> },
    { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard size={16} /> },
    { id: 'crm', label: 'Lead Pipelines', icon: <Users size={16} /> },
    { id: 'projects', label: 'Active Projects', icon: <Briefcase size={16} /> },
    { id: 'marketing', label: 'Marketing Assets', icon: <Megaphone size={16} /> },
    { id: 'social', label: 'Social Media', icon: <Share2 size={16} /> },
    { id: 'campaigns', label: 'Market Analysis', icon: <BarChart3 size={16} /> },
    { id: 'financials', label: 'Financials', icon: <Wallet size={16} /> },
    { id: 'settings', label: 'Executive Portal', icon: <Settings size={16} /> }
  ];

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-bg-deep text-text-primary font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border-color bg-card-bg flex flex-col py-10 px-6 z-10 shrink-0">
        <div className="mb-14 border-b border-border-color pb-4 flex gap-2">
          {['Montana Design Co', 'Pintlar Peak Coffee'].map(company => (
            <button
              key={company}
              onClick={() => setActiveCompany(company)}
              className={`flex-1 text-[10px] uppercase tracking-[1px] py-2 px-2 rounded-xl border transition-colors ${
                activeCompany === company 
                  ? 'bg-accent-green/10 border-accent-green text-accent-green font-bold' 
                  : 'bg-transparent border-border-color text-text-secondary hover:border-text-secondary'
              }`}
            >
              {company === 'Montana Design Co' ? 'MDC' : 'PPC'}
            </button>
          ))}
        </div>
        
        <div className="relative flex-1">
          <div className="text-[10px] text-text-secondary uppercase tracking-[2px] mb-4">Navigation</div>
          <button 
            onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
            className="w-full bg-bg-deep border border-border-color rounded-xl p-4 flex items-center justify-between text-[13px] uppercase tracking-[1px] text-text-primary hover:border-accent-green transition-colors focus:outline-none"
          >
            <span className="flex items-center gap-3">
              {tools.find(t => t.id === activeTab)?.icon}
              <span className="truncate">{tools.find(t => t.id === activeTab)?.label}</span>
            </span>
            <ChevronDown size={16} className={`transition-transform duration-300 ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isToolsDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-[80px] left-0 w-full bg-card-bg border border-border-color rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col py-2"
              >
                {tools.map((tool) => (
                  <button 
                    key={tool.id}
                    onClick={() => { setActiveTab(tool.id); setIsToolsDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-[11px] uppercase tracking-[1px] transition-colors flex items-center gap-3 ${activeTab === tool.id ? 'text-accent-green bg-bg-deep' : 'text-text-secondary hover:text-text-primary hover:bg-bg-deep'}`}
                  >
                    {tool.icon}
                    <span className="flex-1 truncate">{tool.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12 flex flex-col gap-8">
        <header className="flex justify-between items-end">
          <div>
            <div className="text-[11px] text-text-secondary uppercase tracking-[2px] mb-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <h1 className="font-serif text-[32px] font-normal text-text-primary">
              {activeTab === 'home' && 'AI Manager Environment'}
              {activeTab === 'dashboard' && 'Sales Strategy Hub'}
              {activeTab === 'crm' && 'Lead Pipelines'}
              {activeTab === 'projects' && 'Active Projects'}
              {activeTab === 'marketing' && 'Marketing Assets'}
              {activeTab === 'social' && 'Social Media'}
              {activeTab === 'campaigns' && 'Market Analysis'}
              {activeTab === 'financials' && 'Financial Overview'}
              {activeTab === 'settings' && 'Executive Portal'}
            </h1>
            {activeTab === 'home' && (
              <div className="text-[12px] text-red-500 uppercase tracking-[3px] mt-2 font-bold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                AUTHORIZED USE ONLY
              </div>
            )}
          </div>
          <div className="text-[11px] text-text-secondary uppercase tracking-[2px]">
            Lead Conversion: +12.4%
          </div>
        </header>

        {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} tools={tools} />}
        {activeTab === 'dashboard' && <DashboardView leads={leads} />}
        {activeTab === 'crm' && <CRMView leads={leads} setLeads={setLeads} />}
        {activeTab === 'projects' && <ProjectsView />}
        {activeTab === 'marketing' && <MarketingView activeCompany={activeCompany} />}
        {activeTab === 'social' && <SocialMediaMarketingView activeCompany={activeCompany} />}
        {activeTab === 'campaigns' && <CampaignsView />}
        {activeTab === 'financials' && <FinancialsView />}
        {activeTab === 'settings' && (
          <div className="bg-card-bg border border-border-color p-8 rounded-2xl shadow-sm">
            <div className="font-serif text-[18px] mb-5 text-text-primary">Executive Portal</div>
            <p className="text-[13px] text-text-secondary">Settings configuration will go here.</p>
          </div>
        )}
        
        <div className="text-[10px] text-text-secondary opacity-50 text-right mt-8 pt-6 border-t border-border-color">
          Montana Design Company Proprietary Management System &copy; {new Date().getFullYear()}
        </div>
      </main>
    </div>
  );
}

function HomeView({ setActiveTab, tools }: { setActiveTab: (t: string) => void, tools: any[] }) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 rounded-full border border-accent-green/20 bg-accent-green/10 flex items-center justify-center text-accent-green shadow-[0_0_50px_rgba(16,185,129,0.15)]">
        <Sparkles size={40} />
      </div>
      <div>
        <h2 className="text-2xl font-serif text-text-primary mb-3">Welcome to the AI Manager Environment</h2>
        <p className="text-text-secondary leading-relaxed">
          This secure terminal provides full access to your business operations. Connect pipelines, execute social campaigns, and generate deep-learning sales strategies.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full mt-8">
        {tools.filter(t => t.id !== 'home').slice(0,4).map(tool => (
          <button 
            key={tool.id} 
            onClick={() => setActiveTab(tool.id)}
            className="flex items-center gap-3 p-4 bg-card-bg border border-border-color rounded-xl hover:border-accent-green hover:bg-bg-deep transition-all group"
          >
            <div className="text-text-secondary group-hover:text-accent-green transition-colors">
              {tool.icon}
            </div>
            <span className="text-sm tracking-wide">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center py-3 text-[13px] uppercase tracking-[1px] transition-all duration-200 text-left ${
        active 
          ? 'text-accent-green font-semibold' 
          : 'text-text-secondary hover:text-accent-green'
      }`}
    >
      <span className="mr-3 opacity-50">—</span>
      <span className="flex-1">{label}</span>
    </button>
  );
}

function DashboardView({ leads }: { leads: Lead[] }) {
  return (
    <>
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard title="Quarterly Pipeline" value={`$${leads.reduce((sum, l) => sum + l.value, 0).toLocaleString()}`} />
        <StatCard title="Active Campaigns" value="08" />
        <StatCard title="Marketing ROI" value="4.2x" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-8 flex-grow">
        {/* Quick AI Prompt */}
        <div className="bg-card-bg border border-border-color p-8 rounded-2xl shadow-sm flex flex-col">
          <div className="font-serif text-[18px] mb-5 flex justify-between items-center text-text-primary">
            AI Engine
            <span className="text-[10px] font-sans not-italic uppercase text-accent-green border border-accent-green px-2 py-0.5 rounded-[10px]">Lead Gen</span>
          </div>
          <QuickAIAssistant />
        </div>

        {/* Recent Leads */}
        <div className="bg-card-bg border border-border-color p-8 rounded-2xl shadow-sm flex flex-col">
          <div className="font-serif text-[18px] mb-5 flex justify-between items-center text-text-primary">
            High-Value Pipelines
            <span className="text-[10px] font-sans not-italic uppercase text-accent-green border border-accent-green px-2 py-0.5 rounded-[10px]">Live</span>
          </div>
          <RecentLeadsList leads={leads} />
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value }: { title: string, value: string }) {
  return (
    <div className="bg-card-bg border border-border-color p-8 rounded-2xl shadow-sm">
      <div className="text-[10px] uppercase tracking-[1px] text-text-secondary mb-2">{title}</div>
      <div className="font-serif text-[24px] text-accent-green">{value}</div>
    </div>
  );
}

function QuickAIAssistant() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const ai = getAi();
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `As the Lead Sales & Marketing Manager for Montana Design Company, provide a quick, 2-3 sentence response or idea for the following: ${input}`,
        config: {
          systemInstruction: "You are the Lead Sales & Marketing Manager for Montana Design Company. Keep responses very concise, professional, and focused on luxury design.",
        }
      });
      setResponse(result.text || "");
    } catch (error) {
      setResponse("Error generating response.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <textarea 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Target: High-end luxury real estate owners in Aspen. Objective: 3-part intro sequence..."
        className="w-full bg-bg-deep border border-border-color rounded-2xl shadow-sm p-3 text-[13px] text-text-primary focus:outline-none focus:border-accent-green transition-colors resize-none h-[120px] mb-3"
      />
      <button 
        onClick={handleGenerate}
        disabled={isLoading || !input.trim()}
        className="w-full bg-accent-green text-white rounded-xl p-3 font-bold uppercase text-[11px] tracking-[1px] hover:bg-emerald-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {isLoading ? <Loader2 className="animate-spin" size={16} /> : null}
        {isLoading ? 'Generating...' : 'Generate Growth Strategy'}
      </button>
      
      {response ? (
        <div className="mt-4 p-3 bg-bg-deep border border-border-color rounded-2xl shadow-sm">
          <p className="text-[13px] text-text-primary whitespace-pre-wrap">{response}</p>
        </div>
      ) : (
        <div className="text-[11px] text-text-secondary mt-3 italic leading-[1.4]">
          “Crafting value-based narratives focused on Montana's architectural heritage.”
        </div>
      )}
    </div>
  );
}

function RecentLeadsList({ leads }: { leads: Lead[] }) {
  return (
    <table className="w-full text-[13px] text-left border-collapse">
      <thead>
        <tr>
          <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Client & Project</th>
          <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Status</th>
          <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Est. Value</th>
        </tr>
      </thead>
      <tbody>
        {leads.slice(0, 4).map((lead) => (
          <tr key={lead.id}>
            <td className="py-3.5 border-b border-border-color">
              <div className="font-medium text-text-primary">{lead.name}</div>
            </td>
            <td className="py-3.5 border-b border-border-color text-text-primary">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-green mr-1.5"></span>
              {lead.status}
            </td>
            <td className="py-3.5 border-b border-border-color text-text-primary">${lead.value.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CRMView({ leads, setLeads }: { leads: Lead[], setLeads: React.Dispatch<React.SetStateAction<Lead[]>> }) {
  const [newLead, setNewLead] = useState({ name: '', value: '', status: 'Discovery' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddLead = () => {
    if (!newLead.name || !newLead.value) return;
    
    if (editingId) {
      setLeads(leads.map(l => l.id === editingId ? {
        ...l,
        name: newLead.name,
        value: Number(newLead.value),
        status: newLead.status as any
      } : l));
      setEditingId(null);
    } else {
      setLeads([
        {
          id: Date.now().toString(),
          name: newLead.name,
          value: Number(newLead.value),
          status: newLead.status as any,
          date: new Date().toISOString().split('T')[0]
        },
        ...leads
      ]);
    }
    
    setNewLead({ name: '', value: '', status: 'Discovery' });
  };

  const handleEdit = (lead: Lead) => {
    setNewLead({ name: lead.name, value: lead.value.toString(), status: lead.status });
    setEditingId(lead.id);
  };

  const handleDelete = (id: string) => {
    setLeads(leads.filter(l => l.id !== id));
  };

  return (
    <div className="flex flex-col gap-8 flex-grow">
      {/* Add Lead Form */}
      <div className="bg-card-bg border border-border-color p-8 rounded-2xl shadow-sm">
        <div className="font-serif text-[18px] mb-5 flex justify-between items-center text-text-primary">
          {editingId ? 'Edit Lead' : 'Quick Lead Entry'}
          <span className="text-[10px] font-sans not-italic uppercase text-accent-green border border-accent-green px-2 py-0.5 rounded-[10px]">
            {editingId ? 'Edit' : 'New'}
          </span>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-[10px] uppercase tracking-[1px] text-text-secondary mb-2">Client / Project Name</label>
            <input 
              type="text" 
              value={newLead.name}
              onChange={(e) => setNewLead({...newLead, name: e.target.value})}
              className="w-full bg-bg-deep border border-border-color rounded-2xl shadow-sm p-3 text-[13px] text-text-primary focus:outline-none focus:border-accent-green transition-colors"
              placeholder="E.g., Ritz Carlton Reno"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-[10px] uppercase tracking-[1px] text-text-secondary mb-2">Est. Value ($)</label>
            <input 
              type="number" 
              value={newLead.value}
              onChange={(e) => setNewLead({...newLead, value: e.target.value})}
              className="w-full bg-bg-deep border border-border-color rounded-2xl shadow-sm p-3 text-[13px] text-text-primary focus:outline-none focus:border-accent-green transition-colors"
              placeholder="25000"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-[10px] uppercase tracking-[1px] text-text-secondary mb-2">Status</label>
            <select 
              value={newLead.status}
              onChange={(e) => setNewLead({...newLead, status: e.target.value})}
              className="w-full bg-bg-deep border border-border-color rounded-2xl shadow-sm p-3 text-[13px] text-text-primary focus:outline-none focus:border-accent-green transition-colors"
            >
              <option className="bg-card-bg text-text-primary" value="Discovery">Discovery</option>
              <option className="bg-card-bg text-text-primary" value="Proposal Sent">Proposal Sent</option>
              <option className="bg-card-bg text-text-primary" value="Negotiation">Negotiation</option>
            </select>
          </div>
          <button 
            onClick={handleAddLead}
            className="w-full md:w-auto bg-accent-green text-white rounded-xl px-6 py-3 font-bold uppercase text-[11px] tracking-[1px] hover:bg-emerald-700 transition-colors flex items-center justify-center h-[43px]"
          >
            {editingId ? 'Update' : 'Add Lead'}
          </button>
          {editingId && (
            <button 
              onClick={() => {
                setEditingId(null);
                setNewLead({ name: '', value: '', status: 'Discovery' });
              }}
              className="w-full md:w-auto bg-transparent border border-border-color text-text-secondary rounded-xl px-6 py-3 font-bold uppercase text-[11px] tracking-[1px] hover:text-text-primary transition-colors flex items-center justify-center h-[43px]"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-card-bg border border-border-color p-8 rounded-2xl shadow-sm flex-grow">
        <div className="font-serif text-[18px] mb-5 flex justify-between items-center text-text-primary">
          Current Pipeline
          <span className="text-[10px] font-sans not-italic uppercase text-accent-green border border-accent-green px-2 py-0.5 rounded-[10px]">Live</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left border-collapse">
            <thead>
              <tr>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Client</th>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Value</th>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Status</th>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Date Added</th>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="group">
                  <td className="py-3.5 border-b border-border-color font-medium text-text-primary">{lead.name}</td>
                  <td className="py-3.5 border-b border-border-color font-mono text-[13px] text-text-primary">${lead.value.toLocaleString()}</td>
                  <td className="py-3.5 border-b border-border-color text-text-primary">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-green mr-1.5"></span>
                    {lead.status}
                  </td>
                  <td className="py-3.5 border-b border-border-color text-text-secondary">{lead.date}</td>
                  <td className="py-3.5 border-b border-border-color text-right space-x-3">
                    <button 
                      onClick={() => handleEdit(lead)}
                      className="text-text-secondary hover:text-accent-green transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(lead.id)}
                      className="text-text-secondary hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MarketingView({ activeCompany }: { activeCompany: string }) {
  const [promptType, setPromptType] = useState('mail_campaign');
  const [context, setContext] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!context.trim()) return;
    
    setIsLoading(true);
    try {
      let systemPrompt = `You are the Lead Sales & Marketing Manager for ${activeCompany}. 
Your Tone: Sophisticated, professional, creative, and highly persuasive. You speak with the authority of a seasoned design industry executive.
Your Expertise: Luxury branding, interior/graphic design trends, lead generation, CRM management, and high-conversion advertising.
Core Objectives: Convert high-value prospects, create marketing campaigns showcasing the '${activeCompany}' aesthetic, manage sales pipeline, analyze market trends.
Always prioritize the brand reputation of ${activeCompany}. Focus on Value-Based Selling rather than competing on price.`;

      let userPrompt = "";
      if (promptType === 'mail_campaign') {
        userPrompt = `Draft a mail campaign for the following prospect/scenario: ${context}. Make it professional, not spammy, and highlight our unique luxury design approach.`;
      } else if (promptType === 'ad_campaign') {
        userPrompt = `Create an ad campaign strategy for the following scenario: ${context}. Include target audience segments, ad copy for a carousel ad, and a hook for a short video ad.`;
      } else if (promptType === 'sales_script') {
        userPrompt = `Draft a deal closing script or response to a client objection for the following scenario: ${context}. Justify our premium pricing by focusing on ROI and the ${activeCompany} quality standard.`;
      } else if (promptType === 'social_media_campaign') {
        userPrompt = `Create a social media campaign for the following topic/focus: ${context}. Include captions, visual suggestions, and hashtags.`;
      }

      const ai = getAi();
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      setResponse(result.text || "No response generated.");
    } catch (error) {
      console.error("Error generating content:", error);
      setResponse("An error occurred while generating the content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-8 h-[calc(100vh-12rem)]">
      {/* Input Section */}
      <div className="bg-card-bg border border-border-color p-8 rounded-2xl shadow-sm flex flex-col">
        <div className="font-serif text-[18px] mb-5 flex justify-between items-center text-text-primary">
          Strategy Generator
          <span className="text-[10px] font-sans not-italic uppercase text-accent-green border border-accent-green px-2 py-0.5 rounded-[10px]">AI Engine</span>
        </div>
        
        <div className="space-y-5 flex-1 flex flex-col">
          <div>
            <label className="block text-[10px] uppercase tracking-[1px] text-text-secondary mb-2">Content Type</label>
            <select 
              value={promptType}
              onChange={(e) => setPromptType(e.target.value)}
              className="w-full bg-bg-deep border border-border-color rounded-2xl shadow-sm p-3 text-[13px] text-text-primary focus:outline-none focus:border-accent-green transition-colors appearance-none"
            >
              <option className="bg-card-bg text-text-primary" value="mail_campaign">Mail campaign</option>
              <option className="bg-card-bg text-text-primary" value="social_media_campaign">Social media campaign</option>
              <option className="bg-card-bg text-text-primary" value="ad_campaign">Ad campaign</option>
              <option className="bg-card-bg text-text-primary" value="sales_script">Sales script</option>
            </select>
          </div>
          
          <div className="flex-1 flex flex-col">
            <label className="block text-[10px] uppercase tracking-[1px] text-text-secondary mb-2">Context / Prospect Details</label>
            <textarea 
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Target: High-end luxury real estate owners in Aspen. Objective: 3-part intro sequence..."
              className="w-full flex-1 bg-bg-deep border border-border-color rounded-2xl shadow-sm p-3 text-[13px] text-text-primary focus:outline-none focus:border-accent-green transition-colors resize-none min-h-[200px]"
            />
          </div>
        </div>
        
        <button 
          onClick={handleGenerate}
          disabled={isLoading || !context.trim()}
          className="mt-5 w-full bg-accent-green text-white rounded-xl p-3 font-bold uppercase text-[11px] tracking-[1px] hover:bg-emerald-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isLoading ? <Loader2 className="animate-spin" size={16} /> : null}
          {isLoading ? 'Generating...' : 'Generate Growth Strategy'}
        </button>
      </div>

      {/* Output Section */}
      <div className="bg-card-bg border border-border-color p-8 rounded-2xl shadow-sm flex flex-col">
        <div className="font-serif text-[18px] mb-5 flex justify-between items-center text-text-primary">
          AI Response
          {response && (
            <button 
              onClick={() => navigator.clipboard.writeText(response)}
              className="text-[10px] font-sans not-italic uppercase text-accent-green border border-accent-green px-2 py-0.5 rounded-[10px] hover:bg-accent-green hover:text-white transition-colors"
            >
              Copy
            </button>
          )}
        </div>
        
        <div className="flex-1 bg-bg-deep rounded-2xl shadow-sm p-8 overflow-y-auto border border-border-color">
          {response ? (
            <div className="text-[13px] text-text-primary whitespace-pre-wrap">
              {response}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-text-secondary opacity-50">
              <Sparkles size={48} className="mb-4 text-accent-green" />
              <p className="text-[13px]">Your generated strategy will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CampaignsView() {
  const campaigns: Campaign[] = [
    { id: '1', platform: 'Meta (Instagram/FB)', budget: 2000, spent: 850, status: 'Active', leadsGenerated: 14 },
    { id: '2', platform: 'LinkedIn B2B', budget: 1500, spent: 1500, status: 'Completed', leadsGenerated: 8 },
    { id: '3', platform: 'Google Search', budget: 1000, spent: 240, status: 'Active', leadsGenerated: 3 },
  ];

  return (
    <div className="flex flex-col gap-8 flex-grow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard title="Total Budget" value="$4,500" />
        <StatCard title="Total Spent" value="$2,590" />
        <StatCard title="Leads from Ads" value="25" />
      </div>

      <div className="bg-card-bg border border-border-color p-8 rounded-2xl shadow-sm flex-grow">
        <div className="font-serif text-[18px] mb-5 flex justify-between items-center text-text-primary">
          Active Campaigns
          <button className="bg-accent-green text-white rounded-xl px-4 py-2 font-bold uppercase text-[10px] tracking-[1px] hover:bg-emerald-700 transition-colors">
            New Campaign
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left border-collapse">
            <thead>
              <tr>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Platform</th>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Budget</th>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Spent</th>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Leads</th>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Status</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((camp) => (
                <tr key={camp.id}>
                  <td className="py-3.5 border-b border-border-color font-medium text-text-primary">{camp.platform}</td>
                  <td className="py-3.5 border-b border-border-color font-mono text-[13px] text-text-primary">${camp.budget.toLocaleString()}</td>
                  <td className="py-3.5 border-b border-border-color">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[13px] text-text-primary">${camp.spent.toLocaleString()}</span>
                      <div className="w-24 h-1.5 bg-bg-deep rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent-green rounded-full" 
                          style={{ width: `${(camp.spent / camp.budget) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 border-b border-border-color font-mono text-[13px] text-text-primary">{camp.leadsGenerated}</td>
                  <td className="py-3.5 border-b border-border-color text-text-primary">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-green mr-1.5"></span>
                    {camp.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProjectsView() {
  const projects = [
    { id: '1', name: 'The Heights Hotel', phase: 'Concept Design', deadline: '2026-05-15', progress: 25 },
    { id: '2', name: 'Sterling Residence', phase: 'Execution', deadline: '2026-06-01', progress: 80 },
    { id: '3', name: 'Oasis Corporate Plaza', phase: 'Drafting', deadline: '2026-07-20', progress: 45 },
  ];

  return (
    <div className="flex flex-col gap-8 flex-grow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard title="Active Projects" value="12" />
        <StatCard title="Upcoming Deadlines" value="3" />
        <StatCard title="Avg. Completion Time" value="4.2 mo" />
      </div>

      <div className="bg-card-bg border border-border-color p-8 rounded-2xl shadow-sm flex-grow">
        <div className="font-serif text-[18px] mb-5 flex justify-between items-center text-text-primary">
          Active Projects
          <button className="bg-accent-green text-white rounded-xl px-4 py-2 font-bold uppercase text-[10px] tracking-[1px] hover:bg-emerald-700 transition-colors">
            New Project
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left border-collapse">
            <thead>
              <tr>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Project Name</th>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Phase</th>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Deadline</th>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Progress</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj.id}>
                  <td className="py-3.5 border-b border-border-color font-medium text-text-primary">{proj.name}</td>
                  <td className="py-3.5 border-b border-border-color text-text-primary">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-green mr-1.5"></span>
                    {proj.phase}
                  </td>
                  <td className="py-3.5 border-b border-border-color text-text-secondary">{proj.deadline}</td>
                  <td className="py-3.5 border-b border-border-color">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[13px] text-text-primary">{proj.progress}%</span>
                      <div className="w-24 h-1.5 bg-bg-deep rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent-green rounded-full" 
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FinancialsView() {
  const invoices = [
    { id: 'INV-001', client: 'The Heights Hotel', amount: 25000, status: 'Paid', date: '2026-04-01' },
    { id: 'INV-002', client: 'Sterling Residence', amount: 15000, status: 'Pending', date: '2026-04-10' },
    { id: 'INV-003', client: 'Oasis Corporate Plaza', amount: 45000, status: 'Overdue', date: '2026-03-15' },
  ];

  return (
    <div className="flex flex-col gap-8 flex-grow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard title="YTD Revenue" value="$845,000" />
        <StatCard title="Outstanding Invoices" value="$60,000" />
        <StatCard title="Projected Q2" value="$1.2M" />
      </div>

      <div className="bg-card-bg border border-border-color p-8 rounded-2xl shadow-sm flex-grow">
        <div className="font-serif text-[18px] mb-5 flex justify-between items-center text-text-primary">
          Recent Invoices
          <button className="bg-accent-green text-white rounded-xl px-4 py-2 font-bold uppercase text-[10px] tracking-[1px] hover:bg-emerald-700 transition-colors">
            Create Invoice
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left border-collapse">
            <thead>
              <tr>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Invoice ID</th>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Client</th>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Amount</th>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Date</th>
                <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-3.5 border-b border-border-color font-mono text-text-secondary">{inv.id}</td>
                  <td className="py-3.5 border-b border-border-color font-medium text-text-primary">{inv.client}</td>
                  <td className="py-3.5 border-b border-border-color font-mono text-[13px] text-text-primary">${inv.amount.toLocaleString()}</td>
                  <td className="py-3.5 border-b border-border-color text-text-secondary">{inv.date}</td>
                  <td className="py-3.5 border-b border-border-color text-text-primary">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
                      inv.status === 'Paid' ? 'bg-green-500' :
                      inv.status === 'Pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></span>
                    {inv.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SocialMediaMarketingView({ activeCompany }: { activeCompany: string }) {
  const [posts, setPosts] = useState<SocialPost[]>([
    { id: '1', platform: 'Instagram', type: 'Carousel', topic: activeCompany === 'Pintlar Peak Coffee' ? 'New Roast Reveal' : 'Luxury Living Room Reveal', date: '2026-04-18', status: 'Scheduled', likes: '-', caption: 'Elevating the standard! Check out what we just delivered ✨ #design', mediaPrompt: 'A highly detailed photograph of a luxurious living room with warm ambient lighting and sleek modern furniture.' },
    { id: '2', platform: 'LinkedIn', type: 'Article', topic: activeCompany === 'Pintlar Peak Coffee' ? 'Sustainable Sourcing' : 'Commercial Design Value', date: '2026-04-15', status: 'Published', likes: '342', caption: 'Sustainability in design isn’t a trend, it’s a commitment. Read our latest article on impact-driven sourcing.', mediaPrompt: 'A professional corporate scene showing eco-friendly architectural models or sustainable coffee farm sourcing.' },
    { id: '3', platform: 'TikTok', type: 'Short Video', topic: activeCompany === 'Pintlar Peak Coffee' ? 'Barista POV' : 'Office Tour', date: '2026-04-12', status: 'Published', likes: '1.2k', caption: 'Step inside our world! 🚀🔥', mediaPrompt: 'Veo Video Prompt: A cinematic tracking shot entering a bustling creative studio or contemporary coffee shop.' },
  ]);

  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [campaignTopic, setCampaignTopic] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDelete = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      if (posts.find(p => p.id === editingPost.id)) {
        setPosts(posts.map(p => p.id === editingPost.id ? editingPost : p));
      } else {
        setPosts([editingPost, ...posts]);
      }
      setEditingPost(null);
    }
  };

  const handleGenerateWeek = async () => {
    if (!campaignTopic.trim()) return;
    setIsGenerating(true);
    
    try {
      const systemPrompt = `You are an elite, modern Social Media Director for ${activeCompany}.
Your task is to generate a trendy, catchy 7-day social media content calendar focusing on the topic: "${campaignTopic}".
Deep thinking is required: research modern hook structures, viral aesthetics, and the best platforms for the brand. Incorporate TikTok, Instagram, and LinkedIn prominently.
MANDATORY: Return ONLY a raw JSON array of 5-7 objects. No markdown code blocks, no backticks, just the RAW JSON array.
Schema per object:
{
  "platform": "Instagram" | "LinkedIn" | "TikTok" | "X / Twitter" | "Pinterest",
  "topic": "Short post concept",
  "caption": "Post caption including emojis, hooks, and hashtags",
  "mediaPrompt": "Highly detailed image generation prompt for Nano Banana or video generation prompt for Veo explaining the exact visual/scene.",
  "status": "Scheduled",
  "dateOffset": 1
}`;
      
      const ai = getAi();
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Generate the JSON calendar now.",
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      const text = result.text || "[]";
      // Ensure we strip out any markdown blocks if the AI still adds them
      const cleanJson = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const generated = JSON.parse(cleanJson);
      
      if (Array.isArray(generated)) {
        const newPosts: SocialPost[] = generated.map((gen: any, idx) => {
          const d = new Date(startDate);
          d.setDate(d.getDate() + (gen.dateOffset || idx));
          return {
            id: 'gen-' + Date.now() + '-' + idx,
            platform: gen.platform || 'Instagram',
            topic: gen.topic || 'New Post',
            caption: gen.caption || '',
            mediaPrompt: gen.mediaPrompt || '',
            date: d.toISOString().split('T')[0],
            status: gen.status || 'Scheduled',
            likes: '-',
            type: gen.platform === 'TikTok' ? 'Short Video' : 'Image'
          };
        });
        setPosts([...newPosts, ...posts]);
        setCampaignTopic('');
      }
    } catch (e) {
      console.error(e);
      alert("Failed to generate campaign. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 flex-grow relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard title="Total Audience" value="124.5k" />
        <StatCard title="Avg. Engagement" value="4.8%" />
        <StatCard title="Posts This Month" value="24" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 flex-grow">
         <div className="bg-card-bg border border-border-color p-8 rounded-2xl shadow-sm flex flex-col relative overflow-hidden">
            <div className="font-serif text-[18px] mb-5 flex justify-between items-center text-text-primary">
              Content Calendar
              <div className="flex gap-4 items-center">
                <div className="flex bg-bg-deep rounded-xl p-1 border border-border-color">
                  <button onClick={() => setViewMode('table')} className={`text-[10px] uppercase px-3 py-1 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-accent-green text-bg-deep font-bold' : 'text-text-secondary hover:text-text-primary'}`}>Table</button>
                  <button onClick={() => setViewMode('calendar')} className={`text-[10px] uppercase px-3 py-1 rounded-lg transition-colors ${viewMode === 'calendar' ? 'bg-accent-green text-bg-deep font-bold' : 'text-text-secondary hover:text-text-primary'}`}>Grid</button>
                </div>
                <button 
                  onClick={() => setEditingPost({
                    id: 'new-' + Date.now(),
                    platform: 'Instagram',
                    topic: '',
                    date: new Date().toISOString().split('T')[0],
                    status: 'Draft',
                    type: 'Image'
                  })}
                  className="bg-accent-green/10 text-accent-green hover:bg-accent-green hover:text-bg-deep transition-colors px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-[1px] font-bold"
                >
                  + New Post
                </button>
              </div>
            </div>
            <div className="flex-grow h-[300px] overflow-y-auto pr-2">
              {viewMode === 'table' ? (
                <table className="w-full text-[13px] text-left border-collapse">
                  <thead>
                    <tr className="sticky top-0 bg-card-bg z-10 shadow-sm">
                      <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Platform</th>
                      <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Topic</th>
                      <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Date</th>
                      <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color">Status</th>
                      <th className="text-text-secondary font-normal uppercase text-[10px] tracking-[1px] pb-3 border-b border-border-color text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id} className="group hover:bg-bg-deep transition-colors">
                        <td className="py-3.5 border-b border-border-color font-medium text-text-primary px-2">{post.platform}</td>
                        <td className="py-3.5 border-b border-border-color text-text-secondary w-1/3 truncate">{post.topic}</td>
                        <td className="py-3.5 border-b border-border-color text-text-secondary">{post.date}</td>
                        <td className="py-3.5 border-b border-border-color text-text-primary">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-green mr-1.5"></span>
                          {post.status}
                        </td>
                        <td className="py-3.5 border-b border-border-color text-right space-x-3 px-2">
                          <button 
                            onClick={() => setEditingPost(post)}
                            className="text-text-secondary hover:text-accent-green transition-colors opacity-0 group-hover:opacity-100"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(post.id)}
                            className="text-text-secondary hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                  {[...posts].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(post => (
                    <div key={post.id} className="bg-bg-deep border border-border-color p-4 rounded-xl flex flex-col hover:border-accent-green transition-colors relative group">
                      <div className="text-[10px] text-text-secondary uppercase tracking-[1px] mb-2">{post.date}</div>
                      <div className="font-bold text-text-primary text-[13px] mb-1 truncate">{post.topic || 'Untitled'}</div>
                      <div className="text-[11px] text-accent-green">{post.platform}</div>
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-bg-deep pl-2">
                        <button onClick={() => setEditingPost(post)} className="text-text-secondary hover:text-accent-green"><Settings size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <AnimatePresence>
              {editingPost && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute inset-0 bg-card-bg/95 backdrop-blur-sm p-8 overflow-y-auto border-t border-border-color"
                >
                  <div className="font-serif text-[18px] mb-5 text-text-primary flex justify-between items-center">
                    Edit Content
                    <button onClick={() => setEditingPost(null)} className="text-text-secondary hover:text-accent-green uppercase text-[10px] tracking-[1px]">Cancel</button>
                  </div>
                  <form onSubmit={handleSaveEdit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[1px] text-text-secondary mb-2">Platform</label>
                        <select 
                          value={editingPost.platform}
                          onChange={(e) => setEditingPost({...editingPost, platform: e.target.value})}
                          className="w-full bg-bg-deep border border-border-color rounded-2xl shadow-sm p-2.5 text-[13px] text-text-primary"
                        >
                          <option value="Instagram">Instagram</option>
                          <option value="TikTok">TikTok</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="X / Twitter">X / Twitter</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[1px] text-text-secondary mb-2">Date</label>
                        <input 
                          type="date"
                          value={editingPost.date}
                          onChange={(e) => setEditingPost({...editingPost, date: e.target.value})}
                          className="w-full bg-bg-deep border border-border-color rounded-2xl shadow-sm p-2 text-[13px] text-text-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[1px] text-text-secondary mb-2">Topic</label>
                      <input 
                        type="text"
                        value={editingPost.topic}
                        onChange={(e) => setEditingPost({...editingPost, topic: e.target.value})}
                        className="w-full bg-bg-deep border border-border-color rounded-2xl shadow-sm p-2.5 text-[13px] text-text-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[1px] text-text-secondary mb-2">Caption</label>
                      <textarea 
                        value={editingPost.caption || ''}
                        onChange={(e) => setEditingPost({...editingPost, caption: e.target.value})}
                        rows={3}
                        className="w-full bg-bg-deep border border-border-color rounded-2xl shadow-sm p-2.5 text-[13px] text-text-primary resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[1px] text-text-secondary mb-2">Media Prompt (Nano Banana / Veo)</label>
                      <textarea 
                        value={editingPost.mediaPrompt || ''}
                        onChange={(e) => setEditingPost({...editingPost, mediaPrompt: e.target.value})}
                        rows={3}
                        className="w-full bg-bg-deep border border-border-color rounded-2xl shadow-sm p-2.5 text-[13px] text-text-primary resize-none"
                      />
                    </div>
                    <button type="submit" className="w-full bg-accent-green text-white rounded-xl p-3 font-bold uppercase text-[11px] tracking-[1px] hover:bg-emerald-700 transition-colors">
                      Save Changes
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
         
         <div className="bg-card-bg border border-border-color p-8 rounded-2xl shadow-sm flex flex-col">
            <div className="font-serif text-[18px] mb-5 flex justify-between items-center text-text-primary">
              AI Campaign Planner
              <Sparkles size={16} className="text-accent-green" />
            </div>
            <div className="flex-1 flex flex-col gap-4 text-[13px] text-text-secondary">
              <p>Let AI analyze viral trends and construct a complete 7-day social marketing sprint tailored for {activeCompany}.</p>
              
              <div className="flex-1 flex flex-col mt-4 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[1px] text-text-secondary mb-2">Campaign Goal or Topic</label>
                  <textarea 
                    value={campaignTopic}
                    onChange={(e) => setCampaignTopic(e.target.value)}
                    placeholder="e.g., Launching our new eco-friendly architectural design package with a young demographic focus..."
                    className="w-full bg-bg-deep border border-border-color rounded-2xl shadow-sm p-3 text-[13px] text-text-primary focus:outline-none focus:border-accent-green transition-colors resize-none h-[100px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[1px] text-text-secondary mb-2">Start Date</label>
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-bg-deep border border-border-color rounded-2xl shadow-sm p-2 text-[13px] text-text-primary focus:outline-none focus:border-accent-green transition-colors"
                  />
                </div>
              </div>
              <button 
                onClick={handleGenerateWeek}
                disabled={isGenerating || !campaignTopic.trim()}
                className="w-full bg-accent-green text-white rounded-xl p-3 font-bold uppercase text-[11px] tracking-[1px] hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : "Generate 7-Day Sprint"}
              </button>
            </div>
         </div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin' || password === 'MDC2026') {
      onLogin();
    } else {
      setError('Invalid authorization code.');
    }
  };

  return (
    <div className="flex h-screen bg-bg-deep text-text-primary font-sans items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card-bg border border-border-color p-8 rounded-2xl shadow-2xl max-w-md w-full flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-full border border-accent-green/20 bg-accent-green/10 flex items-center justify-center text-accent-green mb-6">
          <Lock size={28} />
        </div>
        <h1 className="font-serif text-[24px] mb-2 text-center text-text-primary">AI Manager Environment</h1>
        <p className="text-text-secondary text-center text-[13px] mb-8">Restricted access area. Please enter your authorization code to proceed.</p>
        
        <form onSubmit={handleSubmit} className="w-full">
          <input 
            type="password" 
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="Authorization Code"
            className="w-full bg-bg-deep border border-border-color rounded-xl p-4 text-[13px] text-text-primary focus:outline-none focus:border-accent-green transition-colors mb-4"
            autoFocus
          />
          {error && <p className="text-red-500 text-xs mb-4 text-center font-serif">{error}</p>}
          <button 
            type="submit"
            className="w-full bg-accent-green text-bg-deep font-bold uppercase tracking-[1px] text-[12px] py-4 rounded-xl hover:bg-emerald-400 transition-colors"
          >
            Authenticate
          </button>
        </form>
      </motion.div>
    </div>
  );
}