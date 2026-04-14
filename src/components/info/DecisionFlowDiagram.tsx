/**
 * SVG-baserat beslutsflödesdiagram för CSL-klassningen.
 * Visar top-down flöde: funktionsidentifiering → konsekvensfrågor → CSL-nivå.
 */

const BOX_W = 320;
const BOX_H = 56;
const CSL_W = 120;
const CSL_H = 44;
const GAP_Y = 28;
const ARROW_LEN = GAP_Y;
const CENTER_X = 400;
const CSL_OFFSET_X = 240;

interface FlowNode {
  label: string;
  sublabel?: string;
  y: number;
  cslLabel?: string;
  cslColor?: string;
  cslBg?: string;
}

const NODES: FlowNode[] = [
  {
    label: 'Identifiera funktioner',
    sublabel: 'Q09–Q15',
    y: 30,
  },
  {
    label: 'Kan bidra till radiologisk händelse?',
    sublabel: 'Q16',
    y: 30 + BOX_H + ARROW_LEN,
    cslLabel: 'CSL 1',
    cslColor: '#991b1b',
    cslBg: '#fef2f2',
  },
  {
    label: 'Försämrar säkerhet, nödläge, skydd eller huvudprocess?',
    sublabel: 'Q17–Q20',
    y: 30 + (BOX_H + ARROW_LEN) * 2,
    cslLabel: 'CSL 2',
    cslColor: '#9a3412',
    cslBg: '#fff7ed',
  },
  {
    label: 'Stora drift-/underhållsproblem eller prestanda?',
    sublabel: 'Q21–Q22',
    y: 30 + (BOX_H + ARROW_LEN) * 3,
    cslLabel: 'CSL 3',
    cslColor: '#854d0e',
    cslBg: '#fefce8',
  },
  {
    label: 'Långsiktig negativ effekt?',
    sublabel: 'Q23',
    y: 30 + (BOX_H + ARROW_LEN) * 4,
    cslLabel: 'CSL 4',
    cslColor: '#1e40af',
    cslBg: '#eff6ff',
  },
  {
    label: 'Ingen relevant påverkan?',
    sublabel: 'Q24',
    y: 30 + (BOX_H + ARROW_LEN) * 5,
    cslLabel: 'CSL 5',
    cslColor: '#166534',
    cslBg: '#f0fdf4',
  },
];

const TOTAL_H = 30 + (BOX_H + ARROW_LEN) * 6 + 20;

function Arrow({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  const tipSize = 6;
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2 - tipSize} stroke="#94a3b8" strokeWidth={2} />
      <polygon
        points={`${x},${y2} ${x - tipSize},${y2 - tipSize * 1.5} ${x + tipSize},${y2 - tipSize * 1.5}`}
        fill="#94a3b8"
      />
    </g>
  );
}

function HorizontalArrow({ x1, y, x2 }: { x1: number; y: number; x2: number }) {
  const tipSize = 6;
  return (
    <g>
      <line x1={x1} y1={y} x2={x2 - tipSize} y2={y} stroke="#94a3b8" strokeWidth={2} />
      <polygon
        points={`${x2},${y} ${x2 - tipSize * 1.5},${y - tipSize} ${x2 - tipSize * 1.5},${y + tipSize}`}
        fill="#94a3b8"
      />
    </g>
  );
}

export default function DecisionFlowDiagram() {
  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 800 ${TOTAL_H}`}
        className="mx-auto w-full max-w-3xl"
        role="img"
        aria-label="Beslutsflödesdiagram för CSL-klassning"
      >
        {/* Nodboxar och pilar */}
        {NODES.map((node, i) => {
          const boxX = CENTER_X - BOX_W / 2;
          const isFirst = i === 0;

          return (
            <g key={i}>
              {/* Vertikal pil från föregående nod */}
              {i > 0 && <Arrow x={CENTER_X} y1={NODES[i - 1].y + BOX_H} y2={node.y} />}

              {/* "Nej"-label på vertikala pilar (inte på första) */}
              {i > 1 && (
                <text
                  x={CENTER_X - 16}
                  y={node.y - ARROW_LEN / 2 + 4}
                  textAnchor="end"
                  className="text-[11px]"
                  fill="#64748b"
                >
                  Nej
                </text>
              )}

              {/* Frågebox */}
              <rect
                x={boxX}
                y={node.y}
                width={BOX_W}
                height={BOX_H}
                rx={12}
                fill={isFirst ? '#0f4c5c' : '#ffffff'}
                stroke={isFirst ? '#0f4c5c' : '#cbd5e1'}
                strokeWidth={isFirst ? 0 : 1.5}
              />
              <text
                x={CENTER_X}
                y={node.y + (node.sublabel ? 22 : BOX_H / 2 + 5)}
                textAnchor="middle"
                className="text-[13px] font-medium"
                fill={isFirst ? '#ffffff' : '#0f172a'}
              >
                {node.label}
              </text>
              {node.sublabel && (
                <text
                  x={CENTER_X}
                  y={node.y + 40}
                  textAnchor="middle"
                  className="text-[11px]"
                  fill={isFirst ? '#94d5e0' : '#94a3b8'}
                >
                  {node.sublabel}
                </text>
              )}

              {/* CSL-resultatbox med horisontell pil */}
              {node.cslLabel && (
                <>
                  <HorizontalArrow
                    x1={CENTER_X + BOX_W / 2}
                    y={node.y + BOX_H / 2}
                    x2={CENTER_X + CSL_OFFSET_X}
                  />
                  <text
                    x={CENTER_X + BOX_W / 2 + 8}
                    y={node.y + BOX_H / 2 - 6}
                    className="text-[11px]"
                    fill="#64748b"
                  >
                    Ja
                  </text>
                  <rect
                    x={CENTER_X + CSL_OFFSET_X}
                    y={node.y + BOX_H / 2 - CSL_H / 2}
                    width={CSL_W}
                    height={CSL_H}
                    rx={22}
                    fill={node.cslBg}
                    stroke={node.cslColor}
                    strokeWidth={2}
                  />
                  <text
                    x={CENTER_X + CSL_OFFSET_X + CSL_W / 2}
                    y={node.y + BOX_H / 2 + 5}
                    textAnchor="middle"
                    className="text-[14px] font-bold"
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
        {(() => {
          const lastNode = NODES[NODES.length - 1];
          const endY = lastNode.y + BOX_H + ARROW_LEN;
          return (
            <g>
              <Arrow x={CENTER_X} y1={lastNode.y + BOX_H} y2={endY} />
              <text
                x={CENTER_X - 16}
                y={endY - ARROW_LEN / 2 + 4}
                textAnchor="end"
                className="text-[11px]"
                fill="#64748b"
              >
                Nej
              </text>
              <rect
                x={CENTER_X - 80}
                y={endY}
                width={160}
                height={40}
                rx={20}
                fill="#f1f5f9"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="6 3"
              />
              <text
                x={CENTER_X}
                y={endY + 25}
                textAnchor="middle"
                className="text-[13px] font-medium"
                fill="#64748b"
              >
                Ej fastställd
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
