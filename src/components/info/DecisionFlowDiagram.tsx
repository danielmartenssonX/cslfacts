/**
 * SVG-baserat beslutsflödesdiagram för CSL-klassningen.
 * Visar top-down flöde: funktionsidentifiering → konsekvensfrågor → CSL-nivå.
 */

const BOX_W = 280;
const BOX_H = 44;
const CSL_W = 90;
const CSL_H = 36;
const GAP_Y = 20;
const CENTER_X = 220;
const CSL_OFFSET_X = 190;

interface FlowNode {
  label: string;
  sublabel?: string;
  cslLabel?: string;
  cslColor?: string;
  cslBg?: string;
}

const NODES: FlowNode[] = [
  {
    label: 'Identifiera funktioner',
    sublabel: 'Q09–Q15',
  },
  {
    label: 'Kan bidra till radiologisk händelse?',
    sublabel: 'Q16',
    cslLabel: 'CSL 1',
    cslColor: '#991b1b',
    cslBg: '#fef2f2',
  },
  {
    label: 'Försämrar säkerhet, nödläge, skydd, process?',
    sublabel: 'Q17–Q20',
    cslLabel: 'CSL 2',
    cslColor: '#9a3412',
    cslBg: '#fff7ed',
  },
  {
    label: 'Stora drift-/underhållsproblem?',
    sublabel: 'Q21–Q22',
    cslLabel: 'CSL 3',
    cslColor: '#854d0e',
    cslBg: '#fefce8',
  },
  {
    label: 'Långsiktig negativ effekt?',
    sublabel: 'Q23',
    cslLabel: 'CSL 4',
    cslColor: '#1e40af',
    cslBg: '#eff6ff',
  },
  {
    label: 'Ingen relevant påverkan?',
    sublabel: 'Q24',
    cslLabel: 'CSL 5',
    cslColor: '#166534',
    cslBg: '#f0fdf4',
  },
];

// Beräkna y-positioner
function getNodeY(index: number): number {
  return 20 + index * (BOX_H + GAP_Y);
}

const LAST_NODE_Y = getNodeY(NODES.length - 1);
const END_NODE_Y = LAST_NODE_Y + BOX_H + GAP_Y;
const SVG_W = CENTER_X + CSL_OFFSET_X + CSL_W + 20;
const SVG_H = END_NODE_Y + 36 + 16;

function Arrow({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  const tip = 5;
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2 - tip} stroke="#94a3b8" strokeWidth={1.5} />
      <polygon
        points={`${x},${y2} ${x - tip},${y2 - tip * 1.4} ${x + tip},${y2 - tip * 1.4}`}
        fill="#94a3b8"
      />
    </g>
  );
}

function HArrow({ x1, y, x2 }: { x1: number; y: number; x2: number }) {
  const tip = 5;
  return (
    <g>
      <line x1={x1} y1={y} x2={x2 - tip} y2={y} stroke="#94a3b8" strokeWidth={1.5} />
      <polygon
        points={`${x2},${y} ${x2 - tip * 1.4},${y - tip} ${x2 - tip * 1.4},${y + tip}`}
        fill="#94a3b8"
      />
    </g>
  );
}

export default function DecisionFlowDiagram() {
  return (
    <div className="mx-auto max-w-lg rounded-lg border bg-white p-4">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        role="img"
        aria-label="Beslutsflödesdiagram för CSL-klassning"
      >
        {NODES.map((node, i) => {
          const y = getNodeY(i);
          const boxX = CENTER_X - BOX_W / 2;
          const isFirst = i === 0;

          return (
            <g key={i}>
              {/* Vertikal pil */}
              {i > 0 && <Arrow x={CENTER_X} y1={getNodeY(i - 1) + BOX_H} y2={y} />}

              {/* Nej-label */}
              {i > 1 && (
                <text
                  x={CENTER_X - 12}
                  y={y - GAP_Y / 2 + 3}
                  textAnchor="end"
                  fontSize={9}
                  fill="#64748b"
                >
                  Nej
                </text>
              )}

              {/* Frågebox */}
              <rect
                x={boxX}
                y={y}
                width={BOX_W}
                height={BOX_H}
                rx={10}
                fill={isFirst ? '#0f4c5c' : '#ffffff'}
                stroke={isFirst ? '#0f4c5c' : '#cbd5e1'}
                strokeWidth={isFirst ? 0 : 1.5}
              />
              <text
                x={CENTER_X}
                y={y + (node.sublabel ? 18 : BOX_H / 2 + 4)}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill={isFirst ? '#ffffff' : '#0f172a'}
              >
                {node.label}
              </text>
              {node.sublabel && (
                <text
                  x={CENTER_X}
                  y={y + 33}
                  textAnchor="middle"
                  fontSize={9}
                  fill={isFirst ? '#94d5e0' : '#94a3b8'}
                >
                  {node.sublabel}
                </text>
              )}

              {/* CSL-resultatbox */}
              {node.cslLabel && (
                <>
                  <HArrow
                    x1={CENTER_X + BOX_W / 2}
                    y={y + BOX_H / 2}
                    x2={CENTER_X + CSL_OFFSET_X}
                  />
                  <text
                    x={CENTER_X + BOX_W / 2 + 6}
                    y={y + BOX_H / 2 - 5}
                    fontSize={9}
                    fill="#64748b"
                  >
                    Ja
                  </text>
                  <rect
                    x={CENTER_X + CSL_OFFSET_X}
                    y={y + BOX_H / 2 - CSL_H / 2}
                    width={CSL_W}
                    height={CSL_H}
                    rx={18}
                    fill={node.cslBg}
                    stroke={node.cslColor}
                    strokeWidth={2}
                  />
                  <text
                    x={CENTER_X + CSL_OFFSET_X + CSL_W / 2}
                    y={y + BOX_H / 2 + 5}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight={700}
                    fill={node.cslColor}
                  >
                    {node.cslLabel}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Slutnod: Ej fastställd */}
        <Arrow x={CENTER_X} y1={LAST_NODE_Y + BOX_H} y2={END_NODE_Y} />
        <text
          x={CENTER_X - 12}
          y={END_NODE_Y - GAP_Y / 2 + 3}
          textAnchor="end"
          fontSize={9}
          fill="#64748b"
        >
          Nej
        </text>
        <rect
          x={CENTER_X - 70}
          y={END_NODE_Y}
          width={140}
          height={36}
          rx={18}
          fill="#f1f5f9"
          stroke="#94a3b8"
          strokeWidth={1.5}
          strokeDasharray="5 3"
        />
        <text
          x={CENTER_X}
          y={END_NODE_Y + 22}
          textAnchor="middle"
          fontSize={11}
          fontWeight={600}
          fill="#64748b"
        >
          Ej fastställd
        </text>
      </svg>
    </div>
  );
}
