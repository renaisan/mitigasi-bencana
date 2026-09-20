import React, { useEffect, useState, useRef } from 'react';
import type { MitigationPose, MitigationMood } from '@/types/scenario';
import { CharacterSvg } from '@/components/character/CharacterSvg';
import { Play, Square, FastForward, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimulationStageProps {
  scene: 'rumah' | 'sekolah' | 'pesisir' | 'banjir' | 'kebakaran';
  pose: MitigationPose;
  mood: MitigationMood;
  moveX: number;
  moveY: number;
  currentStep: number;
  totalSteps: number;
  captionText: string;
  isSimulating: boolean;
  isCompleted: boolean;
  phaseKey?: string;
  phaseLabel?: string;
  showOverlay?: boolean;
  overlayIcon?: string;
  hasQuake?: boolean;
  hasTsunami?: boolean;
  hasFlood?: boolean;
  hasFire?: boolean;
  onPlay: () => void;
  onStop: () => void;
  onStepNext?: () => void;
  canPlay: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const SimulationStage: React.FC<SimulationStageProps> = ({
  scene,
  pose,
  mood,
  moveX,
  moveY,
  currentStep,
  totalSteps,
  captionText,
  isSimulating,
  isCompleted,
  phaseKey = 'sebelum',
  phaseLabel = 'Pra-Bencana',
  showOverlay = false,
  overlayIcon = '🧭',
  hasQuake = false,
  hasTsunami = false,
  hasFlood = false,
  hasFire = false,
  onPlay,
  onStop,
  onStepNext,
  canPlay,
  speed,
  onSpeedChange,
}) => {
  // Typewriter effect
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayedText('');
    setIsTyping(true);

    let idx = 0;
    const interval = Math.max(12, Math.floor(25 / speed));

    timerRef.current = setInterval(() => {
      if (idx < captionText.length) {
        setDisplayedText(captionText.substring(0, idx + 1));
        idx++;
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsTyping(false);
      }
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [captionText, speed]);

  // Phase colors for top indicator
  const phaseColorMap: Record<string, string> = {
    sebelum: '#2F6FED',
    saat: '#E14B4B',
    sesudah: '#17A868',
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Simulation Stage Toolbar */}
      <div className="flex items-center justify-between gap-3 bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            data-testid="stage-play-button"
            size="sm"
            onClick={onPlay}
            disabled={!canPlay || isSimulating}
            className={`rounded-xl font-bold px-4 transition-all ${
              canPlay && !isSimulating
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-200 text-slate-400'
            }`}
          >
            <Play className="w-4 h-4 mr-1.5 fill-current" />
            Simulasi
          </Button>

          <Button
            type="button"
            data-testid="stage-stop-button"
            variant="outline"
            size="sm"
            onClick={onStop}
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
          >
            <Square className="w-3.5 h-3.5 mr-1 fill-current text-rose-500" />
            Stop
          </Button>

          {isSimulating && onStepNext && (
            <Button
              type="button"
              data-testid="stage-step-next-button"
              variant="ghost"
              size="sm"
              onClick={onStepNext}
              className="rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
            >
              <FastForward className="w-3.5 h-3.5 mr-1" />
              Lanjut
            </Button>
          )}
        </div>

        {/* Speed toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {[1, 1.5, 2].map((s) => (
            <button
              key={s}
              type="button"
              data-testid={`speed-toggle-${s}x`}
              onClick={() => onSpeedChange(s)}
              className={`text-xs font-bold px-2 py-1 rounded-lg transition-all ${
                speed === s
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Main Stage Viewport */}
      <div
        id="simulation-stage-viewport"
        data-testid="simulation-stage-viewport"
        className={`relative w-full aspect-[16/11] sm:aspect-[16/10] rounded-2xl overflow-hidden shadow-xl bg-slate-950 border-2 transition-all ${
          hasQuake ? 'stage-shake border-rose-500/60 shadow-rose-500/20' : 'border-slate-800'
        } ${isSimulating ? 'ring-2 ring-amber-400/50' : ''}`}
      >
        {/* SVG Scenery Backdrop */}
        <div className="absolute inset-0 z-0">
          <svg
            viewBox="0 0 220 220"
            className="w-full h-full block select-none"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="skyHome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#CBE3FF" />
                <stop offset="100%" stopColor="#E8F0FF" />
              </linearGradient>
              <linearGradient id="wallWood" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#E5A869" />
                <stop offset="100%" stopColor="#C78B4E" />
              </linearGradient>
              <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4AA5E8" />
                <stop offset="100%" stopColor="#1A68B3" />
              </linearGradient>
              <linearGradient id="floodG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#85643B" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#4A341E" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="fireG" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#FF3D00" />
                <stop offset="60%" stopColor="#FF9100" />
                <stop offset="100%" stopColor="#FFEA00" />
              </linearGradient>
            </defs>

            {/* SCENE 1: RUMAH */}
            {scene === 'rumah' && (
              <g id="scene-rumah">
                {/* Background Sky */}
                <rect width="220" height="220" fill="url(#skyHome)" />
                {/* Sun */}
                <circle cx="190" cy="28" r="14" fill="#FFD873" opacity="0.85" />
                {/* Floating Clouds */}
                <ellipse cx="45" cy="26" rx="20" ry="8" fill="#FFFFFF" opacity="0.6" />
                <ellipse cx="130" cy="20" rx="16" ry="6" fill="#FFFFFF" opacity="0.4" />

                {/* Living Room Floor */}
                <rect y="150" width="220" height="70" fill="#E2CFB4" />
                <rect x="0" y="145" width="220" height="6" fill="#A87A4A" rx="1" />

                {/* Living Room Wall Paint */}
                <rect x="0" y="0" width="220" height="145" fill="#FAF6EE" opacity="0.5" />

                {/* Hanging Picture Frame */}
                <rect x="35" y="45" width="34" height="26" rx="2" fill="#D4A373" />
                <rect x="38" y="48" width="28" height="20" rx="1" fill="#FEFAE0" />
                <circle cx="52" cy="56" r="4" fill="#E76F51" />

                {/* Cabinet that wobbles during earthquake */}
                <g
                  id="furnitureCabinet"
                  style={{
                    transformOrigin: '165px 105px',
                    transform: hasQuake ? 'rotate(-4deg)' : 'rotate(0deg)',
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  <rect x="135" y="60" width="60" height="90" rx="4" fill="url(#wallWood)" />
                  <rect x="143" y="68" width="20" height="32" rx="2" fill="#FFE3C4" opacity="0.8" />
                  <rect x="167" y="68" width="20" height="32" rx="2" fill="#FFE3C4" opacity="0.8" />
                  <rect x="143" y="106" width="20" height="38" rx="2" fill="#FFE3C4" opacity="0.8" />
                  <rect x="167" y="106" width="20" height="38" rx="2" fill="#FFE3C4" opacity="0.8" />
                  <circle cx="153" cy="84" r="2.5" fill="#B8884A" />
                  <circle cx="177" cy="84" r="2.5" fill="#B8884A" />
                </g>

                {/* Sturdy Table for Drop Cover Hold On */}
                <g id="furnitureTable" transform="translate(15,118)">
                  <rect x="0" y="0" width="68" height="9" rx="2" fill="#3B6FE0" />
                  <rect x="5" y="9" width="8" height="25" rx="1" fill="#2954B5" />
                  <rect x="55" y="9" width="8" height="25" rx="1" fill="#2954B5" />
                </g>

                {/* Falling Debris Particles on Earthquake */}
                <g id="debrisGroup" opacity={hasQuake ? 1 : 0} style={{ transition: 'opacity 0.3s' }}>
                  <rect className="debris-particle" x="30" y="15" width="6" height="6" rx="1" fill="#A87A4A" />
                  <rect className="debris-particle" x="145" y="8" width="5" height="5" rx="1" fill="#C78B4E" />
                  <rect className="debris-particle" x="80" y="20" width="4" height="4" rx="1" fill="#888888" />
                </g>
              </g>
            )}

            {/* SCENE 2: SEKOLAH */}
            {scene === 'sekolah' && (
              <g id="scene-sekolah">
                <rect width="220" height="220" fill="#E8F5FF" />
                <rect y="150" width="220" height="70" fill="#EADBC8" />
                <rect x="0" y="145" width="220" height="6" fill="#B89B72" rx="1" />

                {/* Classroom Chalkboard */}
                <rect x="25" y="30" width="170" height="80" rx="5" fill="#2D5A43" />
                <rect x="29" y="34" width="162" height="72" rx="3" fill="#34684E" />
                <path
                  d="M40 50 L85 50 M40 62 L120 62 M40 74 L90 74"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.5"
                />

                {/* School Clock */}
                <circle cx="110" cy="18" r="10" fill="#FFFFFF" stroke="#34684E" strokeWidth="2" />
                <line x1="110" y1="18" x2="110" y2="12" stroke="#1E293B" strokeWidth="1.5" />
                <line x1="110" y1="18" x2="115" y2="18" stroke="#1E293B" strokeWidth="1.5" />

                {/* Classroom Desks */}
                <g id="furnitureTableSchool" transform="translate(18,118)">
                  <rect x="0" y="0" width="68" height="9" rx="2" fill="#D97724" />
                  <rect x="6" y="9" width="7" height="25" rx="1" fill="#A05212" />
                  <rect x="55" y="9" width="7" height="25" rx="1" fill="#A05212" />
                </g>

                {/* Secondary Desk */}
                <g transform="translate(145,124)">
                  <rect x="0" y="0" width="55" height="8" rx="2" fill="#D97724" opacity="0.8" />
                  <rect x="5" y="8" width="6" height="20" rx="1" fill="#A05212" opacity="0.8" />
                  <rect x="44" y="8" width="6" height="20" rx="1" fill="#A05212" opacity="0.8" />
                </g>
              </g>
            )}

            {/* SCENE 3: PESISIR TSUNAMI */}
            {scene === 'pesisir' && (
              <g id="scene-pesisir">
                {/* Coastal Blue Sky */}
                <rect width="220" height="220" fill="#89C4F4" />
                <circle cx="34" cy="26" r="16" fill="#FFD873" />

                {/* Distant Hills / Evacuation Elevation (TES) */}
                <path d="M90 150 L155 45 L220 150 Z" fill="#60A14E" />
                <path d="M125 150 L180 70 L220 150 Z" fill="#4E873E" />

                {/* Tsunami Evacuation Shelter Flag on Mountain */}
                <line x1="155" y1="45" x2="155" y2="28" stroke="#FFFFFF" strokeWidth="2" />
                <path d="M155 28 L170 34 L155 40 Z" fill="#E14B4B" />

                {/* Sandy Beach Coastline */}
                <rect y="140" width="220" height="80" fill="#E6C894" />

                {/* Ocean Water Base */}
                <path
                  d="M0 148 Q20 142 40 148 T80 148 T120 148 T160 148 T200 148 T240 148 L240 160 L0 160 Z"
                  fill="#5FB6E0"
                  opacity="0.6"
                />

                {/* Animated Rising Tsunami Wave */}
                <path
                  id="tsunamiWave"
                  d="M-20 160 Q20 135 60 160 T140 160 T220 160 T260 160 L260 220 L-20 220 Z"
                  fill="url(#seaG)"
                  style={{
                    transform: hasTsunami ? 'translate(0px, -55px)' : 'translate(0px, 35px)',
                    transition: 'transform 2.2s cubic-bezier(0.15, 0.8, 0.2, 1)',
                  }}
                />
              </g>
            )}

            {/* SCENE 4: BANJIR PEMUKIMAN */}
            {scene === 'banjir' && (
              <g id="scene-banjir">
                <rect width="220" height="220" fill="#B0C4DE" />
                {/* Heavy Cloud */}
                <ellipse cx="60" cy="30" rx="35" ry="16" fill="#5F768D" />
                <ellipse cx="140" cy="25" rx="40" ry="18" fill="#4A5F75" />

                {/* Houses */}
                <rect x="20" y="80" width="65" height="70" fill="#E2E8F0" />
                <path d="M15 80 L52 45 L90 80 Z" fill="#D97724" />
                <rect x="35" y="95" width="16" height="20" fill="#64748B" />

                {/* Power Box with Electrical Hazard Warning */}
                <rect x="90" y="90" width="14" height="20" rx="2" fill="#334155" />
                <polygon points="97,94 93,101 97,101 95,107 101,99 97,99" fill="#FACC15" />

                {/* Second House Roof */}
                <rect x="135" y="85" width="75" height="65" fill="#CBD5E1" />
                <path d="M130 85 L172 50 L215 85 Z" fill="#991B1B" />

                {/* Rising Flood Water */}
                <rect
                  x="0"
                  y="125"
                  width="220"
                  height="95"
                  fill="url(#floodG)"
                  style={{
                    transform: hasFlood ? 'translateY(-20px)' : 'translateY(15px)',
                    transition: 'transform 1.8s ease-in-out',
                  }}
                />
                {/* Floating Orange Rescue Buoy */}
                <ellipse
                  cx="40"
                  cy="142"
                  rx="14"
                  ry="7"
                  fill="#FF8A00"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  style={{
                    transform: hasFlood ? 'translateY(-20px)' : 'translateY(15px)',
                    transition: 'transform 1.8s ease-in-out',
                  }}
                />
              </g>
            )}

            {/* SCENE 5: KEBAKARAN GEDUNG */}
            {scene === 'kebakaran' && (
              <g id="scene-kebakaran">
                <rect width="220" height="220" fill="#1E293B" />
                {/* Building Hallway Wall */}
                <rect x="0" y="20" width="220" height="130" fill="#334155" />
                <rect y="150" width="220" height="70" fill="#0F172A" />

                {/* EXIT Emergency Sign (Green Glow) */}
                <rect x="150" y="32" width="45" height="18" rx="3" fill="#10B981" />
                <text
                  x="172"
                  y="45"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  EXIT ➔
                </text>

                {/* Emergency Flashing Beacon */}
                <circle cx="28" cy="38" r="7" fill={hasFire ? '#EF4444' : '#64748B'} />
                {hasFire && <circle cx="28" cy="38" r="14" fill="#EF4444" opacity="0.3" />}

                {/* Flame Layers in Doorway */}
                <g
                  style={{
                    opacity: hasFire ? 1 : 0.2,
                    transition: 'opacity 0.5s',
                  }}
                >
                  <path
                    d="M10 150 Q20 100 30 150 Q40 90 50 150 Q60 110 70 150 Z"
                    fill="url(#fireG)"
                    opacity="0.85"
                  />
                  <path
                    d="M15 150 Q25 120 35 150 Q45 110 55 150 Z"
                    fill="#FFF700"
                    opacity="0.9"
                  />
                </g>
              </g>
            )}

            {/* Animated Character Component */}
            <CharacterSvg
              pose={pose}
              mood={mood}
              moveX={moveX}
              moveY={moveY}
              isCelebrating={isCompleted}
            />
          </svg>
        </div>

        {/* Dynamic HTML Overlay Effects Layers (Sibling to SVG, ensuring valid rendering) */}
        {/* Dust Overlay for Earthquakes */}
        {hasQuake && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="dust-particle"
                style={{
                  left: `${8 + (i * 7.5) % 85}%`,
                  top: `${35 + (i * 5) % 45}%`,
                  width: `${3 + (i % 4) * 2}px`,
                  height: `${3 + (i % 4) * 2}px`,
                  ['--dust-dur' as string]: `${1.4 + (i % 3) * 0.5}s`,
                  ['--dust-delay' as string]: `${(i * 0.15) % 1}s`,
                  ['--dust-dx' as string]: `${-15 + (i % 5) * 8}px`,
                }}
              />
            ))}
          </div>
        )}

        {/* Rain Layer for Storm / Flood */}
        {(scene === 'banjir' || (hasQuake && mood === 'scared')) && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="rain-streak"
                style={{
                  left: `${(i * 6.2) % 100}%`,
                  height: `${10 + (i % 4) * 6}px`,
                  ['--rain-dur' as string]: `${0.28 + (i % 3) * 0.1}s`,
                  animationDelay: `${(i * 0.08) % 0.5}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Fire Embers for Fire scenario */}
        {hasFire && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className="ember-particle"
                style={{
                  left: `${5 + (i * 6) % 45}%`,
                  bottom: `${15 + (i % 5) * 8}%`,
                  width: `${3 + (i % 3) * 2}px`,
                  height: `${3 + (i % 3) * 2}px`,
                  ['--ember-dur' as string]: `${1.2 + (i % 4) * 0.3}s`,
                  ['--ember-delay' as string]: `${(i * 0.12) % 0.8}s`,
                  ['--ember-dx' as string]: `${-10 + (i % 4) * 10}px`,
                }}
              />
            ))}
          </div>
        )}

        {/* Step Badge (Top Right) */}
        {isSimulating && currentStep > 0 && (
          <div
            data-testid="stage-step-badge"
            className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-heading font-extrabold text-base shadow-lg shadow-amber-500/40 animate-in zoom-in-75 duration-300"
          >
            {currentStep}
          </div>
        )}

        {/* Phase Announcement Overlay */}
        {showOverlay && (
          <div
            data-testid="stage-phase-overlay"
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/75 backdrop-blur-xs text-white transition-opacity duration-300 animate-in fade-in"
          >
            <div className="text-4xl sm:text-5xl mb-2 animate-bounce">{overlayIcon}</div>
            <div
              className="text-lg sm:text-2xl font-heading font-extrabold tracking-wider px-4 py-1.5 rounded-xl shadow-lg uppercase"
              style={{
                backgroundColor: phaseColorMap[phaseKey] || '#2F6FED',
                color: '#FFFFFF',
              }}
            >
              FASE {phaseLabel}
            </div>
          </div>
        )}

        {/* Stage Caption Bottom Banner */}
        <div className="absolute left-0 right-0 bottom-0 z-20 px-3.5 py-2.5 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent backdrop-blur-xs">
          <p
            data-testid="stage-caption-text"
            className="text-xs sm:text-sm font-medium text-white/95 leading-snug min-h-[1.5rem]"
          >
            {displayedText}
            {isTyping && (
              <span className="inline-block w-1.5 h-3.5 ml-1 bg-amber-400 animate-pulse align-middle" />
            )}
          </p>
        </div>
      </div>

      {/* Mini Step Progress Bar under stage */}
      <div className="flex items-center gap-1.5 px-1">
        {Array.from({ length: totalSteps || 1 }).map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
              currentStep > idx
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-xs'
                : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
