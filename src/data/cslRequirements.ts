import type { CSL } from '../domain/types';

/**
 * IAEA NSS 17-T (Rev. 1) krav per CSL-nivå.
 * Källa: paragraf 8.16 (generiska), 8.17 (CSL 1), 8.18 (CSL 2),
 * 8.19 (CSL 3), 8.20 (CSL 4), 8.21 (CSL 5).
 */

export type RequirementLevel = 'Generic' | 'CSL1' | 'CSL2' | 'CSL3' | 'CSL4' | 'CSL5';

export interface CslRequirement {
  level: RequirementLevel;
  paragraph: string;
  subItem: string;
  textEn: string;
  textSv: string;
}

// ─── Alla 53 krav ───────────────────────────────────────────────

export const CSL_REQUIREMENTS: CslRequirement[] = [
  // ── Generic (8.16 a–s) — gäller alla nivåer ──────────────────
  {
    level: 'Generic',
    paragraph: '8.16(a)',
    subItem: 'a',
    textEn:
      'All technical, physical, personnel and organizational security measures for systems and networks are designed and implemented in a systematic manner and according to approved processes and procedures.',
    textSv:
      'Alla tekniska, fysiska, personella och organisatoriska säkerhetsåtgärder för system och nätverk utformas och implementeras på ett systematiskt sätt och i enlighet med godkända processer och rutiner.',
  },
  {
    level: 'Generic',
    paragraph: '8.16(b)',
    subItem: 'b',
    textEn: 'Policies and practices are defined for each computer security level.',
    textSv: 'Policyer och rutiner definieras för varje datorsäkerhetsnivå.',
  },
  {
    level: 'Generic',
    paragraph: '8.16(c)',
    subItem: 'c',
    textEn: 'Users are obliged to comply with security policies and security operating procedures.',
    textSv:
      'Användare är skyldiga att följa säkerhetspolicyer och säkerhetsrelaterade driftprocedurer.',
  },
  {
    level: 'Generic',
    paragraph: '8.16(d)',
    subItem: 'd',
    textEn:
      'Staff permitted access to the system are suitably qualified and experienced and determined to be trustworthy where necessary.',
    textSv:
      'Personal med tillträde till systemet är lämpligt kvalificerad och erfaren och bedöms som tillförlitlig där så krävs.',
  },
  {
    level: 'Generic',
    paragraph: '8.16(e)',
    subItem: 'e',
    textEn:
      'Users and administrators have access only to those functions on those systems that they need for performing their jobs. Accumulation of access rights by an individual person is avoided.',
    textSv:
      'Användare och administratörer har endast åtkomst till de funktioner i de system som de behöver för att utföra sina arbetsuppgifter. Ansamling av åtkomsträttigheter hos en enskild person undviks.',
  },
  {
    level: 'Generic',
    paragraph: '8.16(f)',
    subItem: 'f',
    textEn:
      "The system's functionality and interfaces are limited to the extent possible, with the objective of reducing overall system vulnerability.",
    textSv:
      'Systemets funktionalitet och gränssnitt begränsas i möjligaste mån i syfte att minska den övergripande sårbarheten i systemet.',
  },
  {
    level: 'Generic',
    paragraph: '8.16(g)',
    subItem: 'g',
    textEn: 'Appropriate access control and user authentication are in place.',
    textSv: 'Lämplig åtkomstkontroll och användarautentisering är på plats.',
  },
  {
    level: 'Generic',
    paragraph: '8.16(h)',
    subItem: 'h',
    textEn: 'Protection against infection and spreading of malware is in place.',
    textSv: 'Skydd mot infektion och spridning av skadlig programvara är på plats.',
  },
  {
    level: 'Generic',
    paragraph: '8.16(i)',
    subItem: 'i',
    textEn:
      'Security logging and monitoring, including procedures for adequate response, are in place.',
    textSv:
      'Säkerhetsloggning och -övervakning, inklusive rutiner för adekvat respons, är på plats.',
  },
  {
    level: 'Generic',
    paragraph: '8.16(j)',
    subItem: 'j',
    textEn:
      'Application and system vulnerabilities are monitored, and appropriate measures are taken.',
    textSv: 'Sårbarheter i applikationer och system övervakas och lämpliga åtgärder vidtas.',
  },
  {
    level: 'Generic',
    paragraph: '8.16(k)',
    subItem: 'k',
    textEn: 'The adequacy and effectiveness of measures is reviewed periodically.',
    textSv: 'Åtgärdernas ändamålsenlighet och effektivitet granskas regelbundet.',
  },
  {
    level: 'Generic',
    paragraph: '8.16(l)',
    subItem: 'l',
    textEn: 'System vulnerability assessments are undertaken periodically.',
    textSv: 'Sårbarhetsbedömningar av system genomförs regelbundet.',
  },
  {
    level: 'Generic',
    paragraph: '8.16(m)',
    subItem: 'm',
    textEn:
      'Removable media are controlled in accordance with security operating procedures. Privately owned devices are not allowed to be connected to systems and networks.',
    textSv:
      'Flyttbara lagringsmedier kontrolleras i enlighet med säkerhetsrelaterade driftprocedurer. Privatägda enheter får inte anslutas till system och nätverk.',
  },
  {
    level: 'Generic',
    paragraph: '8.16(n)',
    subItem: 'n',
    textEn:
      'Digital assets and associated computer security measures are strictly maintained using the applicable change management procedures.',
    textSv:
      'Digitala tillgångar och tillhörande datorsäkerhetsåtgärder underhålls strikt med tillämpliga ändringshanteringsprocedurer.',
  },
  {
    level: 'Generic',
    paragraph: '8.16(o)',
    subItem: 'o',
    textEn: 'Appropriate backup and recovery procedures are in place.',
    textSv: 'Lämpliga rutiner för säkerhetskopiering och återställning är på plats.',
  },
  {
    level: 'Generic',
    paragraph: '8.16(p)',
    subItem: 'p',
    textEn: 'A service device is assigned to exactly one computer security level.',
    textSv: 'En serviceenhet tilldelas exakt en datorsäkerhetsnivå.',
  },
  {
    level: 'Generic',
    paragraph: '8.16(q)',
    subItem: 'q',
    textEn:
      'Physical access to components and systems, including service devices, is restricted according to their functions.',
    textSv:
      'Fysisk åtkomst till komponenter och system, inklusive serviceenheter, begränsas utifrån deras funktioner.',
  },
  {
    level: 'Generic',
    paragraph: '8.16(r)',
    subItem: 'r',
    textEn:
      'Measures to prevent the unauthorized introduction of systems into computer security zones are in place.',
    textSv:
      'Åtgärder för att förhindra obehörig introduktion av system i datorsäkerhetszoner är på plats.',
  },
  {
    level: 'Generic',
    paragraph: '8.16(s)',
    subItem: 's',
    textEn: 'Only approved and qualified users are allowed to make modifications to the systems.',
    textSv: 'Endast godkända och kvalificerade användare tillåts göra ändringar i systemen.',
  },

  // ── CSL 1 (8.17 a–i) ─────────────────────────────────────────
  {
    level: 'CSL1',
    paragraph: '8.17(a)',
    subItem: 'a',
    textEn:
      'Systems are designed and implemented to be verifiable and testable against a potential attack by an adversary.',
    textSv:
      'System utformas och implementeras så att de kan verifieras och testas mot ett potentiellt angrepp av en motståndare.',
  },
  {
    level: 'CSL1',
    paragraph: '8.17(b)',
    subItem: 'b',
    textEn:
      'No networked data flow of any kind from systems assigned less stringent computer security levels can enter level 1 systems when integrity and availability are priorities. Only outward communication is possible. Exceptions are strongly discouraged and may only be considered on a strict case by case basis and if supported by a complete justification and security risk analysis.',
    textSv:
      'Ingen nätverksbaserad dataöverföring av något slag från system med lägre datorsäkerhetsnivå får ta sig in i nivå 1-system när integritet och tillgänglighet är prioriterade egenskaper. Endast utgående kommunikation är möjlig. Undantag avråds starkt och får endast övervägas strikt från fall till fall och om det stöds av en fullständig motivering och en säkerhetsriskanalys.',
  },
  {
    level: 'CSL1',
    paragraph: '8.17(c)',
    subItem: 'c',
    textEn: 'No remote maintenance access is allowed.',
    textSv: 'Ingen fjärråtkomst för underhåll är tillåten.',
  },
  {
    level: 'CSL1',
    paragraph: '8.17(d)',
    subItem: 'd',
    textEn:
      'Physical and logical access to systems is strictly controlled, monitored and recorded.',
    textSv:
      'Fysisk och logisk åtkomst till system är strikt kontrollerad, övervakad och registrerad.',
  },
  {
    level: 'CSL1',
    paragraph: '8.17(e)',
    subItem: 'e',
    textEn: 'The number of staff given access to the systems is limited to an absolute minimum.',
    textSv: 'Antalet anställda som ges åtkomst till systemen begränsas till ett absolut minimum.',
  },
  {
    level: 'CSL1',
    paragraph: '8.17(f)',
    subItem: 'f',
    textEn: 'The two person rule is applied to prevent unauthorized actions by an insider threat.',
    textSv: 'Tvåpersonsregeln tillämpas för att förhindra obehöriga åtgärder från ett insiderhot.',
  },
  {
    level: 'CSL1',
    paragraph: '8.17(g)',
    subItem: 'g',
    textEn: 'All activities and potential security events are logged and monitored.',
    textSv: 'Alla aktiviteter och potentiella säkerhetshändelser loggas och övervakas.',
  },
  {
    level: 'CSL1',
    paragraph: '8.17(h)',
    subItem: 'h',
    textEn:
      'Connection of external storage devices is approved and verified on a case by case basis.',
    textSv: 'Anslutning av externa lagringsenheter godkänns och verifieras från fall till fall.',
  },
  {
    level: 'CSL1',
    paragraph: '8.17(i)',
    subItem: 'i',
    textEn:
      'Strict organizational and administrative procedures apply to any modifications, including hardware maintenance, software updates and software modifications.',
    textSv:
      'Strikta organisatoriska och administrativa rutiner gäller för alla ändringar, inklusive hårdvaruunderhåll, programuppdateringar och programvarumodifieringar.',
  },

  // ── CSL 2 (8.18 a–f) ─────────────────────────────────────────
  {
    level: 'CSL2',
    paragraph: '8.18(a)',
    subItem: 'a',
    textEn:
      'Only an outward, unidirectional networked flow of data is allowed from level 2 to level 3 systems. Only necessary acknowledgement messages or controlled signal messages can be accepted in the opposite (inward) direction (e.g. for TCP/IP (Transmission Control Protocol/Internet Protocol)).',
    textSv:
      'Endast ett utgående, enkelriktat nätverksflöde av data är tillåtet från nivå 2 till nivå 3-system. Endast nödvändiga bekräftelsemeddelanden eller kontrollerade signalmeddelanden kan accepteras i motsatt (ingående) riktning (t.ex. för TCP/IP (Transmission Control Protocol/Internet Protocol)).',
  },
  {
    level: 'CSL2',
    paragraph: '8.18(b)',
    subItem: 'b',
    textEn: 'Remote maintenance is not allowed.',
    textSv: 'Fjärrunderhåll är inte tillåtet.',
  },
  {
    level: 'CSL2',
    paragraph: '8.18(c)',
    subItem: 'c',
    textEn:
      'The number of staff given access to the systems is kept to a minimum, with a clear distinction between users and administrative staff.',
    textSv:
      'Antalet anställda som ges åtkomst till systemen hålls till ett minimum, med en tydlig åtskillnad mellan användare och administrativ personal.',
  },
  {
    level: 'CSL2',
    paragraph: '8.18(d)',
    subItem: 'd',
    textEn: 'Physical and logical access to systems is strictly controlled and documented.',
    textSv: 'Fysisk och logisk åtkomst till system är strikt kontrollerad och dokumenterad.',
  },
  {
    level: 'CSL2',
    paragraph: '8.18(e)',
    subItem: 'e',
    textEn:
      'Administrative access from other computer security levels is avoided. If this is not possible, such access is strictly controlled (e.g. by adopting the two person rule and two factor authentication).',
    textSv:
      'Administrativ åtkomst från andra datorsäkerhetsnivåer undviks. Om detta inte är möjligt är sådan åtkomst strikt kontrollerad (t.ex. genom tvåpersonsregeln och tvåfaktorsautentisering).',
  },
  {
    level: 'CSL2',
    paragraph: '8.18(f)',
    subItem: 'f',
    textEn:
      'All reasonable measures are taken to ensure the integrity and availability of the systems.',
    textSv:
      'Alla rimliga åtgärder vidtas för att säkerställa systemens integritet och tillgänglighet.',
  },

  // ── CSL 3 (8.19 a–h) ─────────────────────────────────────────
  {
    level: 'CSL3',
    paragraph: '8.19(a)',
    subItem: 'a',
    textEn: 'Access to the Internet from level 3 systems is not allowed.',
    textSv: 'Åtkomst till internet från nivå 3-system är inte tillåten.',
  },
  {
    level: 'CSL3',
    paragraph: '8.19(b)',
    subItem: 'b',
    textEn: 'Logging and audit trails for key resources are monitored.',
    textSv: 'Loggning och revisionsspår för nyckelresurser övervakas.',
  },
  {
    level: 'CSL3',
    paragraph: '8.19(c)',
    subItem: 'c',
    textEn:
      'Security gateways are applied to protect this level from uncontrolled data connections from level 4 systems and to allow only specific and limited activity.',
    textSv:
      'Säkerhetsgateways tillämpas för att skydda denna nivå från okontrollerade dataanslutningar från nivå 4-system och för att tillåta endast specifik och begränsad aktivitet.',
  },
  {
    level: 'CSL3',
    paragraph: '8.19(d)',
    subItem: 'd',
    textEn: 'Physical connections to systems are controlled.',
    textSv: 'Fysiska anslutningar till system är kontrollerade.',
  },
  {
    level: 'CSL3',
    paragraph: '8.19(e)',
    subItem: 'e',
    textEn: 'Physical and logical access to systems is controlled and documented.',
    textSv: 'Fysisk och logisk åtkomst till system är kontrollerad och dokumenterad.',
  },
  {
    level: 'CSL3',
    paragraph: '8.19(f)',
    subItem: 'f',
    textEn:
      'Remote maintenance access is allowed on a case by case basis provided that it is robustly controlled; the remote computer and user follow a defined security policy, specified in the contract.',
    textSv:
      'Fjärråtkomst för underhåll är tillåten från fall till fall förutsatt att den är robust kontrollerad; fjärrdatorn och användaren följer en definierad säkerhetspolicy, specificerad i avtalet.',
  },
  {
    level: 'CSL3',
    paragraph: '8.19(g)',
    subItem: 'g',
    textEn:
      "System functions available to users are controlled by access control mechanisms and based on the 'need to know' rule. Any exception to this rule is carefully considered and protection is ensured by other means (e.g. physical access).",
    textSv:
      "Systemfunktioner tillgängliga för användare kontrolleras av åtkomstkontrollmekanismer och baseras på principen om 'behov av att känna till'. Varje undantag från denna regel övervägs noggrant och skydd säkerställs på annat sätt (t.ex. fysisk åtkomst).",
  },
  {
    level: 'CSL3',
    paragraph: '8.19(h)',
    subItem: 'h',
    textEn:
      'Administrative access from other computer security levels is avoided wherever possible. If this is not possible, such access is strictly controlled (e.g. through two factor authentication).',
    textSv:
      'Administrativ åtkomst från andra datorsäkerhetsnivåer undviks i möjligaste mån. Om detta inte är möjligt är sådan åtkomst strikt kontrollerad (t.ex. genom tvåfaktorsautentisering).',
  },

  // ── CSL 4 (8.20 a–f) ─────────────────────────────────────────
  {
    level: 'CSL4',
    paragraph: '8.20(a)',
    subItem: 'a',
    textEn: 'Access to the Internet from level 4 systems is not allowed.',
    textSv: 'Åtkomst till internet från nivå 4-system är inte tillåten.',
  },
  {
    level: 'CSL4',
    paragraph: '8.20(b)',
    subItem: 'b',
    textEn:
      'Security gateways are implemented to protect this level from unauthorized data communications through trusted and approved external company or facility networks and to allow specific activities that are authorized.',
    textSv:
      'Säkerhetsgateways implementeras för att skydda denna nivå från obehörig datakommunikation via betrodda och godkända externa företags- eller anläggningsnätverk och för att tillåta specifika auktoriserade aktiviteter.',
  },
  {
    level: 'CSL4',
    paragraph: '8.20(c)',
    subItem: 'c',
    textEn: 'Physical connections to systems are controlled.',
    textSv: 'Fysiska anslutningar till system är kontrollerade.',
  },
  {
    level: 'CSL4',
    paragraph: '8.20(d)',
    subItem: 'd',
    textEn:
      'Remote maintenance access is allowed but controlled; the remote computer and user follow a defined security policy, specified in the contract.',
    textSv:
      'Fjärråtkomst för underhåll är tillåten men kontrollerad; fjärrdatorn och användaren följer en definierad säkerhetspolicy, specificerad i avtalet.',
  },
  {
    level: 'CSL4',
    paragraph: '8.20(e)',
    subItem: 'e',
    textEn:
      'System functions available to users are controlled by access control mechanisms. Any exception to this rule is carefully considered and protection is ensured by other means.',
    textSv:
      'Systemfunktioner tillgängliga för användare kontrolleras av åtkomstkontrollmekanismer. Varje undantag från denna regel övervägs noggrant och skydd säkerställs på annat sätt.',
  },
  {
    level: 'CSL4',
    paragraph: '8.20(f)',
    subItem: 'f',
    textEn:
      'Remote external access is allowed to selected services and for approved users, provided that appropriate access control mechanisms are in place.',
    textSv:
      'Fjärråtkomst utifrån är tillåten till utvalda tjänster och för godkända användare, förutsatt att lämpliga åtkomstkontrollmekanismer finns på plats.',
  },

  // ── CSL 5 (8.21 a–e) ─────────────────────────────────────────
  {
    level: 'CSL5',
    paragraph: '8.21(a)',
    subItem: 'a',
    textEn:
      'The computer security level does not fall below a baseline protection level, defined according to the latest state of the art.',
    textSv:
      'Datorsäkerhetsnivån understiger inte en grundläggande skyddsnivå, definierad i enlighet med den senaste tekniken (state of the art).',
  },
  {
    level: 'CSL5',
    paragraph: '8.21(b)',
    subItem: 'b',
    textEn: 'Only approved and qualified users are allowed to make modifications to the systems.',
    textSv: 'Endast godkända och kvalificerade användare tillåts göra ändringar i systemen.',
  },
  {
    level: 'CSL5',
    paragraph: '8.21(c)',
    subItem: 'c',
    textEn:
      'Access to the Internet from level 5 systems is allowed, provided that adequate preventive and protective measures are applied.',
    textSv:
      'Åtkomst till internet från nivå 5-system är tillåten, förutsatt att adekvata förebyggande och skyddande åtgärder tillämpas.',
  },
  {
    level: 'CSL5',
    paragraph: '8.21(d)',
    subItem: 'd',
    textEn:
      'Remote external access is allowed for authorized users, provided that appropriate measures are in place.',
    textSv:
      'Fjärråtkomst utifrån är tillåten för auktoriserade användare, förutsatt att lämpliga åtgärder finns på plats.',
  },
  {
    level: 'CSL5',
    paragraph: '8.21(e)',
    subItem: 'e',
    textEn:
      'Physical connection of third party devices to systems and networks is technically controlled. Those interfaces to higher level systems are characterized and evaluated independently to ensure compliance with the computer security architecture.',
    textSv:
      'Fysisk anslutning av tredjepartsenheter till system och nätverk är tekniskt kontrollerad. De gränssnitt som ansluter till system på högre nivå karaktäriseras och utvärderas oberoende för att säkerställa efterlevnad av datorsäkerhetsarkitekturen.',
  },
];

// ─── Nivåetiketter per kravgrupp ────────────────────────────────

const LEVEL_LABELS: Record<RequirementLevel, string> = {
  Generic: 'Generiska krav (8.16)',
  CSL1: 'CSL 1-krav (8.17)',
  CSL2: 'CSL 2-krav (8.18)',
  CSL3: 'CSL 3-krav (8.19)',
  CSL4: 'CSL 4-krav (8.20)',
  CSL5: 'CSL 5-krav (8.21)',
};

export function getRequirementLevelLabel(level: RequirementLevel): string {
  return LEVEL_LABELS[level];
}

// ─── Hämta tillämpliga krav per CSL-nivå (ej kumulativt) ────────

const CSL_TO_REQUIREMENT_LEVEL: Record<Exclude<CSL, 'REVIEW_REQUIRED'>, RequirementLevel> = {
  CSL1: 'CSL1',
  CSL2: 'CSL2',
  CSL3: 'CSL3',
  CSL4: 'CSL4',
  CSL5: 'CSL5',
};

/**
 * Returnera tillämpliga krav för en CSL-nivå.
 * Inkluderar alltid generiska krav (8.16) + nivåspecifika krav.
 * Kraven är INTE kumulativa — varje nivå har egna krav.
 */
export function getApplicableRequirements(cslLevel: CSL): {
  generic: CslRequirement[];
  levelSpecific: CslRequirement[];
  levelLabel: string;
} {
  const generic = CSL_REQUIREMENTS.filter((r) => r.level === 'Generic');

  if (cslLevel === 'REVIEW_REQUIRED') {
    return {
      generic,
      levelSpecific: [],
      levelLabel: 'Nivåspecifika krav bestäms efter specialistgranskning',
    };
  }

  const reqLevel = CSL_TO_REQUIREMENT_LEVEL[cslLevel];
  const levelSpecific = CSL_REQUIREMENTS.filter((r) => r.level === reqLevel);

  return {
    generic,
    levelSpecific,
    levelLabel: LEVEL_LABELS[reqLevel],
  };
}
