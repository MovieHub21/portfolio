import React, { useState, useEffect, useRef } from 'react';
import { personalInfo, projects, skills } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface TerminalEntry {
  command: string;
  output: React.ReactNode;
}

const sampleCodeLines = [
  '// Marvellous — Fullstack Product Engineering',
  'import { createProduct } from "@marvellous/core";',
  '',
  'export default async function launch() {',
  '  const product = await createProduct({',
  '    stack: ["React", "TypeScript", "Laravel", "MySQL"],',
  '    performance: "60fps",',
  '    reliability: "100%",',
  '  });',
  '',
  '  return product.deploy({ environment: "production" });',
  '}',
];

interface LaptopScreenProps {
  scrollStage?: number;
  onRunTerminal?: (cmd: string) => void;
}

export default function LaptopScreen({ scrollStage = 0 }: LaptopScreenProps) {
  const prefersReduced = useReducedMotion();
  const [activeTab, setActiveTab] = useState<'editor' | 'terminal' | 'preview'>('editor');
  
  // Typing animation state
  const [displayedLines, setDisplayedLines] = useState<number>(() =>
    prefersReduced ? sampleCodeLines.length : 1
  );
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(() => prefersReduced);
  const [buildSuccess, setBuildSuccess] = useState<boolean>(() => prefersReduced);

  // Terminal state
  const [inputVal, setInputVal] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([
    {
      command: 'init',
      output: (
        <div>
          <span className="text-emerald-400 font-semibold">✓ Workstation initialized.</span> Type{' '}
          <span className="text-amber-300 font-bold">help</span> to list commands.
        </div>
      ),
    },
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Progressive typing simulation
  useEffect(() => {
    if (prefersReduced) {
      setDisplayedLines(sampleCodeLines.length);
      setIsTypingComplete(true);
      setBuildSuccess(true);
      return;
    }

    let lineIndex = 1;
    const interval = setInterval(() => {
      lineIndex++;
      setDisplayedLines(lineIndex);
      if (lineIndex >= sampleCodeLines.length) {
        clearInterval(interval);
        setIsTypingComplete(true);
        setTimeout(() => setBuildSuccess(true), 600);
      }
    }, 180);

    return () => clearInterval(interval);
  }, [prefersReduced]);

  // Handle scroll stage updates
  useEffect(() => {
    if (scrollStage >= 1 && activeTab === 'editor' && !prefersReduced) {
      // Transition subtly if user scrolls deeply
      setBuildSuccess(true);
    }
  }, [scrollStage, activeTab, prefersReduced]);

  useEffect(() => {
    if (activeTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory, activeTab]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    let response: React.ReactNode;

    switch (cmd) {
      case 'help':
        response = (
          <div className="space-y-1 text-xs text-gray-300">
            <p className="text-amber-300 font-semibold mb-1">Available commands:</p>
            <p><span className="text-emerald-400 font-mono w-20 inline-block">about</span> Displays biography & engineering focus</p>
            <p><span className="text-emerald-400 font-mono w-20 inline-block">projects</span> Lists featured case studies</p>
            <p><span className="text-emerald-400 font-mono w-20 inline-block">skills</span> Shows fullstack technology toolbox</p>
            <p><span className="text-emerald-400 font-mono w-20 inline-block">contact</span> Displays direct email & profile links</p>
            <p><span className="text-emerald-400 font-mono w-20 inline-block">clear</span> Clears terminal screen output</p>
          </div>
        );
        break;

      case 'about':
        response = (
          <div className="text-xs text-gray-200 leading-relaxed">
            <p className="font-semibold text-amber-300 mb-1">{personalInfo.name} — {personalInfo.title}</p>
            <p>{personalInfo.bio}</p>
          </div>
        );
        break;

      case 'projects':
        response = (
          <div className="text-xs space-y-2">
            <p className="text-amber-300 font-semibold">Featured Work:</p>
            {projects.map((p) => (
              <div key={p.id} className="text-gray-300">
                <span className="text-emerald-400 font-bold">&bull; {p.title}</span> — {p.description}
                <div className="text-gray-400 text-[10px] pl-3">Tech: {p.tech.join(', ')}</div>
              </div>
            ))}
          </div>
        );
        break;

      case 'skills':
        response = (
          <div className="text-xs space-y-1.5">
            <p className="text-amber-300 font-semibold">Technical Toolbox:</p>
            <p><span className="text-blue-400 font-mono">Frontend:</span> {skills.frontend.items.join(', ')}</p>
            <p><span className="text-purple-400 font-mono">Backend:</span> {skills.backend.items.join(', ')}</p>
            <p><span className="text-orange-400 font-mono">Data:</span> {skills.database.items.join(', ')}</p>
            <p><span className="text-teal-400 font-mono">Workflow:</span> {skills.tools.items.join(', ')}</p>
          </div>
        );
        break;

      case 'contact':
        response = (
          <div className="text-xs text-gray-200">
            <p className="text-amber-300 font-semibold mb-1">Direct Outreach:</p>
            <p>Email: <a href={`mailto:${personalInfo.email}`} className="text-emerald-400 underline">{personalInfo.email}</a></p>
            <p>GitHub: <a href={personalInfo.social.github} target="_blank" rel="noreferrer" className="text-blue-400 underline">{personalInfo.social.github}</a></p>
          </div>
        );
        break;

      case 'clear':
        setTerminalHistory([]);
        setInputVal('');
        return;

      default:
        response = (
          <span className="text-red-400">
            Command not recognized: "{cmd}". Type <span className="text-amber-300 font-bold">help</span> for allowed commands.
          </span>
        );
    }

    setTerminalHistory((prev) => [...prev, { command: inputVal, output: response }]);
    setInputVal('');
  };

  return (
    <div className="w-[840px] h-[520px] bg-[#0c0d12] text-[#f2eee8] font-mono select-none flex flex-col overflow-hidden rounded-md border border-white/10 shadow-2xl">
      {/* OS & Window Header Bar */}
      <div className="h-8 bg-[#14151e] border-b border-white/10 px-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/20" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/20" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/20" />
        </div>

        {/* Editor Tab Selectors */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 rounded-t flex items-center gap-1.5 transition-colors ${
              activeTab === 'editor'
                ? 'bg-[#0c0d12] text-amber-300 border-t-2 border-amber-400 font-medium'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <span className="text-blue-400">TS</span>
            <span>launch.ts</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1 rounded-t flex items-center gap-1.5 transition-colors ${
              activeTab === 'terminal'
                ? 'bg-[#0c0d12] text-emerald-400 border-t-2 border-emerald-400 font-medium'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <span className="text-emerald-400">&gt;_</span>
            <span>terminal</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-t flex items-center gap-1.5 transition-colors ${
              activeTab === 'preview'
                ? 'bg-[#0c0d12] text-purple-400 border-t-2 border-purple-400 font-medium'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <span>Live Preview</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        {/* Workstation Status badge */}
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>PORT 5173 ONLINE</span>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Mini Sidebar / File Tree */}
        <div className="w-44 bg-[#0e1017] border-r border-white/5 p-3 flex flex-col justify-between text-xs hidden sm:flex">
          <div className="space-y-3">
            <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
              EXPLORER: PORTFOLIO
            </div>
            <div className="space-y-1.5 text-gray-300">
              <div className="flex items-center gap-1.5 text-gray-400">
                <span>&gt;</span>
                <span>src</span>
              </div>
              <div
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-2 pl-4 py-1 rounded cursor-pointer ${
                  activeTab === 'editor' ? 'text-amber-300 bg-white/5' : 'hover:text-white'
                }`}
              >
                <span className="text-blue-400 text-[10px]">TS</span>
                <span>launch.ts</span>
              </div>
              <div
                onClick={() => setActiveTab('terminal')}
                className={`flex items-center gap-2 pl-4 py-1 rounded cursor-pointer ${
                  activeTab === 'terminal' ? 'text-emerald-400 bg-white/5' : 'hover:text-white'
                }`}
              >
                <span className="text-emerald-400 text-[10px]">&gt;_</span>
                <span>cli.sh</span>
              </div>
              <div
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 pl-4 py-1 rounded cursor-pointer ${
                  activeTab === 'preview' ? 'text-purple-400 bg-white/5' : 'hover:text-white'
                }`}
              >
                <span className="text-purple-400 text-[10px]">&bull;</span>
                <span>preview.ui</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-gray-400 border-t border-white/5 pt-2">
            <span>Marvellous Dev</span>
            <div className="text-emerald-400">TypeScript 5.9</div>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0c0d12]">
          {activeTab === 'editor' && (
            <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto font-mono text-[13px] leading-relaxed">
              <div>
                {sampleCodeLines.slice(0, displayedLines).map((line, idx) => {
                  let formattedLine: React.ReactNode = line;

                  if (line.startsWith('//')) {
                    formattedLine = <span className="text-gray-500 italic">{line}</span>;
                  } else if (line.includes('import')) {
                    formattedLine = (
                      <>
                        <span className="text-purple-400">import</span>{' '}
                        <span className="text-yellow-300">{'{ createProduct }'}</span>{' '}
                        <span className="text-purple-400">from</span>{' '}
                        <span className="text-emerald-300">"@marvellous/core"</span>;
                      </>
                    );
                  } else if (line.includes('export default')) {
                    formattedLine = (
                      <>
                        <span className="text-purple-400">export default async function</span>{' '}
                        <span className="text-blue-400">launch</span>() {'{'}
                      </>
                    );
                  } else if (line.includes('const product')) {
                    formattedLine = (
                      <>
                        &nbsp;&nbsp;<span className="text-blue-300">const</span> product ={' '}
                        <span className="text-purple-400">await</span>{' '}
                        <span className="text-blue-400">createProduct</span>({'{'}
                      </>
                    );
                  } else if (line.includes('stack:')) {
                    formattedLine = (
                      <>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-red-400">stack:</span> [
                        <span className="text-emerald-300">"React"</span>,{' '}
                        <span className="text-emerald-300">"TypeScript"</span>,{' '}
                        <span className="text-emerald-300">"Laravel"</span>,{' '}
                        <span className="text-emerald-300">"MySQL"</span>],
                      </>
                    );
                  } else if (line.includes('performance:')) {
                    formattedLine = (
                      <>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-red-400">performance:</span>{' '}
                        <span className="text-emerald-300">"60fps"</span>,
                      </>
                    );
                  } else if (line.includes('reliability:')) {
                    formattedLine = (
                      <>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-red-400">reliability:</span>{' '}
                        <span className="text-emerald-300">"100%"</span>,
                      </>
                    );
                  } else if (line.includes('return product.deploy')) {
                    formattedLine = (
                      <>
                        &nbsp;&nbsp;<span className="text-purple-400">return</span> product.
                        <span className="text-blue-400">deploy</span>({'{'}{' '}
                        <span className="text-red-400">environment:</span>{' '}
                        <span className="text-emerald-300">"production"</span> {'}'});
                      </>
                    );
                  }

                  return (
                    <div key={idx} className="flex items-start">
                      <span className="w-8 text-right pr-4 text-gray-600 select-none text-xs">
                        {idx + 1}
                      </span>
                      <span className="flex-1 whitespace-pre">{formattedLine}</span>
                    </div>
                  );
                })}

                {!isTypingComplete && (
                  <div className="flex items-center">
                    <span className="w-8 text-right pr-4 text-gray-600 text-xs">
                      {displayedLines + 1}
                    </span>
                    <span className="w-2.5 h-4 bg-amber-300 animate-pulse inline-block" />
                  </div>
                )}
              </div>

              {/* Build Notification Pill at bottom of editor */}
              {buildSuccess && (
                <div className="mt-4 p-2.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>✓ Build 2026.1 succeeded in 182ms. Ready for deployment.</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className="px-2.5 py-1 bg-emerald-500 text-black font-bold rounded text-[11px] hover:bg-emerald-400 transition-colors"
                  >
                    View App
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'terminal' && (
            <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto text-xs">
              <div className="space-y-3">
                <div className="text-gray-400 pb-2 border-b border-white/5">
                  <p className="font-semibold text-white">Marvellous Interactive Shell v2.4</p>
                  <p className="text-[11px] text-gray-400">
                    Type safe commands (<span className="text-amber-300">help</span>,{' '}
                    <span className="text-amber-300">about</span>,{' '}
                    <span className="text-amber-300">projects</span>,{' '}
                    <span className="text-amber-300">skills</span>,{' '}
                    <span className="text-amber-300">contact</span>,{' '}
                    <span className="text-amber-300">clear</span>).
                  </p>
                </div>

                {terminalHistory.map((entry, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <span>marvellous@portfolio:~$</span>
                      <span className="text-white font-normal">{entry.command}</span>
                    </div>
                    <div className="pl-4 text-gray-300">{entry.output}</div>
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Command Input */}
              <form onSubmit={handleCommandSubmit} className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                <span className="text-emerald-400 font-bold text-xs">marvellous@portfolio:~$</span>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="type command (e.g. projects, skills, help)..."
                  className="flex-1 bg-transparent border-none text-white text-xs focus:outline-none placeholder:text-gray-600 font-mono"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-white/10 hover:bg-accent hover:text-black rounded text-[11px] font-mono text-gray-300 transition-colors"
                >
                  Enter
                </button>
              </form>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="flex-1 p-5 flex flex-col items-center justify-center bg-[#0d0e14] text-center">
              <div className="max-w-xs p-6 rounded-2xl border border-white/10 bg-[#161722] shadow-2xl">
                <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h5 className="font-display font-bold text-base text-white mb-2">
                  Interactive Product Demo
                </h5>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Fullstack React + Laravel application loaded with high-speed state synchronization.
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setActiveTab('terminal')}
                    className="px-3 py-1.5 bg-accent text-bg font-bold rounded-lg text-xs hover:bg-accent-light transition-colors"
                  >
                    Open Terminal
                  </button>
                  <button
                    onClick={() => setActiveTab('editor')}
                    className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs hover:bg-white/20 transition-colors"
                  >
                    Source Code
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#090a0f] border-t border-white/5 px-3 flex items-center justify-between text-[11px] text-gray-400 flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            main*
          </span>
          <span>UTF-8</span>
          <span>TypeScript JSX</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Ln {displayedLines}, Col 1</span>
          <span className="text-accent font-medium">Ready</span>
        </div>
      </div>
    </div>
  );
}
