import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './index.css';

/* ═══════════════════════════════════════════════════════════════════
   PLAYER DATABASE (2026 REAL ROSTERS)
   ═══════════════════════════════════════════════════════════════════ */
interface Player {
  name: string; role: string; bat: string; bowl: string; rating: number;
  captain?: boolean; keeper?: boolean;
}

const TEAMS: Record<string, { name: string; captain: string; color: number; flag: string; players: Player[] }> = {
  India: {
    name: 'India', captain: 'Shubman Gill', color: 0x0066cc, flag: '🇮🇳',
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
    name: 'Australia', captain: 'Pat Cummins', color: 0xffcc00, flag: '🇦🇺',
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
    name: 'England', captain: 'Ben Stokes', color: 0x003366, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
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
};

// Delivery types (for future use)
// const DELIVERIES_PACE = ['Outswing', 'Inswing', 'Seam up', 'Slower', 'Yorker', 'Bouncer', 'Off-cutter', 'Leg-cutter'];
// const DELIVERIES_SPIN = ['Off-break', 'Leg-break', 'Googly', 'Doosra', 'Carrom', 'Arm ball', 'Top-spin', 'Slider'];
// const FIELD_POSITIONS = [
//   'Fine leg', 'Square leg', 'Mid-wicket', 'Mid-on', 'Mid-off', 'Cover', 'Point', 'Gully',
//   'Third man', '1st Slip', '2nd Slip', 'Silly point', 'Short leg', 'Deep square', 'Long-on', 'Long-off'
// ];

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [phase, setPhase] = useState<'menu' | 'toss' | 'toss_result' | 'game'>('menu');
  const [team1, setTeam1] = useState('India');
  const [team2, setTeam2] = useState('Australia');
  const [tossChoice, setTossChoice] = useState<'heads' | 'tails' | null>(null);
  const [tossWinner, setTossWinner] = useState<string | null>(null);
  const [battingFirst, setBattingFirst] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<'T20' | 'ODI' | 'Test'>('T20');

  const handleStartGame = () => {
    setPhase('toss');
  };

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
    if (tossWinner === team1) {
      setBattingFirst(decision === 'bat' ? team1 : team2);
    } else {
      setBattingFirst(decision === 'bat' ? team2 : team1);
    }
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
    return <GameScreen team1={team1} team2={team2} battingFirst={battingFirst} gameMode={gameMode} 
      onExit={() => setPhase('menu')} />;
  }

  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   MENU SCREEN
   ═══════════════════════════════════════════════════════════════════ */
function MenuScreen({ onStart, team1, team2, setTeam1, setTeam2, gameMode, setGameMode }: any) {
  const teamNames = Object.keys(TEAMS);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="text-center max-w-4xl w-full p-8">
        <div className="text-8xl mb-4">🏏</div>
        <h1 className="text-6xl font-black text-white mb-8 tracking-tight">
          CRICKET 3D PRO
        </h1>
        <p className="text-xl text-blue-300 mb-12">Landscape • Full Controls • Real 2026 Players</p>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-white/70 text-sm mb-2 font-bold">TEAM 1</label>
            <select value={team1} onChange={(e) => setTeam1(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/10 text-white border-2 border-white/30 text-lg font-bold">
              {teamNames.map(t => <option key={t} value={t}>{TEAMS[t].flag} {t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2 font-bold">TEAM 2</label>
            <select value={team2} onChange={(e) => setTeam2(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/10 text-white border-2 border-white/30 text-lg font-bold">
              {teamNames.filter(t => t !== team1).map(t => <option key={t} value={t}>{TEAMS[t].flag} {t}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-white/70 text-sm mb-2 font-bold">GAME MODE</label>
          <div className="flex gap-4 justify-center">
            {(['T20', 'ODI', 'Test'] as const).map(mode => (
              <button key={mode} onClick={() => setGameMode(mode)}
                className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
                  gameMode === mode
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}>
                {mode}
              </button>
            ))}
          </div>
        </div>

        <button onClick={onStart}
          className="px-16 py-6 rounded-2xl font-black text-2xl bg-gradient-to-r from-green-500 to-emerald-600 
            text-white shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all active:scale-95">
          ▶ START MATCH
        </button>

        <div className="mt-12 text-white/40 text-sm">
          <p>Controls: WASD + Mouse | Touch: Joystick + Wheel</p>
          <p className="mt-1">Press F for field editor • C for camera • V for DRS</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TOSS SCREEN with 3D COIN
   ═══════════════════════════════════════════════════════════════════ */
function TossScreen({ team1, team2, onToss, tossChoice }: any) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

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

    // 3D Coin
    const coinGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 64);
    const coinMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.rotation.x = Math.PI / 2;
    scene.add(coin);

    // Coin faces text
    const canvas1 = document.createElement('canvas');
    canvas1.width = 256; canvas1.height = 256;
    const ctx1 = canvas1.getContext('2d')!;
    ctx1.fillStyle = '#333';
    ctx1.fillRect(0, 0, 256, 256);
    ctx1.fillStyle = '#fff';
    ctx1.font = 'bold 48px Arial';
    ctx1.textAlign = 'center';
    ctx1.fillText('HEADS', 128, 140);

    const canvas2 = document.createElement('canvas');
    canvas2.width = 256; canvas2.height = 256;
    const ctx2 = canvas2.getContext('2d')!;
    ctx2.fillStyle = '#222';
    ctx2.fillRect(0, 0, 256, 256);
    ctx2.fillStyle = '#fff';
    ctx2.font = 'bold 48px Arial';
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
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="grid grid-cols-2 h-full">
        {/* Team 1 */}
        <div className="flex flex-col items-center justify-center p-12" style={{ background: `linear-gradient(135deg, ${intToHex(t1.color)}40, transparent)` }}>
          <div className="text-8xl mb-4">{t1.flag}</div>
          <h2 className="text-5xl font-black text-white mb-2">{t1.name}</h2>
          <p className="text-2xl text-white/70">Captain: {t1.captain}</p>
        </div>

        {/* Team 2 */}
        <div className="flex flex-col items-center justify-center p-12" style={{ background: `linear-gradient(225deg, ${intToHex(t2.color)}40, transparent)` }}>
          <div className="text-8xl mb-4">{t2.flag}</div>
          <h2 className="text-5xl font-black text-white mb-2">{t2.name}</h2>
          <p className="text-2xl text-white/70">Captain: {t2.captain}</p>
        </div>
      </div>

      {/* Coin in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div ref={mountRef} className="w-96 h-96" />
        
        {!tossChoice && (
          <div className="flex gap-6 mt-8 pointer-events-auto">
            <button onClick={() => onToss('heads')}
              className="px-12 py-4 rounded-2xl font-black text-2xl bg-gradient-to-br from-yellow-500 to-yellow-700 
                text-white shadow-2xl hover:scale-105 transition-transform">
              HEADS
            </button>
            <button onClick={() => onToss('tails')}
              className="px-12 py-4 rounded-2xl font-black text-2xl bg-gradient-to-br from-gray-600 to-gray-800 
                text-white shadow-2xl hover:scale-105 transition-transform">
              TAILS
            </button>
          </div>
        )}

        {isSpinning && (
          <div className="text-white text-2xl font-bold mt-8 animate-pulse">Spinning...</div>
        )}
      </div>
    </div>
  );
}

function intToHex(num: number) {
  return '#' + num.toString(16).padStart(6, '0');
}

/* ═══════════════════════════════════════════════════════════════════
   TOSS RESULT SCREEN
   ═══════════════════════════════════════════════════════════════════ */
function TossResultScreen({ winner, onDecide }: { winner: string; onDecide: (d: 'bat' | 'bowl') => void }) {
  const team = TEAMS[winner];
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-emerald-900">
      <div className="text-9xl mb-6 animate-bounce">{team.flag}</div>
      <h1 className="text-6xl font-black text-white mb-4">{team.name} WINS THE TOSS!</h1>
      <p className="text-3xl text-white/80 mb-12">Captain {team.captain} to decide</p>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-12 border-2 border-white/20">
        <h3 className="text-white/60 text-sm font-bold mb-3">PITCH REPORT</h3>
        <div className="grid grid-cols-3 gap-6 text-white">
          <div>
            <div className="text-xs text-white/50 mb-1">Surface</div>
            <div className="font-bold">Dry & Hard</div>
          </div>
          <div>
            <div className="text-xs text-white/50 mb-1">Weather</div>
            <div className="font-bold">Sunny ☀️</div>
          </div>
          <div>
            <div className="text-xs text-white/50 mb-1">Dew</div>
            <div className="font-bold">Expected</div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <button onClick={() => onDecide('bat')}
          className="group px-16 py-8 rounded-2xl font-black text-3xl bg-gradient-to-br from-blue-600 to-blue-800 
            text-white shadow-2xl hover:shadow-blue-500/50 transition-all active:scale-95">
          <div className="text-6xl mb-2">🏏</div>
          BAT FIRST
          <div className="text-sm font-normal mt-2 text-white/70">Set a target</div>
        </button>
        
        <button onClick={() => onDecide('bowl')}
          className="group px-16 py-8 rounded-2xl font-black text-3xl bg-gradient-to-br from-red-600 to-red-800 
            text-white shadow-2xl hover:shadow-red-500/50 transition-all active:scale-95">
          <div className="text-6xl mb-2">⚾</div>
          BOWL FIRST
          <div className="text-sm font-normal mt-2 text-white/70">Chase later</div>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GAME SCREEN - Main 3D Cricket Game
   ═══════════════════════════════════════════════════════════════════ */
function GameScreen({ battingFirst, gameMode, onExit }: any) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [score] = useState({ runs: 0, wickets: 0, overs: 0, balls: 0 });
  const [message, setMessage] = useState('Match begins!');
  
  useEffect(() => {
    if (!mountRef.current) return;
    // 3D game will be built here
    setMessage(`${battingFirst} batting first in ${gameMode}`);
  }, [battingFirst, gameMode]);

  return (
    <div className="fixed inset-0 bg-black">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* HUD Scoreboard */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-lg rounded-2xl p-4 border-2 border-white/20">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-white/60 text-xs">SCORE</div>
            <div className="text-white text-4xl font-black">{score.runs}/{score.wickets}</div>
          </div>
          <div className="h-12 w-px bg-white/20" />
          <div>
            <div className="text-white/60 text-xs">OVERS</div>
            <div className="text-white text-2xl font-bold">{score.overs}.{score.balls}</div>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-600/90 px-6 py-3 rounded-xl">
        <div className="text-white font-bold text-lg">{message}</div>
      </div>

      {/* Exit button */}
      <button onClick={onExit}
        className="absolute top-4 right-4 bg-red-600/90 hover:bg-red-500 px-4 py-2 rounded-xl 
          text-white font-bold transition-all">
        ✕ EXIT
      </button>

      {/* Coming soon overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
        <div className="text-center">
          <div className="text-6xl mb-4">🏗️</div>
          <h2 className="text-4xl font-black text-white mb-4">Full 3D Game Loading...</h2>
          <p className="text-xl text-white/70 mb-8">
            This will include all bowling controls, batting mechanics,<br />
            field placement, DRS, cameras, and full gameplay
          </p>
          <p className="text-white/50">
            For now: Toss system ✅ | Team selection ✅ | Mode selection ✅
          </p>
        </div>
      </div>
    </div>
  );
}
