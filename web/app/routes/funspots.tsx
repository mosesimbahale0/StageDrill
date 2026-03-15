import React, { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { 
  Phone, Code, Database, Users, Medal, Terminal, Bug, PhoneCall, 
  Search, Briefcase, Zap, Sparkles 
} from 'lucide-react';

export interface Funspot {
  id: string;
  title: string;
  description: string;
  practicePrompt: string;
  icon: React.ElementType;
  accentColorTailwind: string;
  bgTailwind: string;
  category: string;
}

export const FunspotProvider = {
  samples: [
    {
      id: 'recruiter_screen',
      title: 'Recruiter Phone Screen',
      description: 'The first hurdle. Focus on your background, \'Why us?\', and handling the tricky salary question.',
      practicePrompt:
        'You are a senior recruiter at a top-tier tech company. This is an initial 20-minute phone screen. Start by asking me to walk through my background. Then, ask why I\'m interested in this company and what my current salary expectations are. Be friendly but keep an eye out for red flags in communication.',
      icon: Phone,
      accentColorTailwind: 'text-success',
      bgTailwind: 'bg-success/10',
      category: 'Initial',
    },
    {
      id: 'dsa_coding',
      title: 'Technical Phone Screen (DSA)',
      description: 'Live coding simulation. Practice explaining your logic while solving an algorithmic challenge.',
      practicePrompt:
        'You are a software engineer conducting a technical phone screen. Focus on Data Structures and Algorithms. Ask me: \'Given a list of strings, group the anagrams together.\' Once I explain the approach, challenge me on the time and space complexity, and ask how I would handle extremely large datasets that don\'t fit in memory.',
      icon: Code,
      accentColorTailwind: 'text-info',
      bgTailwind: 'bg-info/10',
      category: 'Technical',
    },
    {
      id: 'sys_design',
      title: 'System Design (Architecture)',
      description: 'Design a scalable URL shortener. Test your ability to handle load, latency, and database failure.',
      practicePrompt:
        'You are a Principal Engineer. This is a System Design interview. Ask me to design a scalable \'URL Shortener\' like Bitly. Start by asking for requirements. Then, as I describe the architecture, frequently interrupt with edge cases: \'What happens if a database node goes down?\' or \'How do we handle hot keys for a viral link?\'',
      icon: Database,
      accentColorTailwind: 'text-accent',
      bgTailwind: 'bg-accent/10',
      category: 'Onsite',
    },
    {
      id: 'behavioral_star',
      title: 'Behavioral (STAR Method)',
      description: 'Handling conflict and failure. Practice answering using the Situation, Task, Action, and Result framework.',
      practicePrompt:
        'You are a Hiring Manager. This is a behavioral interview focusing on leadership and conflict resolution. Ask me: \'Tell me about a time you had a significant technical disagreement with a teammate. How did you resolve it?\' Push for specific details using the STAR method. Don\'t let me give vague answers.',
      icon: Users,
      accentColorTailwind: 'text-warning',
      bgTailwind: 'bg-warning/10',
      category: 'Culture',
    },
    {
      id: 'bar_raiser',
      title: 'The Bar Raiser (Final Round)',
      description: 'The final boss. High-level questions on culture, growth, and long-term fit from a different department.',
      practicePrompt:
        'You are the \'Bar Raiser\'—someone from a different department ensuring I meet the company\'s highest standards. Focus on culture and long-term potential. Ask: \'What is a piece of feedback you received that was hard to hear, and how did it change your work?\' Follow up by asking about my biggest professional failure.',
      icon: Medal,
      accentColorTailwind: 'text-error',
      bgTailwind: 'bg-error/10',
      category: 'Final',
    },
    {
      id: 'xAI_1',
      title: 'xAI: First Principles',
      description: 'Test your truth-seeking mindset and ability to communicate complex ideas concisely with aggressive follow-ups.',
      practicePrompt:
        'I am interviewing for the Exceptional Software Engineer role at xAI. You are the interviewer. Your goal is to see if I have the \'truth-seeking\' mindset and can communicate complex ideas concisely. Ask me: \'What is the most technically challenging problem you’ve ever solved from first principles, and why do you think your solution was the most efficient approach?\' Keep your follow-up questions aggressive and focused on the \'why\' behind my technical choices.',
      icon: Terminal,
      accentColorTailwind: 'text-text',
      bgTailwind: 'bg-text/10',
      category: 'Specialized',
    },
    {
      id: 'triage_engineer',
      title: 'Triage Engineer',
      description: 'Investigate, diagnose, and prioritize technical issues. Act as the first line of defense for bugs and configuration problems.',
      practicePrompt:
        'You are a Technical Lead interviewing me, Moses Imbahale, for a Triage Engineer role. Use my CV context: 7 years exp, WateRefil project, Baobab ERP. The role involves investigating, diagnosing, and prioritizing technical issues. Ask me: \'We have a report of a critical failure in the WateRefil order system. How would you investigate and prioritize this? How do you distinguish between a bug and a configuration issue, and how do you coordinate with the Dev and QA teams to resolve it efficiently?\'',
      icon: Bug,
      accentColorTailwind: 'text-text2',
      bgTailwind: 'bg-text2/10',
      category: 'Technical',
    },
  ],
};

function FunspotCard({ funspot, onStartCall }: { funspot: Funspot; onStartCall: () => void }) {
  const IconComponent = funspot.icon;

  return (
    <div className="group flex flex-col justify-between bg-primary rounded-[24px] shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
      {/* Background flare on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary to-transparent rounded-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150"></div>
      
      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${funspot.bgTailwind}`}>
            <IconComponent className={`w-7 h-7 ${funspot.accentColorTailwind}`} />
          </div>
          <span className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-secondary text-text2 tracking-wide uppercase shadow-sm">
            {funspot.category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-text mb-3 relative z-10">
          {funspot.title}
        </h3>
        <p className="text-sm text-text2 line-clamp-3 mb-6 relative z-10 leading-relaxed">
          {funspot.description}
        </p>
      </div>

      <button
        onClick={onStartCall}
        className="mt-auto w-full py-3.5 px-4 bg-accent hover:bg-active text-buttontext rounded-xl flex items-center justify-center gap-2 font-semibold transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-accent/50 active:scale-[0.98]"
      >
        <PhoneCall size={18} />
        Start Interview
      </button>
    </div>
  );
}

export default function FunspotsDashboard() {
  const allFunspots = FunspotProvider.samples;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(allFunspots.map(f => f.category)))];

  const filteredFunspots = allFunspots.filter(f => {
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 lg:p-12 font-sans text-text">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-info/10 text-info rounded-xl shadow-sm">
                 <Sparkles className="w-6 h-6" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text">
                Interview Dashboard
              </h1>
            </div>
            <p className="text-text2 text-lg max-w-xl leading-relaxed">
              Pick a scenario and sharpen your skills with realistic AI-driven mock interviews.
            </p>
          </div>
          
          <div className="flex flex-shrink-0 items-center gap-4">
            <div className="px-6 py-4 bg-primary rounded-2xl shadow-md ring-1 ring-black/5 dark:ring-white/5 flex items-center gap-5">
               <div>
                 <p className="text-xs text-text3 font-bold uppercase tracking-widest mb-1">Completed</p>
                 <div className="flex items-baseline gap-1">
                   <p className="text-3xl font-black text-text">12</p>
                   <p className="text-sm font-medium text-text3">sessions</p>
                 </div>
               </div>
               <div className="w-14 h-14 bg-success/10 text-success rounded-full flex items-center justify-center shadow-sm">
                 <Zap size={28} fill="currentColor" />
               </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-primary p-4 rounded-2xl shadow-md ring-1 ring-black/5 dark:ring-white/5">
          {/* Search */}
          <div className="relative w-full lg:w-96 flex-shrink-0">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-text3" />
            </div>
            <input
              type="text"
              placeholder="Search scenarios or roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-3.5 bg-secondary border-none rounded-xl text-text placeholder-text3 focus:bg-background focus:ring-2 focus:ring-accent sm:text-sm font-medium transition-all shadow-inner"
            />
          </div>
          
          {/* Categories */}
          <div className="flex overflow-x-auto w-full gap-2 xl:justify-end pb-2 lg:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm ${
                  selectedCategory === cat 
                    ? 'bg-accent text-buttontext shadow-md transform scale-105' 
                    : 'bg-background text-text2 hover:bg-secondary focus:bg-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Section */}
        {filteredFunspots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {filteredFunspots.map(funspot => (
              <FunspotCard
                key={funspot.id}
                funspot={funspot}
                onStartCall={() => navigate(`/call/${funspot.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center flex flex-col items-center justify-center bg-primary rounded-[32px] shadow-inner ring-1 ring-black/5 dark:ring-white/5 mt-4">
            <div className="w-20 h-20 bg-secondary rounded-full flex flex-col items-center justify-center mb-6 shadow-sm">
               <Briefcase className="w-10 h-10 text-text3" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-3">No scenarios found</h3>
            <p className="text-text2 max-w-md text-lg leading-relaxed">
              We couldn't find any interview scenarios matching your current filters. Try adjusting your search query or category.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-8 px-8 py-3 bg-accent text-buttontext font-bold rounded-xl hover:bg-active transition-colors focus:ring-4 focus:ring-accent/50 active:scale-[0.98] shadow-lg"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
