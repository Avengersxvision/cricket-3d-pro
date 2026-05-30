import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './index.css';

/* ═══════════════════════════════════════════════════════════════════
   ALL 10 INTERNATIONAL TEAMS — 2026 ROSTERS WITH JERSEY COLORS
   ═══════════════════════════════════════════════════════════════════ */
interface Player {
  name: string; role: string; bat: string; bowl: string; rating: number;
  captain?: boolean; keeper?: boolean;
}

const TEAMS: Record<string, { 
  name: string; captain: string; color: number; secondaryColor: number; 
  flag: string; players: Player[] 
}> = {
  India: {
    name: 'India', captain: 'Shubman Gill', 
    color: 0x0066cc, secondaryColor: 0x00aaff, flag: '🇮🇳',
    players: [
      { name: 'Shubman Gill', role: 'Batsman', bat: 'R', bowl: 'OB', rating: 88, captain: true },
      { name: 'Yashasvi Jaiswal', role: 'Batsman', bat: 'L', bowl: '', rating: 86 },
      { name: 'Virat Kohli', role: 'Batsman', bat: 'R', bowl: '', rating: 94 },
      { name: 'KL Rahul', role: 'WK-Bat', bat: 'R', bowl: '', rating: 85, keeper: true },
      { name: 'Hardik Pandya', role: 'All-rounder', bat: 'R', bowl: 'RF', rating: 89 },
      { name: 'Rishabh Pant', role: 'WK-Bat', bat: 'L', bowl: '', rating: 88, keeper: true },
      { name: 'Axar Patel', role: 'All-rounder', bat: 'L', bowl: 'SLA', rating: 82 },
      { name: 'Ravindra Jadeja', role: 'All-rounder', bat: 'L', bowl: 'SLA', rating: 87 },
      { name: 'Jasprit Bumrah', role: 'Bowler', bat: 'R', bowl: 'RF', rating: 96 },
      { name: 'Mohammed Shami', role: 'Bowler', bat: 'R', bowl: 'RF', rating: 87 },
      { name: 'Kuldeep Yadav', role: 'Bowler', bat: 'L', bowl: 'LB', rating: 84 },
    ]
  },
  Australia: {
    name: 'Australia', captain: 'Pat Cummins',
    color: 0xffcc00, secondaryColor: 0x008000, flag: '🇦🇺',
    players: [
      { name: 'Pat Cummins', role: 'Bowler', bat: 'R', bowl: 'RF', rating: 92, captain: true },
      { name: 'Steve Smith', role: 'Batsman', bat: 'R', bowl: 'LB', rating: 89 },
      { name: 'Travis Head', role: 'Batsman', bat: 'L', bowl: 'OB', rating: 87 },
      { name: 'Marnus Labuschagne', role: 'Batsman', bat: 'R', bowl: 'LB', rating: 84 },
      { name: 'Josh Inglis', role: 'WK-Bat', bat: 'R', bowl: '', rating: 80, keeper: true },
      { name: 'Cameron Green', role: 'All-rounder', bat: 'R', bowl: 'RFM', rating: 83 },
      { name: 'Mitchell Starc', role: 'Bowler', bat: 'L', bowl: 'LF', rating: 90 },
      { name: 'Josh Hazlewood', role: 'Bowler', bat: 'R', bowl: 'RFM', rating: 87 },
      { name: 'Nathan Lyon', role: 'Bowler', bat: 'R', bowl: 'OB', rating: 85 },
      { name: 'Adam Zampa', role: 'Bowler', bat: 'R', bowl: 'LB', rating: 86 },
      { name: 'Mitchell Marsh', role: 'All-rounder', bat: 'R', bowl: 'RFM', rating: 82 },
    ]
  },
  England: {
    name: 'England', captain: 'Ben Stokes',
    color: 0x003366, secondaryColor: 0xff0000, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    players: [
      { name: 'Ben Stokes', role: 'All-rounder', bat: 'L', bowl: 'RFM', rating: 90, captain: true },
      { name: 'Joe Root', role: 'Batsman', bat: 'R', bowl: 'OB', rating: 91 },
      { name: 'Zak Crawley', role: 'Batsman', bat: 'R', bowl: '', rating: 78 },
      { name: 'Ben Duckett', role: 'Batsman', bat: 'L', bowl: '', rating: 80 },
      { name: 'Harry Brook', role: 'Batsman', bat: 'R', bowl: '', rating: 85 },
      { name: 'Jonny Bairstow', role: 'WK-Bat', bat: 'R', bowl: '', rating: 83, keeper: true },
      { name: 'Chris Woakes', role: 'All-rounder', bat: 'R', bowl: 'RFM', rating: 82 },
      { name: 'Mark Wood', role: 'Bowler', bat: 'R', bowl: 'RF', rating: 84 },
      { name: 'Jofra Archer', role: 'Bowler', bat: 'R', bowl: 'RF', rating: 88 },
      { name: 'Shoaib Bashir', role: 'Bowler', bat: 'R', bowl: 'OB', rating: 75 },
      { name: 'Gus Atkinson', role: 'Bowler', bat: 'R', bowl: 'RF', rating: 79 },
    ]
  },
  Pakistan: {
    name: 'Pakistan', captain: 'Babar Azam',
    color: 0x006600, secondaryColor: 0xffcc00, flag: '🇵🇰',
    players: [
      { name: 'Babar Azam', role: 'Batsman', bat: 'R', bowl: '', rating: 92, captain: true },
      { name: 'Mohammad Rizwan', role: 'WK-Bat', bat: 'R', bowl: '', rating: 86, keeper: true },
      { name: 'Saim Ayub', role: 'Batsman', bat: 'L', bowl: '', rating: 78 },
      { name: 'Abdullah Shafique', role: 'Batsman', bat: 'R', bowl: '', rating: 80 },
      { name: 'Shan Masood', role: 'Batsman', bat: 'L', bowl: '', rating: 79 },
      { name: 'Shadab Khan', role: 'All-rounder', bat: 'R', bowl: 'LB', rating: 82 },
      { name: 'Mohammad Nawaz', role: 'All-rounder', bat: 'L', bowl: 'SLA', rating: 78 },
      { name: 'Shaheen Afridi', role: 'Bowler', bat: 'L', bowl: 'LF', rating: 91 },
      { name: 'Haris Rauf', role: 'Bowler', bat: 'R', bowl: 'RF', rating: 84 },
      { name: 'Naseem Shah', role: 'Bowler', bat: 'R', bowl: 'RF', rating: 85 },
      { name: 'Abrar Ahmed', role: 'Bowler', bat: 'R', bowl: 'LB', rating: 80 },
    ]
  },
  'South Africa': {
    name: 'South Africa', captain: 'Temba Bavuma',
    color: 0x006633, secondaryColor: 0xffcc00, flag: '🇿🇦',
    players: [
      { name: 'Temba Bavuma', role: 'Batsman', bat: 'R', bowl: '', rating: 81, captain: true },
      { name: 'Quinton de Kock', role: 'WK-Bat', bat: 'L', bowl: '', rating: 87, keeper: true },
      { name: 'Rassie van der Dussen', role: 'Batsman', bat: 'R', bowl: '', rating: 82 },
      { name: 'Aiden Markram', role: 'Batsman', bat: 'R', bowl: 'OB', rating: 85 },
      { name: 'David Miller', role: 'Batsman', bat: 'L', bowl: '', rating: 86 },
      { name: 'Marco Jansen', role: 'All-rounder', bat: 'L', bowl: 'LFM', rating: 81 },
      { name: 'Keshav Maharaj', role: 'Bowler', bat: 'L', bowl: 'SLA', rating: 80 },
      { name: 'Kagiso Rabada', role: 'Bowler', bat: 'R', bowl: 'RF', rating: 90 },
      { name: 'Anrich Nortje', role: 'Bowler', bat: 'R', bowl: 'RF', rating: 87 },
      { name: 'Gerald Coetzee', role: 'Bowler', bat: 'R', bowl: 'RF', rating: 79 },
      { name: 'Lungi Ngidi', role: 'Bowler', bat: 'R', bowl: 'RFM', rating: 82 },
    ]
  },
  'New Zealand': {
    name: 'New Zealand', captain: 'Kane Williamson',
    color: 0x000000, secondaryColor: 0xffffff, flag: '🇳🇿',
    players: [
      { name: 'Kane Williamson', role: 'Batsman', bat: 'R', bowl: 'OB', rating: 89, captain: true },
      { name: 'Devon Conway', role: 'WK-Bat', bat: 'L', bowl: '', rating: 83, keeper: true },
      { name: 'Tom Latham', role: 'Batsman', bat: 'L', bowl: '', rating: 82 },
      { name: 'Rachin Ravindra', role: 'All-rounder', bat: 'L', bowl: 'SLA', rating: 81 },
      { name: 'Daryl Mitchell', role: 'All-rounder', bat: 'R', bowl: 'RM', rating: 84 },
      { name: 'Glenn Phillips', role: 'Batsman', bat: 'R', bowl: 'OB', rating: 80 },
      { name: 'Mitchell Santner', role: 'All-rounder', bat: 'L', bowl: 'SLA', rating: 79 },
      { name: 'Trent Boult', role: 'Bowler', bat: 'L', bowl: 'LF', rating: 88 },
      { name: 'Tim Southee', role: 'Bowler', bat: 'R', bowl: 'RFM', rating: 85 },
      { name: 'Matt Henry', role: 'Bowler', bat: 'R', bowl: 'RFM', rating: 82 },
      { name: 'Ish Sodhi', role: 'Bowler', bat: 'R', bowl: 'LB', rating: 78 },
    ]
  },
  'West Indies': {
    name: 'West Indies', captain: 'Shai Hope',
    color: 0x7d0032, secondaryColor: 0xffcc00, flag: '🏴',
    players: [
      { name: 'Shai Hope', role: 'WK-Bat', bat: 'R', bowl: '', rating: 84, captain: true, keeper: true },
      { name: 'Brandon King', role: 'Batsman', bat: 'R', bowl: '', rating: 78 },
      { name: 'Kyle Mayers', role: 'All-rounder', bat: 'L', bowl: 'RFM', rating: 80 },
      { name: 'Nicholas Pooran', role: 'WK-Bat', bat: 'L', bowl: '', rating: 85, keeper: true },
      { name: 'Shimron Hetmyer', role: 'Batsman', bat: 'L', bowl: '', rating: 79 },
      { name: 'Jason Holder', role: 'All-rounder', bat: 'R', bowl: 'RFM', rating: 83 },
      { name: 'Andre Russell', role: 'All-rounder', bat: 'R', bowl: 'RF', rating: 82 },
      { name: 'Akeal Hosein', role: 'Bowler', bat: 'L', bowl: 'SLA', rating: 77 },
      { name: 'Alzarri Joseph', role: 'Bowler', bat: 'R', bowl: 'RF', rating: 81 },
      { name: 'Kemar Roach', role: 'Bowler', bat: 'R', bowl: 'RFM', rating: 80 },
      { name: 'Gudakesh Motie', role: 'Bowler', bat: 'L', bowl: 'SLA', rating: 76 },
    ]
  },
  'Sri Lanka': {
    name: 'Sri Lanka', captain: 'Dimuth Karunaratne',
    color: 0x003da5, secondaryColor: 0xffc72c, flag: '🇱🇰',
    players: [
      { name: 'Dimuth Karunaratne', role: 'Batsman', bat: 'L', bowl: '', rating: 80, captain: true },
      { name: 'Pathum Nissanka', role: 'Batsman', bat: 'R', bowl: '', rating: 79 },
      { name: 'Kusal Mendis', role: 'WK-Bat', bat: 'R', bowl: '', rating: 82, keeper: true },
      { name: 'Angelo Mathews', role: 'All-rounder', bat: 'R', bowl: 'RFM', rating: 81 },
      { name: 'Dhananjaya de Silva', role: 'All-rounder', bat: 'R', bowl: 'OB', rating: 80 },
      { name: 'Wanindu Hasaranga', role: 'All-rounder', bat: 'R', bowl: 'LB', rating: 84 },
      { name: 'Dasun Shanaka', role: 'All-rounder', bat: 'R', bowl: 'RM', rating: 76 },
      { name: 'Maheesh Theekshana', role: 'Bowler', bat: 'R', bowl: 'OB', rating: 79 },
      { name: 'Dushmantha Chameera', role: 'Bowler', bat: 'R', bowl: 'RF', rating: 81 },
      { name: 'Lahiru Kumara', role: 'Bowler', bat: 'R', bowl: 'RF', rating: 78 },
      { name: 'Matheesha Pathirana', role: 'Bowler', bat: 'R', bowl: 'RF', rating: 77 },
    ]
  },
  Bangladesh: {
    name: 'Bangladesh', captain: 'Najmul Hossain Shanto',
    color: 0x006a4e, secondaryColor: 0xf42a41, flag: '🇧🇩',
    players: [
      { name: 'Najmul Hossain Shanto', role: 'Batsman', bat: 'L', bowl: '', rating: 79, captain: true },
      { name: 'Litton Das', role: 'WK-Bat', bat: 'R', bowl: '', rating: 80, keeper: true },
      { name: 'Soumya Sarkar', role: 'All-rounder', bat: 'L', bowl: 'RM', rating: 75 },
      { name: 'Towhid Hridoy', role: 'Batsman', bat: 'R', bowl: '', rating: 76 },
      { name: 'Shakib Al Hasan', role: 'All-rounder', bat: 'L', bowl: 'SLA', rating: 86 },
      { name: 'Mahmudullah', role: 'All-rounder', bat: 'R', bowl: 'OB', rating: 78 },
      { name: 'Mehidy Hasan Miraz', role: 'All-rounder', bat: 'R', bowl: 'OB', rating: 80 },
      { name: 'Taskin Ahmed', role: 'Bowler', bat: 'R', bowl: 'RF', rating: 81 },
      { name: 'Shoriful Islam', role: 'Bowler', bat: 'L', bowl: 'LFM', rating: 77 },
      { name: 'Mustafizur Rahman', role: 'Bowler', bat: 'L', bowl: 'LFM', rating: 82 },
      { name: 'Nasum Ahmed', role: 'Bowler', bat: 'L', bowl: 'SLA', rating: 74 },
    ]
  },
  Afghanistan: {
    name: 'Afghanistan', captain: 'Rashid Khan',
    color: 0x002868, secondaryColor: 0xd32011, flag: '🇦🇫',
    players: [
      { name: 'Rashid Khan', role: 'All-rounder', bat: 'R', bowl: 'LB', rating: 88, captain: true },
      { name: 'Ibrahim Zadran', role: 'Batsman', bat: 'R', bowl: '', rating: 78 },
      { name: 'Rahmanullah Gurbaz', role: 'WK-Bat', bat: 'R', bowl: '', rating: 80, keeper: true },
      { name: 'Azmatullah Omarzai', role: 'All-rounder', bat: 'R', bowl: 'RFM', rating: 77 },
      { name: 'Mohammad Nabi', role: 'All-rounder', bat: 'R', bowl: 'OB', rating: 81 },
      { name: 'Gulbadin Naib', role: 'All-rounder', bat: 'R', bowl: 'RM', rating: 74 },
      { name: 'Najibullah Zadran', role: 'Batsman', bat: 'L', bowl: '', rating: 76 },
      { name: 'Mujeeb Ur Rahman', role: 'Bowler', bat: 'R', bowl: 'OB', rating: 83 },
      { name: 'Fazalhaq Farooqi', role: 'Bowler', bat: 'L', bowl: 'LF', rating: 82 },
      { name: 'Naveen-ul-Haq', role: 'Bowler', bat: 'R', bowl: 'RFM', rating: 79 },
      { name: 'Noor Ahmad', role: 'Bowler', bat: 'L', bowl: 'SLA', rating: 75 },
    ]
  },
};

const PACE_DELIVERIES = [
  { name: 'Outswing', icon: '↪', desc: 'Moves away from bat' },
  { name: 'Inswing', icon: '↩', desc: 'Moves into bat' },
  { name: 'Seam up', icon: '⬆', desc: 'Straight, seam movement' },
  { name: 'Slower', icon: '🐌', desc: 'Change of pace' },
  { name: 'Yorker', icon: '⬇', desc: 'Full at toes' },
  { name: 'Bouncer', icon: '⤴', desc: 'Short, head-high' },
  { name: 'Off-cutter', icon: '↘', desc: 'Cuts away after pitch' },
  { name: 'Leg-cutter', icon: '↙', desc: 'Cuts in after pitch' },
];

const SPIN_DELIVERIES = [
  { name: 'Off-break', icon: '↷', desc: 'Turns from off to leg' },
  { name: 'Leg-break', icon: '↶', desc: 'Turns from leg to off' },
  { name: 'Googly', icon: '🔄', desc: "Leg-spinner's wrong'un" },
  { name: 'Doosra', icon: '🔁', desc: "Off-spinner's wrong'un" },
  { name: 'Carrom', icon: '💫', desc: 'Flicked delivery' },
  { name: 'Arm ball', icon: '➡', desc: 'Goes straight' },
  { name: 'Top-spin', icon: '⬆', desc: 'Dips and bounces' },
  { name: 'Slider', icon: '⚡', desc: 'Skids through low' },
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [phase, setPhase] = useState<'menu' | 'toss' | 'toss_result' | 'game'>('menu');
  const [team1, setTeam1] = useState('India');
  const [team2, setTeam2] = useState('Australia');
  const [tossChoice, setTossChoice] = useState<'heads' | 'tails' | null>(null);
  const [tossWinner, setTossWinner] = useState<string | null>(null);
  const [battingFirst, setBattingFirst] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<'T20' | 'ODI' | 'Test'>('T20');

  const handleStartGame = () => setPhase('toss');

  const handleToss = (choice: 'heads' | 'tails') => {
    setTossChoice(choice);
    const result = Math.random() > 0.5 ? 'heads' : 'tails';
    const winner = result === choice ? team1 : team2;
    
    setTimeout(() => {
      setTossWinner(winner);
      setPhase('toss_result');
    }, 2500);
  };

  const handleBatBowl = (decision: 'bat' | 'bowl') => {
    setBattingFirst(tossWinner === team1 
      ? (decision === 'bat' ? team1 : team2)
      : (decision === 'bat' ? team2 : team1)
    );
    setPhase('game');
  };

  if (phase === 'menu') {
    return <MenuScreen onStart={handleStartGame} team1={team1} team2={team2} 
      setTeam1={setTeam1} setTeam2={setTeam2} gameMode={gameMode} setGameMode={setGameMode} />;
  }

  if (phase === 'toss') {
    return <TossScreen team1={team1} team2={team2} onToss={handleToss} tossChoice={tossChoice} />;
  }

  if (phase === 'toss_result' && tossWinner) {
    return <TossResultScreen winner={tossWinner} onDecide={handleBatBowl} />;
  }

  if (phase === 'game' && battingFirst) {
    return <GameScreen team1={team1} team2={team2} battingFirst={battingFirst} 
      gameMode={gameMode} onExit={() => setPhase('menu')} />;
  }

  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   MENU SCREEN — Enhanced UI
   ═══════════════════════════════════════════════════════════════════ */
function MenuScreen({ onStart, team1, team2, setTeam1, setTeam2, gameMode, setGameMode }: any) {
  const teamNames = Object.keys(TEAMS);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 overflow-auto">
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-6xl w-full">
          <div className="text-9xl mb-6 animate-bounce">🏏</div>
          <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            CRICKET 3D PRO
          </h1>
          <p className="text-2xl text-blue-300 mb-12 font-semibold">
            Phase 2 • 10 Teams • Full Bowling Controls • Realistic Physics
          </p>

          <div className="grid grid-cols-2 gap-8 mb-10">
            {/* Team 1 Selection */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/10 hover:border-blue-400/50 transition-all">
              <label className="block text-blue-300 text-sm mb-3 font-bold uppercase tracking-wider">
                Team 1 (You)
              </label>
              <select value={team1} onChange={(e) => setTeam1(e.target.value)}
                className="w-full p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white border-2 border-blue-400 text-xl font-bold cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundImage: `linear-gradient(135deg, ${intToHex(TEAMS[team1].color)}dd, ${intToHex(TEAMS[team1].secondaryColor)}dd)` }}>
                {teamNames.map(t => (
                  <option key={t} value={t}>{TEAMS[t].flag} {t}</option>
                ))}
              </select>
              <div className="mt-4 text-white/80 text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span>Captain:</span>
                  <span className="font-bold">{TEAMS[team1].captain}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Players:</span>
                  <span className="font-bold">{TEAMS[team1].players.length}</span>
                </div>
              </div>
            </div>

            {/* Team 2 Selection */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/10 hover:border-purple-400/50 transition-all">
              <label className="block text-purple-300 text-sm mb-3 font-bold uppercase tracking-wider">
                Team 2 (Opponent)
              </label>
              <select value={team2} onChange={(e) => setTeam2(e.target.value)}
                className="w-full p-5 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 text-white border-2 border-purple-400 text-xl font-bold cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundImage: `linear-gradient(135deg, ${intToHex(TEAMS[team2].color)}dd, ${intToHex(TEAMS[team2].secondaryColor)}dd)` }}>
                {teamNames.filter(t => t !== team1).map(t => (
                  <option key={t} value={t}>{TEAMS[t].flag} {t}</option>
                ))}
              </select>
              <div className="mt-4 text-white/80 text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span>Captain:</span>
                  <span className="font-bold">{TEAMS[team2].captain}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Players:</span>
                  <span className="font-bold">{TEAMS[team2].players.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Game Mode */}
          <div className="mb-12">
            <label className="block text-green-300 text-sm mb-4 font-bold uppercase tracking-wider">
              Select Match Format
            </label>
            <div className="flex gap-6 justify-center">
              {(['T20', 'ODI', 'Test'] as const).map(mode => (
                <button key={mode} onClick={() => setGameMode(mode)}
                  className={`group px-10 py-6 rounded-2xl font-black text-2xl transition-all transform hover:scale-105 ${
                    gameMode === mode
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-500/50 scale-105'
                      : 'bg-white/10 text-white/60 hover:bg-white/20 border-2 border-white/20'
                  }`}>
                  <div className="text-4xl mb-2">
                    {mode === 'T20' ? '⚡' : mode === 'ODI' ? '🏟️' : '🏏'}
                  </div>
                  {mode}
                  <div className="text-xs font-normal mt-1 opacity-70">
                    {mode === 'T20' ? '20 overs' : mode === 'ODI' ? '50 overs' : '5 days'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button onClick={onStart}
            className="group px-20 py-8 rounded-3xl font-black text-3xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 
              text-white shadow-2xl shadow-red-500/50 hover:shadow-red-500/80 transition-all active:scale-95 hover:scale-105 mb-8">
            <div className="flex items-center gap-4">
              <span className="text-5xl">▶</span>
              <span>START MATCH</span>
            </div>
          </button>

          {/* Features Grid */}
          <div className="grid grid-cols-4 gap-4 mt-12">
            {[
              { icon: '🌍', title: '10 Teams', desc: 'All nations' },
              { icon: '👕', title: 'Real Jerseys', desc: 'Unique colors' },
              { icon: '🎮', title: 'Full Controls', desc: 'Bowling panel' },
              { icon: '⚾', title: '16 Deliveries', desc: 'Pace + Spin' },
            ].map((f, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                <div className="text-3xl mb-2">{f.icon}</div>
                <div className="font-bold text-white text-sm">{f.title}</div>
                <div className="text-white/50 text-xs">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function intToHex(num: number) {
  return '#' + num.toString(16).padStart(6, '0');
}

/* ... TossScreen and TossResultScreen stay the same ... */
function TossScreen({ team1, team2, onToss, tossChoice }: any) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1e);

    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const ambLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambLight);
    const spotLight = new THREE.SpotLight(0xffffff, 1.5);
    spotLight.position.set(5, 10, 5);
    scene.add(spotLight);

    const coinGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 64);
    const coinMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.rotation.x = Math.PI / 2;
    scene.add(coin);

    const canvas1 = document.createElement('canvas');
    canvas1.width = 256; canvas1.height = 256;
    const ctx1 = canvas1.getContext('2d')!;
    ctx1.fillStyle = '#222';
    ctx1.fillRect(0, 0, 256, 256);
    ctx1.fillStyle = '#ffd700';
    ctx1.font = 'bold 56px Arial';
    ctx1.textAlign = 'center';
    ctx1.fillText('HEADS', 128, 140);

    const canvas2 = document.createElement('canvas');
    canvas2.width = 256; canvas2.height = 256;
    const ctx2 = canvas2.getContext('2d')!;
    ctx2.fillStyle = '#111';
    ctx2.fillRect(0, 0, 256, 256);
    ctx2.fillStyle = '#c0c0c0';
    ctx2.font = 'bold 56px Arial';
    ctx2.textAlign = 'center';
    ctx2.fillText('TAILS', 128, 140);

    const tex1 = new THREE.CanvasTexture(canvas1);
    const tex2 = new THREE.CanvasTexture(canvas2);
    const mat1 = new THREE.MeshBasicMaterial({ map: tex1 });
    const mat2 = new THREE.MeshBasicMaterial({ map: tex2 });
    
    const face1 = new THREE.Mesh(new THREE.CircleGeometry(0.75, 32), mat1);
    face1.position.z = 0.051;
    coin.add(face1);
    
    const face2 = new THREE.Mesh(new THREE.CircleGeometry(0.75, 32), mat2);
    face2.position.z = -0.051;
    face2.rotation.y = Math.PI;
    coin.add(face2);

    let spinning = false;
    let spinSpeed = 0;
    let targetRotation = 0;

    const animate = () => {
      requestAnimationFrame(animate);
      
      if (spinning) {
        coin.rotation.y += spinSpeed;
        spinSpeed *= 0.98;
        if (Math.abs(coin.rotation.y - targetRotation) < 0.1 && spinSpeed < 0.05) {
          spinning = false;
          coin.rotation.y = targetRotation;
          setIsSpinning(false);
        }
      } else {
        coin.rotation.y += 0.01;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    if (tossChoice && !spinning) {
      spinning = true;
      setIsSpinning(true);
      spinSpeed = 0.8;
      const spins = 8 + Math.random() * 4;
      const finalSide = Math.random() > 0.5 ? 0 : Math.PI;
      targetRotation = coin.rotation.y + Math.PI * 2 * spins + finalSide;
    }

    return () => {
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [tossChoice]);

  const t1 = TEAMS[team1];
  const t2 = TEAMS[team2];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      <div className="grid grid-cols-2 h-full">
        <div className="flex flex-col items-center justify-center p-12" 
          style={{ background: `linear-gradient(135deg, ${intToHex(t1.color)}50, transparent)` }}>
          <div className="text-9xl mb-6">{t1.flag}</div>
          <h2 className="text-6xl font-black text-white mb-3">{t1.name}</h2>
          <p className="text-3xl text-white/70 mb-2">Captain: {t1.captain}</p>
          <div className="mt-4 px-8 py-3 rounded-full text-white font-bold text-lg"
            style={{ background: intToHex(t1.color) }}>
            Jersey Color
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-12"
          style={{ background: `linear-gradient(225deg, ${intToHex(t2.color)}50, transparent)` }}>
          <div className="text-9xl mb-6">{t2.flag}</div>
          <h2 className="text-6xl font-black text-white mb-3">{t2.name}</h2>
          <p className="text-3xl text-white/70 mb-2">Captain: {t2.captain}</p>
          <div className="mt-4 px-8 py-3 rounded-full text-white font-bold text-lg"
            style={{ background: intToHex(t2.color) }}>
            Jersey Color
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div ref={mountRef} className="w-96 h-96" />
        
        {!tossChoice && (
          <div className="flex gap-8 mt-8 pointer-events-auto">
            <button onClick={() => onToss('heads')}
              className="group px-16 py-6 rounded-3xl font-black text-3xl bg-gradient-to-br from-yellow-500 to-yellow-700 
                text-white shadow-2xl hover:scale-110 transition-transform border-4 border-yellow-300">
              <div className="text-5xl mb-2">👑</div>
              HEADS
            </button>
            <button onClick={() => onToss('tails')}
              className="group px-16 py-6 rounded-3xl font-black text-3xl bg-gradient-to-br from-gray-600 to-gray-900 
                text-white shadow-2xl hover:scale-110 transition-transform border-4 border-gray-400">
              <div className="text-5xl mb-2">⚡</div>
              TAILS
            </button>
          </div>
        )}

        {isSpinning && (
          <div className="text-white text-3xl font-black mt-8 animate-pulse bg-blue-600/80 px-8 py-4 rounded-2xl">
            Spinning the coin...
          </div>
        )}
      </div>
    </div>
  );
}

function TossResultScreen({ winner, onDecide }: { winner: string; onDecide: (d: 'bat' | 'bowl') => void }) {
  const team = TEAMS[winner];
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-emerald-950 to-blue-950">
      <div className="text-9xl mb-8 animate-bounce">{team.flag}</div>
      <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-6">
        {team.name.toUpperCase()} WINS!
      </h1>
      <p className="text-4xl text-white/80 mb-16">Captain {team.captain} to decide</p>

      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-10 mb-16 border-2 border-white/20 max-w-3xl">
        <h3 className="text-green-400 text-lg font-bold mb-6 uppercase tracking-wider">📊 Pitch Report</h3>
        <div className="grid grid-cols-3 gap-8 text-white">
          <div className="text-center">
            <div className="text-xs text-white/50 mb-2 uppercase">Surface</div>
            <div className="text-2xl font-bold">Dry & Hard</div>
            <div className="text-sm text-white/60 mt-1">Batting friendly</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-white/50 mb-2 uppercase">Weather</div>
            <div className="text-2xl font-bold">☀️ Sunny</div>
            <div className="text-sm text-white/60 mt-1">Clear skies</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-white/50 mb-2 uppercase">Dew Factor</div>
            <div className="text-2xl font-bold">Expected</div>
            <div className="text-sm text-white/60 mt-1">Evening help</div>
          </div>
        </div>
      </div>

      <div className="flex gap-12">
        <button onClick={() => onDecide('bat')}
          className="group relative px-20 py-10 rounded-3xl font-black text-4xl bg-gradient-to-br from-blue-600 to-blue-900 
            text-white shadow-2xl hover:shadow-blue-500/60 transition-all active:scale-95 hover:scale-105 border-4 border-blue-400">
          <div className="text-7xl mb-3">🏏</div>
          BAT FIRST
          <div className="text-base font-normal mt-3 text-blue-200">Set a challenging target</div>
        </button>
        
        <button onClick={() => onDecide('bowl')}
          className="group relative px-20 py-10 rounded-3xl font-black text-4xl bg-gradient-to-br from-red-600 to-red-900 
            text-white shadow-2xl hover:shadow-red-500/60 transition-all active:scale-95 hover:scale-105 border-4 border-red-400">
          <div className="text-7xl mb-3">⚾</div>
          BOWL FIRST
          <div className="text-base font-normal mt-3 text-red-200">Restrict and chase</div>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GAME SCREEN — PHASE 2 with FULL BOWLING CONTROLS
   ═══════════════════════════════════════════════════════════════════ */
function GameScreen({ team1, team2, battingFirst, gameMode, onExit }: any) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState({ runs: 0, wickets: 0, overs: 0, balls: 0 });
  const [message, setMessage] = useState('Match begins!');
  
  // Bowling controls
  const [speed, setSpeed] = useState(130);
  const [selectedLine, setSelectedLine] = useState<'wide_off' | 'off' | 'middle' | 'leg' | 'wide_leg'>('middle');
  const [selectedLength, setSelectedLength] = useState<'yorker' | 'full' | 'good' | 'short' | 'bouncer'>('good');
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [crease, setCrease] = useState<'over' | 'round'>('over');
  const [showFieldEditor, setShowFieldEditor] = useState(false);

  const battingTeam = TEAMS[battingFirst];
  const bowlingTeam = TEAMS[battingFirst === team1 ? team2 : team1];
  const currentBowler = bowlingTeam.players.find(p => p.role === 'Bowler' || p.role === 'All-rounder');
  const isSpin = currentBowler?.bowl.includes('OB') || currentBowler?.bowl.includes('LB') || currentBowler?.bowl.includes('SLA');
  const deliveries = isSpin ? SPIN_DELIVERIES : PACE_DELIVERIES;

  useEffect(() => {
    if (!mountRef.current) return;
    setMessage(`${battingFirst} batting first in ${gameMode}`);
    // 3D scene initialization will go here
  }, [battingFirst, gameMode]);

  const handleBowl = () => {
    // Simulate ball
    const runs = Math.floor(Math.random() * 7);
    const isWicket = Math.random() < 0.15;
    
    setScore(prev => ({
      runs: prev.runs + (isWicket ? 0 : runs),
      wickets: prev.wickets + (isWicket ? 1 : 0),
      balls: (prev.balls + 1) % 6,
      overs: prev.balls === 5 ? prev.overs + 1 : prev.overs
    }));

    if (isWicket) {
      setMessage('WICKET! Out!');
    } else if (runs === 6) {
      setMessage('SIX! Massive hit!');
    } else if (runs === 4) {
      setMessage('FOUR! Boundary!');
    } else {
      setMessage(`${runs} run${runs !== 1 ? 's' : ''}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-green-950 to-blue-950">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Top HUD — Enhanced Scoreboard */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-4 pointer-events-none">
        {/* Main Scoreboard */}
        <div className="bg-gradient-to-br from-black/90 to-blue-900/90 backdrop-blur-xl rounded-3xl p-6 border-2 border-blue-400/30 shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-6 mb-4">
            <div className="text-6xl">{battingTeam.flag}</div>
            <div>
              <div className="text-white/60 text-xs mb-1 uppercase font-bold tracking-wider">
                {battingTeam.name} Batting
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-black text-white">{score.runs}</span>
                <span className="text-3xl text-white/60">/{score.wickets}</span>
              </div>
            </div>
            <div className="h-16 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-white/60 text-xs mb-1">OVERS</div>
              <div className="text-3xl font-bold text-white">{score.overs}.{score.balls}</div>
            </div>
            <div className="h-16 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-white/60 text-xs mb-1">RUN RATE</div>
              <div className="text-3xl font-bold text-green-400">
                {score.overs > 0 ? (score.runs / score.overs).toFixed(2) : '0.00'}
              </div>
            </div>
          </div>
        </div>

        {/* Message Banner */}
        <div className={`px-8 py-4 rounded-2xl font-bold text-2xl shadow-2xl pointer-events-auto ${
          message.includes('WICKET') ? 'bg-red-600 animate-pulse' :
          message.includes('SIX') ? 'bg-purple-600 animate-bounce' :
          message.includes('FOUR') ? 'bg-blue-600' :
          'bg-green-600/90'
        }`}>
          <div className="text-white">{message}</div>
        </div>

        {/* Exit Button */}
        <button onClick={onExit}
          className="bg-red-600/90 hover:bg-red-500 px-6 py-3 rounded-2xl text-white font-bold text-lg transition-all pointer-events-auto border-2 border-red-400 hover:scale-105">
          ✕ EXIT
        </button>
      </div>

      {/* BOTTOM CONTROLS — Phase 2 Bowling Panel */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-4 pointer-events-none">
        {/* Left Panel — Bowling Controls */}
        <div className="bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-2xl rounded-3xl p-6 border-2 border-blue-400/30 shadow-2xl flex-1 max-w-2xl pointer-events-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-white uppercase tracking-wider">
              ⚾ Bowling Controls
            </h3>
            <div className="flex items-center gap-3">
              <div className="text-3xl">{bowlingTeam.flag}</div>
              <div>
                <div className="text-white/60 text-xs">BOWLER</div>
                <div className="text-white font-bold">{currentBowler?.name}</div>
              </div>
            </div>
          </div>

          {/* Speed Control */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <label className="text-white/80 font-bold text-sm uppercase">
                {isSpin ? '🌀 Spin' : '⚡ Speed'}
              </label>
              <span className="text-2xl font-black text-green-400">{speed} km/h</span>
            </div>
            <input type="range" min={isSpin ? 60 : 100} max={isSpin ? 120 : 160} value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r 
                [&::-webkit-slider-thumb]:from-green-400 [&::-webkit-slider-thumb]:to-blue-400 
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg" />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>{isSpin ? 'Slow' : 'Medium'}</span>
              <span>{isSpin ? 'Fast spin' : 'Express pace'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Line Selection */}
            <div>
              <label className="text-white/80 font-bold text-sm uppercase mb-2 block">📍 Line</label>
              <div className="grid grid-cols-3 gap-2">
                {(['wide_off', 'off', 'middle', 'leg', 'wide_leg'] as const).map((line) => (
                  <button key={line} onClick={() => setSelectedLine(line)}
                    className={`py-3 rounded-xl font-bold text-xs transition-all ${
                      selectedLine === line
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg scale-105'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}>
                    {line.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Length Selection */}
            <div>
              <label className="text-white/80 font-bold text-sm uppercase mb-2 block">📏 Length</label>
              <div className="grid grid-cols-3 gap-2">
                {(['yorker', 'full', 'good', 'short', 'bouncer'] as const).map((length) => (
                  <button key={length} onClick={() => setSelectedLength(length)}
                    className={`py-3 rounded-xl font-bold text-xs transition-all ${
                      selectedLength === length
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}>
                    {length.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Variation Wheel */}
          <div className="mt-5">
            <label className="text-white/80 font-bold text-sm uppercase mb-3 block">
              🎯 Delivery Variation ({isSpin ? 'Spin' : 'Pace'})
            </label>
            <div className="grid grid-cols-4 gap-2">
              {deliveries.map((del, idx) => (
                <button key={idx} onClick={() => setSelectedVariation(idx)}
                  className={`group relative p-3 rounded-xl font-bold text-xs transition-all ${
                    selectedVariation === idx
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl scale-105'
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:scale-105'
                  }`}>
                  <div className="text-2xl mb-1">{del.icon}</div>
                  <div>{del.name}</div>
                  <div className="text-[10px] text-white/50 mt-1">{del.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Crease Toggle */}
          <div className="mt-5 flex gap-3">
            <button onClick={() => setCrease('over')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                crease === 'over'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}>
              Over the wicket
            </button>
            <button onClick={() => setCrease('round')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                crease === 'round'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}>
              Round the wicket
            </button>
          </div>

          {/* Bowl Button */}
          <button onClick={handleBowl}
            className="w-full mt-6 py-5 rounded-2xl font-black text-3xl bg-gradient-to-r from-red-600 to-orange-600 
              text-white shadow-2xl hover:shadow-red-500/50 transition-all active:scale-95 hover:scale-105 border-2 border-red-400">
            ⚡ BOWL NOW
          </button>
        </div>

        {/* Right Panel — Pitch Map */}
        <div className="bg-gradient-to-br from-slate-900/95 to-green-900/95 backdrop-blur-2xl rounded-3xl p-6 border-2 border-green-400/30 shadow-2xl w-96 pointer-events-auto">
          <h3 className="text-xl font-black text-white uppercase mb-4">📊 Pitch Map</h3>
          
          {/* Pitch visualization */}
          <div className="relative bg-gradient-to-b from-green-800 to-green-900 rounded-2xl p-4 border-2 border-green-600 h-80">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/20 text-6xl font-black">PITCH</div>
            </div>
            
            {/* Crease lines */}
            <div className="absolute top-10 left-0 right-0 h-1 bg-white/40"></div>
            <div className="absolute bottom-10 left-0 right-0 h-1 bg-white/40"></div>
            
            {/* Zones */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-red-500/20 rounded-t-xl flex items-center justify-center">
              <span className="text-red-300 font-bold text-xs">BOUNCER ZONE</span>
            </div>
            <div className="absolute top-16 left-0 right-0 h-20 bg-amber-500/20 flex items-center justify-center">
              <span className="text-amber-300 font-bold text-xs">SHORT</span>
            </div>
            <div className="absolute top-36 left-0 right-0 h-20 bg-green-500/30 flex items-center justify-center">
              <span className="text-green-300 font-bold text-xs">GOOD LENGTH ✓</span>
            </div>
            <div className="absolute top-56 left-0 right-0 h-16 bg-amber-500/20 flex items-center justify-center">
              <span className="text-amber-300 font-bold text-xs">FULL</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-blue-500/20 rounded-b-xl flex items-center justify-center">
              <span className="text-blue-300 font-bold text-xs">YORKER</span>
            </div>
          </div>

          {/* Field Editor Button */}
          <button onClick={() => setShowFieldEditor(!showFieldEditor)}
            className="w-full mt-4 py-3 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all">
            {showFieldEditor ? '✕ Close Field Editor' : '⚙ Edit Field Placement'}
          </button>
        </div>
      </div>

      {/* Field Editor Overlay */}
      {showFieldEditor && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center pointer-events-auto">
          <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 max-w-4xl w-full border-2 border-blue-400">
            <h2 className="text-4xl font-black text-white mb-6">🏟️ Field Placement Editor</h2>
            <div className="relative bg-green-800 rounded-full w-full aspect-square mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/20 text-6xl">OVAL</div>
              </div>
            </div>
            <button onClick={() => setShowFieldEditor(false)}
              className="w-full py-4 rounded-xl font-bold text-xl bg-red-600 hover:bg-red-500 text-white">
              ✓ Apply & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
