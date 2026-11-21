import React from 'react';

/**
 * Geometric skyline illustration matching 1_Home.png hero section bottom
 */
export const CitySkyline: React.FC = () => {
  return (
    <div className="skyline-wrapper" aria-hidden="true">
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="skyline-svg"
      >
        {/* Background Building Layer */}
        <rect x="0" y="70" width="70" height="50" fill="#153252" />
        <rect x="80" y="45" width="55" height="75" fill="#153252" />
        <rect x="145" y="60" width="60" height="60" fill="#153252" />
        <rect x="220" y="50" width="70" height="70" fill="#153252" />
        <rect x="300" y="65" width="50" height="55" fill="#153252" />
        <rect x="360" y="40" width="80" height="80" fill="#153252" />
        <rect x="455" y="70" width="65" height="50" fill="#153252" />
        <rect x="530" y="55" width="50" height="65" fill="#153252" />
        <rect x="590" y="62" width="75" height="58" fill="#153252" />
        <rect x="680" y="48" width="60" height="72" fill="#153252" />
        <rect x="750" y="68" width="80" height="52" fill="#153252" />
        <rect x="840" y="42" width="75" height="78" fill="#153252" />
        <rect x="925" y="58" width="60" height="62" fill="#153252" />
        <rect x="995" y="70" width="80" height="50" fill="#153252" />
        <rect x="1085" y="50" width="75" height="70" fill="#153252" />
        <rect x="1170" y="62" width="70" height="58" fill="#153252" />
        <rect x="1250" y="40" width="85" height="80" fill="#153252" />
        <rect x="1345" y="60" width="95" height="60" fill="#153252" />

        {/* Foreground Building Layer */}
        <rect x="15" y="80" width="60" height="40" fill="#1a3f66" />
        <rect x="95" y="55" width="50" height="65" fill="#1a3f66" />
        <rect x="170" y="70" width="70" height="50" fill="#1a3f66" />
        <rect x="250" y="58" width="75" height="62" fill="#1a3f66" />
        <rect x="335" y="75" width="65" height="45" fill="#1a3f66" />
        <rect x="415" y="50" width="60" height="70" fill="#1a3f66" />
        <rect x="485" y="78" width="70" height="42" fill="#1a3f66" />
        <rect x="565" y="65" width="80" height="55" fill="#1a3f66" />
        <rect x="655" y="72" width="60" height="48" fill="#1a3f66" />
        <rect x="725" y="55" width="75" height="65" fill="#1a3f66" />
        <rect x="810" y="75" width="60" height="45" fill="#1a3f66" />
        <rect x="880" y="52" width="70" height="68" fill="#1a3f66" />
        <rect x="960" y="68" width="65" height="52" fill="#1a3f66" />
        <rect x="1035" y="58" width="75" height="62" fill="#1a3f66" />
        <rect x="1120" y="75" width="80" height="45" fill="#1a3f66" />
        <rect x="1210" y="50" width="75" height="70" fill="#1a3f66" />
        <rect x="1295" y="65" width="80" height="55" fill="#1a3f66" />
        <rect x="1385" y="78" width="55" height="42" fill="#1a3f66" />

        {/* Windows pattern on buildings */}
        {/* Building 1 (x:95 y:55) */}
        <rect x="105" y="62" width="4" height="4" fill="#38bdf8" opacity="0.75" />
        <rect x="117" y="62" width="4" height="4" fill="#38bdf8" opacity="0.6" />
        <rect x="129" y="62" width="4" height="4" fill="#38bdf8" opacity="0.9" />
        <rect x="105" y="74" width="4" height="4" fill="#38bdf8" opacity="0.5" />
        <rect x="129" y="74" width="4" height="4" fill="#38bdf8" opacity="0.8" />
        <rect x="117" y="86" width="4" height="4" fill="#38bdf8" opacity="0.65" />

        {/* Building 2 (x:250 y:58) */}
        <rect x="260" y="68" width="4" height="4" fill="#38bdf8" opacity="0.7" />
        <rect x="275" y="68" width="4" height="4" fill="#38bdf8" opacity="0.85" />
        <rect x="290" y="68" width="4" height="4" fill="#38bdf8" opacity="0.5" />
        <rect x="305" y="68" width="4" height="4" fill="#38bdf8" opacity="0.8" />
        <rect x="260" y="82" width="4" height="4" fill="#38bdf8" opacity="0.6" />
        <rect x="275" y="82" width="4" height="4" fill="#38bdf8" opacity="0.9" />
        <rect x="305" y="82" width="4" height="4" fill="#38bdf8" opacity="0.7" />

        {/* Building 3 (x:415 y:50) */}
        <rect x="425" y="58" width="4" height="4" fill="#38bdf8" opacity="0.7" />
        <rect x="440" y="58" width="4" height="4" fill="#38bdf8" opacity="0.9" />
        <rect x="455" y="58" width="4" height="4" fill="#38bdf8" opacity="0.6" />
        <rect x="425" y="72" width="4" height="4" fill="#38bdf8" opacity="0.8" />
        <rect x="455" y="72" width="4" height="4" fill="#38bdf8" opacity="0.5" />
        <rect x="440" y="86" width="4" height="4" fill="#38bdf8" opacity="0.75" />

        {/* Building 4 (x:565 y:65) */}
        <rect x="578" y="74" width="4" height="4" fill="#38bdf8" opacity="0.6" />
        <rect x="595" y="74" width="4" height="4" fill="#38bdf8" opacity="0.85" />
        <rect x="612" y="74" width="4" height="4" fill="#38bdf8" opacity="0.7" />
        <rect x="628" y="74" width="4" height="4" fill="#38bdf8" opacity="0.9" />
        <rect x="578" y="88" width="4" height="4" fill="#38bdf8" opacity="0.5" />
        <rect x="612" y="88" width="4" height="4" fill="#38bdf8" opacity="0.8" />

        {/* Building 5 (x:725 y:55) */}
        <rect x="738" y="64" width="4" height="4" fill="#38bdf8" opacity="0.7" />
        <rect x="755" y="64" width="4" height="4" fill="#38bdf8" opacity="0.8" />
        <rect x="772" y="64" width="4" height="4" fill="#38bdf8" opacity="0.65" />
        <rect x="738" y="78" width="4" height="4" fill="#38bdf8" opacity="0.85" />
        <rect x="755" y="78" width="4" height="4" fill="#38bdf8" opacity="0.5" />
        <rect x="772" y="78" width="4" height="4" fill="#38bdf8" opacity="0.9" />

        {/* Building 6 (x:880 y:52) */}
        <rect x="895" y="62" width="4" height="4" fill="#38bdf8" opacity="0.7" />
        <rect x="912" y="62" width="4" height="4" fill="#38bdf8" opacity="0.6" />
        <rect x="930" y="62" width="4" height="4" fill="#38bdf8" opacity="0.85" />
        <rect x="895" y="76" width="4" height="4" fill="#38bdf8" opacity="0.8" />
        <rect x="930" y="76" width="4" height="4" fill="#38bdf8" opacity="0.6" />

        {/* Building 7 (x:1035 y:58) */}
        <rect x="1050" y="68" width="4" height="4" fill="#38bdf8" opacity="0.75" />
        <rect x="1068" y="68" width="4" height="4" fill="#38bdf8" opacity="0.9" />
        <rect x="1086" y="68" width="4" height="4" fill="#38bdf8" opacity="0.6" />
        <rect x="1050" y="82" width="4" height="4" fill="#38bdf8" opacity="0.5" />
        <rect x="1068" y="82" width="4" height="4" fill="#38bdf8" opacity="0.8" />

        {/* Building 8 (x:1210 y:50) */}
        <rect x="1225" y="58" width="4" height="4" fill="#38bdf8" opacity="0.7" />
        <rect x="1242" y="58" width="4" height="4" fill="#38bdf8" opacity="0.85" />
        <rect x="1260" y="58" width="4" height="4" fill="#38bdf8" opacity="0.65" />
        <rect x="1225" y="72" width="4" height="4" fill="#38bdf8" opacity="0.9" />
        <rect x="1260" y="72" width="4" height="4" fill="#38bdf8" opacity="0.5" />

        {/* Building 9 (x:1295 y:65) */}
        <rect x="1310" y="75" width="4" height="4" fill="#38bdf8" opacity="0.8" />
        <rect x="1328" y="75" width="4" height="4" fill="#38bdf8" opacity="0.6" />
        <rect x="1346" y="75" width="4" height="4" fill="#38bdf8" opacity="0.75" />
        <rect x="1310" y="89" width="4" height="4" fill="#38bdf8" opacity="0.6" />
        <rect x="1346" y="89" width="4" height="4" fill="#38bdf8" opacity="0.85" />
      </svg>

      <style>{`
        .skyline-wrapper {
          width: 100%;
          line-height: 0;
          overflow: hidden;
          background: transparent;
        }

        .skyline-svg {
          width: 100%;
          height: 90px;
          display: block;
        }

        @media (max-width: 768px) {
          .skyline-svg {
            height: 60px;
          }
        }
      `}</style>
    </div>
  );
};
