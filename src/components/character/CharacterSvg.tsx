import React from 'react';
import type { MitigationPose, MitigationMood } from '@/types/scenario';

interface CharacterSvgProps {
  pose?: MitigationPose;
  mood?: MitigationMood;
  moveX?: number;
  moveY?: number;
  isCelebrating?: boolean;
}

export const CharacterSvg: React.FC<CharacterSvgProps> = ({
  pose = 'idle',
  mood = 'normal',
  moveX = 0,
  moveY = 0,
  isCelebrating = false,
}) => {
  return (
    <g
      id="charMover"
      style={{
        transform: `translate(${moveX}px, ${moveY}px)`,
        transition: 'transform 1.4s cubic-bezier(0.45, 0.05, 0.55, 0.95)',
      }}
    >
      <g
        id="character"
        data-pose={pose}
        data-mood={mood}
        className={isCelebrating ? 'char-celebrate' : ''}
        transform="translate(60,65) scale(0.85)"
      >
        <g className="crouchGroup">
          {/* Left Leg with Anchor */}
          <g transform="translate(22,86)">
            <g className="leg leg-l">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="48"
                stroke="#1E293B"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <ellipse cx="0" cy="48" rx="7" ry="4" fill="#0F172A" />
            </g>
          </g>

          {/* Right Leg with Anchor */}
          <g transform="translate(42,86)">
            <g className="leg leg-r">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="48"
                stroke="#1E293B"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <ellipse cx="0" cy="48" rx="7" ry="4" fill="#0F172A" />
            </g>
          </g>

          {/* Torso & Rescue Vest / Backpack */}
          <rect
            className="torso"
            x="16"
            y="32"
            width="32"
            height="56"
            rx="14"
            fill="#2F6FED"
          />

          {/* Siaga Vest Stripe */}
          <rect
            x="16"
            y="48"
            width="32"
            height="10"
            fill="#FF8A00"
            opacity="0.9"
          />
          <line
            x1="22"
            y1="48"
            x2="22"
            y2="58"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="42"
            y1="48"
            x2="42"
            y2="58"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Emergency Backpack (visible on sides) */}
          <rect
            x="11"
            y="38"
            width="6"
            height="32"
            rx="3"
            fill="#E14B4B"
            opacity="0.85"
          />

          {/* Left Arm with Anchor */}
          <g transform="translate(16,38)">
            <g className="arm arm-l">
              <line
                x1="0"
                y1="0"
                x2="-12"
                y2="38"
                stroke="#2F6FED"
                strokeWidth="9"
                strokeLinecap="round"
              />
              <circle cx="-12" cy="38" r="5" fill="#FFCBB2" />
            </g>
          </g>

          {/* Right Arm with Anchor */}
          <g transform="translate(48,38)">
            <g className="arm arm-r">
              <line
                x1="0"
                y1="0"
                x2="12"
                y2="38"
                stroke="#2F6FED"
                strokeWidth="9"
                strokeLinecap="round"
              />
              <circle cx="12" cy="38" r="5" fill="#FFCBB2" />
            </g>
          </g>

          {/* Head Group with Anchor */}
          <g transform="translate(32,22)">
            <g className="headGroup">
              {/* Head Base */}
              <circle cx="0" cy="0" r="22" fill="#FFCBB2" />

              {/* Hair */}
              <path
                d="M-22-4Q0-30 22-4Q10-22-12-20Z"
                fill="#382212"
              />

              {/* Safety Cap / Ribbon */}
              <path
                d="M-20-8 Q0-26 20-8"
                stroke="#2F6FED"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />

              {/* Normal Eyes */}
              {mood === 'normal' && (
                <g className="eye-normal">
                  <circle cx="-7" cy="-2" r="3" fill="#1E2233" />
                  <circle cx="7" cy="-2" r="3" fill="#1E2233" />
                  <circle cx="-6" cy="-3" r="1.2" fill="#FFFFFF" />
                  <circle cx="8" cy="-3" r="1.2" fill="#FFFFFF" />
                </g>
              )}

              {/* Scared / Alert Eyes */}
              {mood === 'scared' && (
                <g className="eye-scared">
                  <circle cx="-7" cy="-2" r="5.5" fill="#FFFFFF" />
                  <circle cx="-7" cy="-1" r="2.6" fill="#1E2233" />
                  <circle cx="7" cy="-2" r="5.5" fill="#FFFFFF" />
                  <circle cx="7" cy="-1" r="2.6" fill="#1E2233" />
                  {/* Eyebrows angled in fear */}
                  <line x1="-12" y1="-8" x2="-3" y2="-5" stroke="#382212" strokeWidth="2" strokeLinecap="round" />
                  <line x1="12" y1="-8" x2="3" y2="-5" stroke="#382212" strokeWidth="2" strokeLinecap="round" />
                </g>
              )}

              {/* Normal Mouth */}
              {mood === 'normal' && (
                <path
                  className="mouth-normal"
                  d="M-5 8Q0 12 5 8"
                  stroke="#1E2233"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              )}

              {/* Scared / Gasp Mouth */}
              {mood === 'scared' && (
                <ellipse
                  className="mouth-scared"
                  cx="0"
                  cy="9"
                  rx="4"
                  ry="6"
                  fill="#1E2233"
                />
              )}

              {/* Cheeks Blush */}
              <circle cx="-12" cy="6" r="4" fill="#FF8A8A" opacity="0.45" />
              <circle cx="12" cy="6" r="4" fill="#FF8A8A" opacity="0.45" />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
};
