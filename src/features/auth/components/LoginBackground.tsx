export function LoginBackground() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none -z-10"
      viewBox="0 0 390 844"
      preserveAspectRatio="xMidYMin slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="hex-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/*
        Hexágono sup-izq: centro (-50, -60), radio 230.
        Orientación pointy-top (igual que el logo SGF).
        Solo vemos la esquina inferior-derecha del hex.
      */}
      {/* Top-left large hex */}
      <polygon
        points="-50,-290 149,-175 149,55 -50,170 -249,55 -249,-175"
        fill="rgba(120,80,200,0.08)"
        stroke="rgba(200,160,255,0.55)"
        strokeWidth="2"
        filter="url(#hex-glow)"
      />
      {/* Top-left inner ring */}
      <polygon
        points="-50,-250 115,-152 115,32 -50,134 -215,32 -215,-152"
        fill="none"
        stroke="rgba(200,160,255,0.2)"
        strokeWidth="1"
      />

      {/* Top-right hex */}
      <polygon
        points="440,-220 613,-120 613,80 440,180 267,80 267,-120"
        fill="rgba(120,80,200,0.06)"
        stroke="rgba(200,160,255,0.45)"
        strokeWidth="2"
        filter="url(#hex-glow)"
      />
      {/* Top-right inner ring */}
      <polygon
        points="440,-185 573,-107 573,65 440,153 307,65 307,-107"
        fill="none"
        stroke="rgba(200,160,255,0.18)"
        strokeWidth="1"
      />
    </svg>
  )
}
