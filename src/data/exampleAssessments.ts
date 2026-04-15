import type { AnswerValue, ComplianceStatus, SystemAssessment } from '../domain/types';

/**
 * Exempelklassificering — metadata som inte lagras i SystemAssessment
 * men behövs för presentation och validering.
 */
export interface ExampleMeta {
  id: string;
  fictionalName: string;
  displayNameSv: string;
  descriptionSv: string;
  sourceRef: string;
  pedagogicalExample: true;
  adaptedToCurrentAppLogic: true;
  mappingFit: 'hög' | 'medel-hög' | 'medel-låg' | 'låg';
  mappingNote?: string;
  targetCSL: string;
  expectedAppResult: string;
}

interface ComplianceEntry {
  status: ComplianceStatus;
  notes: string;
}

interface RawExample extends ExampleMeta {
  answers: Record<string, AnswerValue>;
  compliance?: Record<string, ComplianceEntry>;
}

// ─── Rådata: 7 IAEA Annex III-baserade exempelklassificeringar ──

const RAW_EXAMPLES: RawExample[] = [
  {
    id: 'EX_CSL1_RSK1',
    fictionalName: 'Reaktorskydd RSK-1',
    displayNameSv: 'I&C-reaktorskyddssystem',
    descriptionSv:
      'Exempelobjekt baserat på IAEA Annex III. Representerar ett digitalt reaktorskyddssystem.',
    sourceRef: 'IAEA NSS 17-T Rev.1 Annex III Table III-1',
    pedagogicalExample: true,
    adaptedToCurrentAppLogic: true,
    mappingFit: 'hög',
    targetCSL: 'CSL1',
    expectedAppResult: 'CSL1_FINAL',
    answers: {
      Q01: 'YES',
      Q02: 'YES',
      Q03: 'YES',
      Q04: 'YES',
      Q05: 'NO',
      Q06: 'NO',
      Q07: 'YES',
      Q08: 'YES',
      Q09: 'YES',
      Q10: 'NO',
      Q11: 'NO',
      Q12: 'NO',
      Q13: 'NO',
      Q14: 'NO',
      Q15: 'NO',
      Q09b: 'NO',
      Q16: 'YES',
      Q16b: 'NO',
      Q17: 'NO',
      Q18: 'NO',
      Q18b: 'NO',
      Q19: 'NO',
      Q20: 'NO',
      Q21: 'NO',
      Q21b: 'NO',
      Q22: 'NO',
      Q23: 'NO',
      Q23b: 'NO',
      Q24: 'NO',
      Q24b: 'NO',
      Q25: 'NO',
      Q26: 'YES',
      Q27: 'YES',
      Q28: 'NO',
      Q29: 'NO',
      Q30: 'YES',
      Q31: 'NO',
      Q32: 'NO',
    },
    compliance: {
      // Generic 8.16
      '8.16(a)': {
        status: 'COMPLIANT',
        notes:
          'Systemsäkerhetsplan SSP-RSK1-2025 godkänd 2025-03-15. Installationsprocedur IOP-RSK1-001 fastställd.',
      },
      '8.16(b)': {
        status: 'COMPLIANT',
        notes: 'CSL 1-policy DOC-POL-CSL1-v3.2 fastställd av säkerhetskommittén 2024-11-01.',
      },
      '8.16(c)': {
        status: 'COMPLIANT',
        notes:
          'Samtliga operatörer har signerat användaravtal UA-RSK1-2025. Årlig utbildning genomförd 2025-02.',
      },
      '8.16(d)': {
        status: 'COMPLIANT',
        notes:
          'Säkerhetsprövning genomförd för alla 4 behöriga (SÄK-RSK1-001 till 004). Kompetensintyg I&C-cert krävs.',
      },
      '8.16(e)': {
        status: 'COMPLIANT',
        notes:
          'Rollbaserad åtkomstkontroll implementerad. Admin/operator/service-roller definierade i ACL-RSK1-v2.',
      },
      '8.16(f)': {
        status: 'COMPLIANT',
        notes:
          'Alla oanvända portar och tjänster avaktiverade per härdningschecklista HCL-RSK1-2024.',
      },
      '8.16(g)': {
        status: 'COMPLIANT',
        notes:
          'Tvåfaktorsautentisering med hårdvarutoken (YubiKey). Centralt LDAP ej anslutet — lokal kontodatabas.',
      },
      '8.16(h)': {
        status: 'COMPLIANT',
        notes:
          'Dedicerad antiviruslösning med manuella signaturuppdateringar via kontrollerad USB. Senaste uppdatering 2025-04-01.',
      },
      '8.16(i)': {
        status: 'COMPLIANT',
        notes:
          'Syslog till dedikerad SIEM-server i CSL 2-zon. Larmregler konfigurerade per SOP-MON-RSK1.',
      },
      '8.16(j)': {
        status: 'COMPLIANT',
        notes:
          'Kvartalsvis sårbarhetsskanning med rapportering till CISO. Senaste rapport VR-RSK1-2025Q1.',
      },
      '8.16(k)': {
        status: 'COMPLIANT',
        notes: 'Årlig säkerhetsrevision per RV-RSK1-2024. Nästa planerad 2025-09.',
      },
      '8.16(l)': {
        status: 'COMPLIANT',
        notes: 'Sårbarhetsbedömning genomförd 2024-12 per VA-RSK1-2024. Inga kritiska fynd.',
      },
      '8.16(m)': {
        status: 'COMPLIANT',
        notes:
          'USB-portar fysiskt blockerade utom serviceutag S1/S2. Alla media skannas i sluss enligt SOP-MEDIA-001.',
      },
      '8.16(n)': {
        status: 'COMPLIANT',
        notes: 'Ändringshantering enligt CM-RSK1-v4. Alla ändringar kräver CAB-godkännande.',
      },
      '8.16(o)': {
        status: 'COMPLIANT',
        notes:
          'Daglig backup till isolerad server. Årlig återställningstest genomförd 2025-01. Dokumenterat i BKP-RSK1-2025.',
      },
      '8.16(p)': {
        status: 'COMPLIANT',
        notes: 'Serviceenhet SVC-RSK1-01 tilldelad exklusivt CSL 1. Märkt och inventerad.',
      },
      '8.16(q)': {
        status: 'COMPLIANT',
        notes:
          'Systemen placerade i skyddat utrymme SR-12 med kortläsare och logg. Tillträde begränsat till 4 namngivna.',
      },
      '8.16(r)': {
        status: 'COMPLIANT',
        notes:
          'Nätverksporten övervakad med 802.1X portautentisering. Obehöriga enheter blockeras automatiskt.',
      },
      '8.16(s)': {
        status: 'COMPLIANT',
        notes: 'Alla ändringar kräver dubbelgodkännande (tvåpersonsregel). Loggat i CM-logg.',
      },
      // CSL 1 specifika 8.17
      '8.17(a)': {
        status: 'COMPLIANT',
        notes:
          'Penetrationstest genomfört av extern part (SecTest AB, rapport PT-RSK1-2024-12). Inga kritiska fynd.',
      },
      '8.17(b)': {
        status: 'COMPLIANT',
        notes:
          'Unidirektionell gateway (datadiod DD-RSK1-01) installerad. Ingen inkommande trafik möjlig. Verifierat i FAT/SAT.',
      },
      '8.17(c)': {
        status: 'COMPLIANT',
        notes:
          'Fjärråtkomst fysiskt omöjliggjord — ingen nätverksanslutning utanför skyddat utrymme.',
      },
      '8.17(d)': {
        status: 'COMPLIANT',
        notes:
          'Åtkomstlogg registrerar alla inloggningar, kommandon och fysiska tillträden. Granskas veckovis per SOP-LOG-RSK1.',
      },
      '8.17(e)': {
        status: 'COMPLIANT',
        notes: '4 behöriga operatörer, 2 servicetekniker. Namnlista fastställd av driftchef.',
      },
      '8.17(f)': {
        status: 'COMPLIANT',
        notes:
          'Tvåpersonsregel tillämpas vid alla åtgärder. Implementerad via dubbelsignering i operatörsgränssnitt.',
      },
      '8.17(g)': {
        status: 'COMPLIANT',
        notes: 'Alla händelser loggas till SIEM. Realtidsövervakning dygnet runt via SOC.',
      },
      '8.17(h)': {
        status: 'COMPLIANT',
        notes:
          'Varje USB-anslutning kräver godkännande av skiftsansvarig + skanning i slussmaskin. Loggat i SOP-USB-RSK1.',
      },
      '8.17(i)': {
        status: 'COMPLIANT',
        notes:
          'Alla ändringar följer procedur CM-RSK1-v4 med formell godkännandekedja: ansvarig ingenjör → CAB → verifiering → driftsättning.',
      },
    },
  },
  {
    id: 'EX_CSL2_RBG2',
    fictionalName: 'Reaktivitetsbegränsare RBG-2',
    displayNameSv: 'I&C-reaktorbegränsningssystem',
    descriptionSv:
      'Exempelobjekt baserat på IAEA Annex III. Representerar ett digitalt reaktorbegränsningssystem.',
    sourceRef: 'IAEA NSS 17-T Rev.1 Annex III Table III-1',
    pedagogicalExample: true,
    adaptedToCurrentAppLogic: true,
    mappingFit: 'hög',
    targetCSL: 'CSL2',
    expectedAppResult: 'CSL2_FINAL',
    answers: {
      Q01: 'YES',
      Q02: 'YES',
      Q03: 'YES',
      Q04: 'YES',
      Q05: 'NO',
      Q06: 'NO',
      Q07: 'YES',
      Q08: 'YES',
      Q09: 'YES',
      Q10: 'NO',
      Q11: 'NO',
      Q12: 'NO',
      Q13: 'NO',
      Q14: 'NO',
      Q15: 'NO',
      Q09b: 'NO',
      Q16: 'NO',
      Q16b: 'NO',
      Q17: 'YES',
      Q18: 'NO',
      Q18b: 'NO',
      Q19: 'NO',
      Q20: 'NO',
      Q21: 'NO',
      Q21b: 'NO',
      Q22: 'NO',
      Q23: 'NO',
      Q23b: 'NO',
      Q24: 'NO',
      Q24b: 'NO',
      Q25: 'NO',
      Q26: 'YES',
      Q27: 'YES',
      Q28: 'NO',
      Q29: 'NO',
      Q30: 'YES',
      Q31: 'NO',
      Q32: 'NO',
    },
    compliance: {
      '8.16(a)': {
        status: 'COMPLIANT',
        notes:
          'Systemsäkerhetsplan SSP-RBG2-2025 godkänd. Strukturerad implementering per IOP-RBG2-001.',
      },
      '8.16(b)': {
        status: 'COMPLIANT',
        notes: 'CSL 2-policy DOC-POL-CSL2-v2.1 gäller. Granskad årligen.',
      },
      '8.16(c)': {
        status: 'COMPLIANT',
        notes: 'Användaravtal signerade. Utbildningsplan UTP-RBG2-2025 genomförd.',
      },
      '8.16(d)': {
        status: 'COMPLIANT',
        notes: 'Säkerhetsprövning genomförd för alla behöriga (6 st). Kompetensintyg krävs.',
      },
      '8.16(e)': {
        status: 'COMPLIANT',
        notes: 'Rollbaserad åtkomst: operator, admin, service. Granskning halvårsvis per ACL-RBG2.',
      },
      '8.16(f)': {
        status: 'COMPLIANT',
        notes:
          'Härdningschecklista HCL-RBG2-2024 tillämpad. Oanvända tjänster och portar avaktiverade.',
      },
      '8.16(g)': {
        status: 'COMPLIANT',
        notes:
          'Tvåfaktorsautentisering med smartkort för administratörer. Lösenordspolicy för operatörer.',
      },
      '8.16(h)': {
        status: 'COMPLIANT',
        notes:
          'Skydd via applikationsvitlistning (allowlisting). Signaturbaserat skydd ej tillämpligt för denna plattform.',
      },
      '8.16(i)': {
        status: 'COMPLIANT',
        notes: 'Loggning till central SIEM. Larmregler definierade per MON-RBG2-v2.',
      },
      '8.16(j)': {
        status: 'COMPLIANT',
        notes: 'Kvartalsvis sårbarhetsskanning. Senaste rapport VR-RBG2-2025Q1, 0 kritiska.',
      },
      '8.16(k)': {
        status: 'COMPLIANT',
        notes: 'Årlig revision. Senaste RV-RBG2-2024, inga avvikelser.',
      },
      '8.16(l)': {
        status: 'COMPLIANT',
        notes: 'Sårbarhetsbedömning VA-RBG2-2024 genomförd. Nästa planerad 2025-11.',
      },
      '8.16(m)': {
        status: 'COMPLIANT',
        notes: 'USB-portar avaktiverade i BIOS. Servicemedier skannas i sluss.',
      },
      '8.16(n)': {
        status: 'COMPLIANT',
        notes: 'Ändringshantering CM-RBG2-v3. Alla ändringar via CAB.',
      },
      '8.16(o)': {
        status: 'COMPLIANT',
        notes: 'Veckovis backup. Återställningstest genomfört 2025-02.',
      },
      '8.16(p)': { status: 'COMPLIANT', notes: 'Serviceenhet SVC-RBG2-01, exklusivt CSL 2.' },
      '8.16(q)': {
        status: 'COMPLIANT',
        notes: 'System i kontrollerat utrymme KR-07. Kortläsare + logg.',
      },
      '8.16(r)': {
        status: 'COMPLIANT',
        notes: '802.1X portautentisering aktiv. Obehöriga enheter blockeras.',
      },
      '8.16(s)': {
        status: 'COMPLIANT',
        notes: 'Ändringar kräver godkänd ändringsbegäran + verifiering.',
      },
      '8.18(a)': {
        status: 'COMPLIANT',
        notes:
          'Unidirektionell gateway installerad mot CSL 3-zon. Endast utgående data + TCP-ack tillåts. Verifierat i nätverkstest NT-RBG2-2025.',
      },
      '8.18(b)': {
        status: 'COMPLIANT',
        notes: 'Fjärråtkomst fysiskt omöjliggjord. Underhåll sker alltid lokalt med servicedator.',
      },
      '8.18(c)': {
        status: 'COMPLIANT',
        notes:
          '6 behöriga: 3 operatörer, 2 administratörer, 1 servicetekniker. Tydlig rollseparation dokumenterad.',
      },
      '8.18(d)': {
        status: 'COMPLIANT',
        notes:
          'All åtkomst loggas. Fysisk åtkomst kräver kortdragning + PIN. Granskning månadsvis.',
      },
      '8.18(e)': {
        status: 'PARTIAL',
        notes:
          'Administrativ åtkomst sker normalt lokalt. Undantagsfall med CSL 3-terminal kräver tvåfaktor + tvåpersonsregel. Utredning pågår om att eliminera undantaget helt (ÄR-RBG2-2025-003).',
      },
      '8.18(f)': {
        status: 'COMPLIANT',
        notes:
          'Redundant strömförsörjning (UPS-RBG2). Filintegritetskontroll (checksumma) vid uppstart. Dokumenterat i DV-RBG2-2025.',
      },
    },
  },
  {
    id: 'EX_CSL3_DIS3',
    fictionalName: 'DriftInfo DIS-3',
    displayNameSv: 'I&C-processinformationssystem',
    descriptionSv:
      'Exempelobjekt baserat på IAEA Annex III. Representerar ett processinformationssystem som ger larm och statusinformation till operatör.',
    sourceRef: 'IAEA NSS 17-T Rev.1 Annex III Table III-1',
    pedagogicalExample: true,
    adaptedToCurrentAppLogic: true,
    mappingFit: 'medel-hög',
    targetCSL: 'CSL3',
    expectedAppResult: 'CSL3_FINAL',
    answers: {
      Q01: 'YES',
      Q02: 'YES',
      Q03: 'YES',
      Q04: 'YES',
      Q05: 'NO',
      Q06: 'NO',
      Q07: 'YES',
      Q08: 'YES',
      Q09: 'NO',
      Q10: 'NO',
      Q11: 'NO',
      Q12: 'YES',
      Q13: 'NO',
      Q14: 'NO',
      Q15: 'NO',
      Q09b: 'NO',
      Q16: 'NO',
      Q16b: 'NO',
      Q17: 'NO',
      Q18: 'NO',
      Q18b: 'NO',
      Q19: 'NO',
      Q20: 'NO',
      Q21: 'YES',
      Q21b: 'NO',
      Q22: 'NO',
      Q23: 'NO',
      Q23b: 'NO',
      Q24: 'NO',
      Q24b: 'NO',
      Q25: 'NO',
      Q26: 'YES',
      Q27: 'YES',
      Q28: 'NO',
      Q29: 'NO',
      Q30: 'YES',
      Q31: 'NO',
      Q32: 'NO',
    },
    compliance: {
      '8.16(a)': {
        status: 'COMPLIANT',
        notes: 'SSP-DIS3-2025 godkänd. Implementerad systematiskt per anläggningens ramverk.',
      },
      '8.16(b)': { status: 'COMPLIANT', notes: 'CSL 3-policy POL-CSL3-v1.4 fastställd.' },
      '8.16(c)': { status: 'COMPLIANT', notes: 'Alla operatörer utbildade enligt UTP-DIS3-2025.' },
      '8.16(d)': {
        status: 'COMPLIANT',
        notes: 'Behörig personal med relevant I&C-erfarenhet. Säkerhetsprövning genomförd.',
      },
      '8.16(e)': {
        status: 'COMPLIANT',
        notes: 'Rollbaserad åtkomstkontroll. 12 operatörer, 3 admin. Halvårsgranskning.',
      },
      '8.16(f)': {
        status: 'COMPLIANT',
        notes: 'Härdad enligt HCL-DIS3-2024. Webbtjänster och oanvända protokoll avaktiverade.',
      },
      '8.16(g)': {
        status: 'COMPLIANT',
        notes: 'AD-integrerad autentisering med lösenordspolicy (90 dagar, komplexitet).',
      },
      '8.16(h)': {
        status: 'COMPLIANT',
        notes:
          'Centralt hanterat antivirusprogram med automatiska signaturuppdateringar via intern server.',
      },
      '8.16(i)': {
        status: 'COMPLIANT',
        notes: 'Windows Event Log vidarebefordrat till SIEM. Larmregler per MON-DIS3.',
      },
      '8.16(j)': {
        status: 'COMPLIANT',
        notes: 'Kvartalsvis sårbarhetsskanning. Rapport VR-DIS3-2025Q1.',
      },
      '8.16(k)': {
        status: 'COMPLIANT',
        notes: 'Intern revision RV-DIS3-2024 genomförd utan anmärkningar.',
      },
      '8.16(l)': {
        status: 'COMPLIANT',
        notes: 'Sårbarhetsbedömning VA-DIS3-2024 utan kritiska fynd.',
      },
      '8.16(m)': {
        status: 'COMPLIANT',
        notes: 'USB-policy tillämpas. Kontrollerade media enligt SOP-MEDIA-003.',
      },
      '8.16(n)': {
        status: 'COMPLIANT',
        notes: 'Ändringshantering CM-DIS3-v2. Alla patchar via CAB.',
      },
      '8.16(o)': {
        status: 'COMPLIANT',
        notes: 'Daglig backup. Återställningstest 2025-01, dokumenterat BKP-DIS3.',
      },
      '8.16(p)': { status: 'COMPLIANT', notes: 'Serviceenhet SVC-DIS3-01 exklusivt CSL 3.' },
      '8.16(q)': {
        status: 'COMPLIANT',
        notes: 'System i serverrum SR-05. Kortläsare + besökslogg.',
      },
      '8.16(r)': {
        status: 'COMPLIANT',
        notes: 'Nätverksåtkomstkontroll (NAC) aktiv på alla switchportar.',
      },
      '8.16(s)': { status: 'COMPLIANT', notes: 'Ändringar kräver godkänd ändringsbegäran.' },
      '8.19(a)': {
        status: 'COMPLIANT',
        notes:
          'Ingen internetåtkomst. Systemet placerat i isolerat VLAN bakom brandvägg FW-CSL3-01.',
      },
      '8.19(b)': {
        status: 'COMPLIANT',
        notes:
          'Audit trails aktiverade för alla nyckelresurser (databas, filsystem). Granskas månadsvis.',
      },
      '8.19(c)': {
        status: 'COMPLIANT',
        notes:
          'Säkerhetsgateway GW-CSL3-01 mellan CSL 3 och CSL 4. Vitlistade dataflöden definierade i FW-RULE-DIS3.',
      },
      '8.19(d)': {
        status: 'COMPLIANT',
        notes:
          'Alla fysiska anslutningar dokumenterade i nätverkskarta NK-DIS3-v3. Oanslutna portar avaktiverade.',
      },
      '8.19(e)': {
        status: 'COMPLIANT',
        notes: 'Åtkomstkontroll via AD + lokal brandvägg. Dokumenterat i ACL-DIS3-v2.',
      },
      '8.19(f)': {
        status: 'NOT_APPLICABLE',
        notes: 'Ingen fjärråtkomst förekommer — allt underhåll sker lokalt.',
      },
      '8.19(g)': {
        status: 'COMPLIANT',
        notes:
          'Behörigheter baserade på need-to-know. Operatörer ser bara processbilder, admin har separata konton.',
      },
      '8.19(h)': {
        status: 'COMPLIANT',
        notes:
          'Ingen administrativ åtkomst från andra CSL-nivåer. Dedikerade admin-stationer i CSL 3-zonen.',
      },
    },
  },
  {
    id: 'EX_CSL3_BAS3',
    fictionalName: 'BOP-Automation BAS-3',
    displayNameSv: 'I&C-operativa automationssystem för BOP',
    descriptionSv:
      'Exempelobjekt baserat på IAEA Annex III. Representerar operativa automationssystem för balance of plant.',
    sourceRef: 'IAEA NSS 17-T Rev.1 Annex III Table III-1',
    pedagogicalExample: true,
    adaptedToCurrentAppLogic: true,
    mappingFit: 'hög',
    targetCSL: 'CSL3',
    expectedAppResult: 'CSL3_FINAL',
    answers: {
      Q01: 'YES',
      Q02: 'YES',
      Q03: 'YES',
      Q04: 'YES',
      Q05: 'NO',
      Q06: 'NO',
      Q07: 'YES',
      Q08: 'YES',
      Q09: 'NO',
      Q10: 'NO',
      Q11: 'NO',
      Q12: 'YES',
      Q13: 'NO',
      Q14: 'NO',
      Q15: 'NO',
      Q09b: 'NO',
      Q16: 'NO',
      Q16b: 'NO',
      Q17: 'NO',
      Q18: 'NO',
      Q18b: 'NO',
      Q19: 'NO',
      Q20: 'NO',
      Q21: 'NO',
      Q21b: 'NO',
      Q22: 'YES',
      Q23: 'NO',
      Q23b: 'NO',
      Q24: 'NO',
      Q24b: 'NO',
      Q25: 'NO',
      Q26: 'YES',
      Q27: 'YES',
      Q28: 'NO',
      Q29: 'NO',
      Q30: 'YES',
      Q31: 'NO',
      Q32: 'NO',
    },
    compliance: {
      '8.16(a)': {
        status: 'COMPLIANT',
        notes:
          'SSP-BAS3-2025 godkänd. DCS-plattform installerad enligt leverantörens säkerhetskrav.',
      },
      '8.16(b)': { status: 'COMPLIANT', notes: 'CSL 3-policy tillämpas.' },
      '8.16(c)': { status: 'COMPLIANT', notes: 'Utbildning genomförd Q1 2025. Signerade avtal.' },
      '8.16(d)': {
        status: 'COMPLIANT',
        notes: 'Behörig personal med DCS-certifiering. Säkerhetsprövning klar.',
      },
      '8.16(e)': {
        status: 'COMPLIANT',
        notes: 'Rollbaserad åtkomst: operator/engineer/admin. Granskning halvårsvis.',
      },
      '8.16(f)': { status: 'COMPLIANT', notes: 'Härdad DCS-plattform. Vitlistade applikationer.' },
      '8.16(g)': {
        status: 'COMPLIANT',
        notes: 'Lokala konton med lösenordspolicy. Smartkort för serviceåtkomst.',
      },
      '8.16(h)': {
        status: 'COMPLIANT',
        notes:
          'Applikationsvitlistning (allowlisting) ersätter signaturbaserat skydd på DCS-plattform.',
      },
      '8.16(i)': {
        status: 'COMPLIANT',
        notes: 'Loggning till lokal historikserver + SIEM-vidarebefordran.',
      },
      '8.16(j)': { status: 'COMPLIANT', notes: 'Kvartalsvis sårbarhetsgranskning VR-BAS3-2025Q1.' },
      '8.16(k)': { status: 'COMPLIANT', notes: 'Revision RV-BAS3-2024. Inga anmärkningar.' },
      '8.16(l)': { status: 'COMPLIANT', notes: 'VA-BAS3-2024 genomförd.' },
      '8.16(m)': { status: 'COMPLIANT', notes: 'Kontrollerad USB-hantering per SOP-MEDIA-003.' },
      '8.16(n)': {
        status: 'COMPLIANT',
        notes: 'CM-BAS3-v2 följs. Alla patchar via CAB och leverantörsgodkännande.',
      },
      '8.16(o)': {
        status: 'COMPLIANT',
        notes: 'Daglig backup av konfiguration och historik. Testat 2025-02.',
      },
      '8.16(p)': { status: 'COMPLIANT', notes: 'SVC-BAS3-01 exklusivt CSL 3.' },
      '8.16(q)': {
        status: 'COMPLIANT',
        notes: 'DCS-skåp i låst kontrollrum. Elektronisk tillträdeskontroll.',
      },
      '8.16(r)': { status: 'COMPLIANT', notes: 'NAC-kontroll på alla switchportar.' },
      '8.16(s)': {
        status: 'COMPLIANT',
        notes: 'Ändringar kräver godkänd MoC (Management of Change).',
      },
      '8.19(a)': { status: 'COMPLIANT', notes: 'Ingen internetåtkomst. Isolerat BOP-nätverk.' },
      '8.19(b)': {
        status: 'COMPLIANT',
        notes: 'Audit trail för processdatabas och konfigurationsändringar.',
      },
      '8.19(c)': {
        status: 'COMPLIANT',
        notes: 'Brandvägg FW-BOP-01 med vitlistade regler mellan CSL 3 och CSL 4.',
      },
      '8.19(d)': {
        status: 'COMPLIANT',
        notes: 'Fysisk nätverkskarta NK-BAS3. Oanslutna portar låsta.',
      },
      '8.19(e)': {
        status: 'COMPLIANT',
        notes: 'Åtkomstkontroll via lokala konton + AD backup. Dokumenterat.',
      },
      '8.19(f)': {
        status: 'NEEDS_INVESTIGATION',
        notes:
          'Leverantören har begärt VPN-åtkomst för diagnostik. Utredning pågår om detta uppfyller kravet på robust kontroll. Ärende ÄR-BAS3-2025-007.',
      },
      '8.19(g)': {
        status: 'COMPLIANT',
        notes:
          'Need-to-know tillämpas. Operatörer ser processbilder, ingenjörer har separata konfigurationskonton.',
      },
      '8.19(h)': {
        status: 'PARTIAL',
        notes:
          'Administrativ åtkomst sker normalt lokalt. Undantagsfall via CSL 4-terminal kräver tvåfaktor. Plan att eliminera undantaget 2025-Q3.',
      },
    },
  },
  {
    id: 'EX_CSL4_KIT4',
    fictionalName: 'KontorsIT KIT-4',
    displayNameSv: 'Office IT',
    descriptionSv:
      'Exempelobjekt baserat på IAEA Annex III. Representerar kontors-IT för administrativa/personella funktioner.',
    sourceRef: 'IAEA NSS 17-T Rev.1 Annex III Table III-1',
    pedagogicalExample: true,
    adaptedToCurrentAppLogic: true,
    mappingFit: 'hög',
    targetCSL: 'CSL4',
    expectedAppResult: 'CSL4_FINAL',
    answers: {
      Q01: 'YES',
      Q02: 'YES',
      Q03: 'YES',
      Q04: 'YES',
      Q05: 'YES',
      Q06: 'YES',
      Q07: 'YES',
      Q08: 'YES',
      Q09: 'NO',
      Q10: 'NO',
      Q11: 'NO',
      Q12: 'NO',
      Q13: 'NO',
      Q14: 'NO',
      Q15: 'YES',
      Q09b: 'NO',
      Q16: 'NO',
      Q16b: 'NO',
      Q17: 'NO',
      Q18: 'NO',
      Q18b: 'NO',
      Q19: 'NO',
      Q20: 'NO',
      Q21: 'NO',
      Q21b: 'NO',
      Q22: 'NO',
      Q23: 'YES',
      Q23b: 'NO',
      Q24: 'NO',
      Q24b: 'NO',
      Q25: 'NO',
      Q26: 'NO',
      Q27: 'YES',
      Q28: 'YES',
      Q29: 'YES',
      Q30: 'YES',
      Q31: 'NO',
      Q32: 'NO',
    },
    compliance: {
      '8.16(a)': {
        status: 'COMPLIANT',
        notes: 'Hanterat inom anläggningens centrala ISMS. Dokumentation DOC-KIT4-2025.',
      },
      '8.16(b)': { status: 'COMPLIANT', notes: 'CSL 4-policy POL-CSL4-v1.2 gäller.' },
      '8.16(c)': {
        status: 'COMPLIANT',
        notes: 'Samtliga användare har genomgått IT-säkerhetsutbildning 2025.',
      },
      '8.16(d)': {
        status: 'COMPLIANT',
        notes: 'Standardbehörighet för kontorspersonal. Inga särskilda kompetensintyg krävs.',
      },
      '8.16(e)': {
        status: 'COMPLIANT',
        notes: 'AD-grupper styr behörigheter. Kvartalsvis granskning av gruppmedlemskap.',
      },
      '8.16(f)': {
        status: 'PARTIAL',
        notes:
          'Standardkonfiguration från leverantör. Viss härdning genomförd men inte fullständig per HCL-CSL4. Planerad åtgärd Q3 2025.',
      },
      '8.16(g)': {
        status: 'COMPLIANT',
        notes: 'AD-inloggning med lösenordspolicy (90 dagar, 12 tecken, komplexitet).',
      },
      '8.16(h)': {
        status: 'COMPLIANT',
        notes: 'Centralt hanterat EDR (Endpoint Detection & Response). Automatiska uppdateringar.',
      },
      '8.16(i)': {
        status: 'COMPLIANT',
        notes: 'Loggning till central SIEM via agent. Standardlarmregler.',
      },
      '8.16(j)': {
        status: 'COMPLIANT',
        notes: 'Månatlig automatisk sårbarhetsskanning. Rapport VS-KIT4-2025-04.',
      },
      '8.16(k)': { status: 'COMPLIANT', notes: 'Årlig intern revision per ISMS-kalender.' },
      '8.16(l)': {
        status: 'COMPLIANT',
        notes: 'Ingår i anläggningens generella sårbarhetsbedömningsprogram.',
      },
      '8.16(m)': {
        status: 'COMPLIANT',
        notes:
          'USB-policy: kontrollerade media tillåtna. Privatägda enheter förbjudna per anställningsavtal.',
      },
      '8.16(n)': {
        status: 'COMPLIANT',
        notes: 'Patchhantering via WSUS. Månatliga uppdateringsfönster. CM-process följs.',
      },
      '8.16(o)': {
        status: 'COMPLIANT',
        notes: 'Nätverksbackup dagligen. Filåterställning testad 2025-03.',
      },
      '8.16(p)': {
        status: 'COMPLIANT',
        notes: 'Serviceenheter tilldelade CSL 4. Inventerade i CMDB.',
      },
      '8.16(q)': {
        status: 'COMPLIANT',
        notes: 'Servrar i låst serverrum. Klienter i kontorsmiljö med passerkort.',
      },
      '8.16(r)': {
        status: 'COMPLIANT',
        notes: 'NAC-kontroll. Okända enheter hamnar i karantän-VLAN.',
      },
      '8.16(s)': {
        status: 'COMPLIANT',
        notes: 'Systemändringar via IT-avdelningens standardprocess.',
      },
      '8.20(a)': {
        status: 'COMPLIANT',
        notes:
          'Ingen direkt internetåtkomst från CSL 4-system. Användare som behöver webbåtkomst använder virtuell surfstation (VDI-SURF-01) placerad i CSL 5-zon, åtkomlig via terminalprotokoll utan klippbord eller filöverföring. Inga dataflöden från internet når CSL 4-nätverket.',
      },
      '8.20(b)': {
        status: 'COMPLIANT',
        notes:
          'Säkerhetsgateway GW-CSL4-01 (brandvägg + IDS) mellan CSL 4 och det godkända företagsnätverket. Vitlistade flöden definierade i FW-RULE-KIT4-v3. Alla andra flöden blockerade och loggade. Granskning kvartalsvis.',
      },
      '8.20(c)': {
        status: 'COMPLIANT',
        notes:
          'Alla fysiska anslutningar dokumenterade i nätverkskarta NK-KIT4-v4. Lediga switchportar avaktiverade och fysiskt märkta. Oanslutna patchpanelsportar blockerade med portlås.',
      },
      '8.20(d)': {
        status: 'COMPLIANT',
        notes:
          'Fjärrunderhåll tillåtet via dedikerad leverantörs-VPN med MFA, tidsbegränsad session (max 4h) och tvåpersonsövervakning vid anslutning. Avtal SLA-KIT4-2024 specificerar säkerhetspolicy. Alla sessioner loggade och granskade.',
      },
      '8.20(e)': {
        status: 'COMPLIANT',
        notes:
          'AD-baserad åtkomstkontroll med granulära gruppbehörigheter. Administratörskonton separerade från användarkonton. Privilegierade sessioner loggas.',
      },
      '8.20(f)': {
        status: 'NOT_APPLICABLE',
        notes:
          'Ingen extern fjärråtkomst för slutanvändare — systemet är internt kontorssystem utan exponerade tjänster.',
      },
    },
  },
  {
    id: 'EX_CSL4_IKS4',
    fictionalName: 'Insatskommunikation IKS-4',
    displayNameSv: 'Telekommunikationssystem',
    descriptionSv:
      'Exempelobjekt baserat på IAEA Annex III. Representerar telekommunikationssystem för kontakt med insatsstyrkor eller externa aktörer.',
    sourceRef: 'IAEA NSS 17-T Rev.1 Annex III Table III-1',
    pedagogicalExample: true,
    adaptedToCurrentAppLogic: true,
    mappingFit: 'medel-låg',
    mappingNote:
      'Nuvarande app saknar egen funktionstyp för extern insats-/responskommunikation. Exemplet mappas därför till ADMINISTRATIVE_SUPPORT för att nå CSL4 i nuvarande logik.',
    targetCSL: 'CSL4',
    expectedAppResult: 'CSL4_FINAL',
    answers: {
      Q01: 'YES',
      Q02: 'YES',
      Q03: 'YES',
      Q04: 'YES',
      Q05: 'YES',
      Q06: 'NO',
      Q07: 'YES',
      Q08: 'YES',
      Q09: 'NO',
      Q10: 'NO',
      Q11: 'NO',
      Q12: 'NO',
      Q13: 'NO',
      Q14: 'NO',
      Q15: 'YES',
      Q09b: 'NO',
      Q16: 'NO',
      Q16b: 'NO',
      Q17: 'NO',
      Q18: 'NO',
      Q18b: 'NO',
      Q19: 'NO',
      Q20: 'NO',
      Q21: 'NO',
      Q21b: 'NO',
      Q22: 'NO',
      Q23: 'YES',
      Q23b: 'NO',
      Q24: 'NO',
      Q24b: 'NO',
      Q25: 'NO',
      Q26: 'NO',
      Q27: 'YES',
      Q28: 'YES',
      Q29: 'YES',
      Q30: 'YES',
      Q31: 'NO',
      Q32: 'NO',
    },
    compliance: {
      '8.16(a)': {
        status: 'COMPLIANT',
        notes: 'Telekommunikationssystemet ingår i anläggningens ISMS. SSP-IKS4-2025.',
      },
      '8.16(b)': { status: 'COMPLIANT', notes: 'CSL 4-policy tillämpas.' },
      '8.16(c)': {
        status: 'COMPLIANT',
        notes: 'Operatörer utbildade i SOP-IKS4. Avtal signerade.',
      },
      '8.16(d)': { status: 'COMPLIANT', notes: 'Behörig personal med telekomkompetens.' },
      '8.16(e)': {
        status: 'COMPLIANT',
        notes: 'Begränsade adminbehörigheter. Operatörer har enbart samtals-/meddelandefunktioner.',
      },
      '8.16(f)': {
        status: 'COMPLIANT',
        notes: 'Onödiga tjänster och protokoll avaktiverade i PBX-konfiguration.',
      },
      '8.16(g)': {
        status: 'COMPLIANT',
        notes: 'PIN-kod för admin. Operatörer identifieras via anknytning + kortnummer.',
      },
      '8.16(h)': {
        status: 'NOT_APPLICABLE',
        notes:
          'Dedikerad telekomplattform utan generellt OS — signaturbaserat skydd ej tillämpligt.',
      },
      '8.16(i)': {
        status: 'PARTIAL',
        notes:
          'Samtalslogg finns. Säkerhetshändelser loggas till syslog men granskas ej systematiskt ännu. Plan för SIEM-integration Q4 2025.',
      },
      '8.16(j)': {
        status: 'NEEDS_INVESTIGATION',
        notes:
          'Leverantören har inte levererat sårbarhetsinformation för senaste firmware. Utredning ÄR-IKS4-2025-002 pågår.',
      },
      '8.16(k)': { status: 'COMPLIANT', notes: 'Ingår i årlig ISMS-revision.' },
      '8.16(l)': {
        status: 'PARTIAL',
        notes: 'Sårbarhetsbedömning genomförd men firmware-nivå ej fullständigt analyserad.',
      },
      '8.16(m)': {
        status: 'COMPLIANT',
        notes:
          'Inga USB-portar på PBX-utrustning. Konfiguration via seriellt gränssnitt med kontrollerad åtkomst.',
      },
      '8.16(n)': {
        status: 'COMPLIANT',
        notes: 'Firmware-uppdateringar via leverantörens kontrollerade process. CM-IKS4.',
      },
      '8.16(o)': {
        status: 'COMPLIANT',
        notes: 'Konfigurationsbackup veckovis. Testad återställning 2025-01.',
      },
      '8.16(p)': { status: 'COMPLIANT', notes: 'Serviceenhet SVC-IKS4-01 tilldelad CSL 4.' },
      '8.16(q)': {
        status: 'COMPLIANT',
        notes: 'PBX-centralen i låst telekomrum TK-02. Passerkort krävs.',
      },
      '8.16(r)': {
        status: 'COMPLIANT',
        notes: 'Fysisk portlåsning på patchpanel. Ändringar dokumenteras.',
      },
      '8.16(s)': {
        status: 'COMPLIANT',
        notes: 'Konfigurationsändringar kräver godkännande av telekomansvarig.',
      },
      '8.20(a)': {
        status: 'COMPLIANT',
        notes:
          'Ingen internetåtkomst från telekomsystemet. Nätverket är fysiskt isolerat. All extern kommunikation (t.ex. uppkoppling mot insatsstyrkor) sker via dedikerade WAN-länkar som inte passerar internet. Eventuellt behov av webbåtkomst för administration hanteras via virtuell surfstation (VDI-SURF-02) i CSL 5-zon.',
      },
      '8.20(b)': {
        status: 'COMPLIANT',
        notes:
          'Säkerhetsgateway GW-TK-01 (brandvägg + SBC) mellan telekomnät och företagsnät. Vitlistade SIP-flöden och signaleringsprotokollet begränsat till kända adresser. Alla andra flöden blockerade.',
      },
      '8.20(c)': {
        status: 'COMPLIANT',
        notes:
          'Alla fysiska anslutningar dokumenterade i nätverkskarta NK-IKS4-v2. Oanslutna portar på patchpanel fysiskt blockerade. Kopplingsändringar kräver godkännande.',
      },
      '8.20(d)': {
        status: 'COMPLIANT',
        notes:
          'Leverantör har dedikerad VPN-åtkomst för felavhjälpning via jump-host i DMZ. MFA + tidsbegränsad session (max 2h) + inspelning av alla sessioner. Avtal SLA-IKS4-2024 specificerar säkerhetskrav.',
      },
      '8.20(e)': {
        status: 'COMPLIANT',
        notes:
          'Administratörer har PIN + lokalt konto med fullständig åtkomstkontroll. Operatörer har enbart samtalsfunktioner utan konfigurationsåtkomst. Separerade behörighetsnivåer dokumenterade.',
      },
      '8.20(f)': {
        status: 'NOT_APPLICABLE',
        notes:
          'Ingen extern fjärråtkomst för slutanvändare. Systemet används uteslutande internt för insatskommunikation.',
      },
    },
  },
  {
    id: 'EX_CSL5_PME5',
    fictionalName: 'Mobil Enhet PME-5',
    displayNameSv: 'Personliga mobila IT-enheter',
    descriptionSv:
      'Exempelobjekt baserat på IAEA Annex III. Representerar personliga mobila IT-enheter som i Annex III används som undantags-/referensexempel.',
    sourceRef: 'IAEA NSS 17-T Rev.1 Annex III Table III-1',
    pedagogicalExample: true,
    adaptedToCurrentAppLogic: true,
    mappingFit: 'låg',
    mappingNote:
      'Annex III beskriver detta som ett undantags-/referensexempel. Eftersom appen kräver minst en funktion för klassning mappas exemplet till ADMINISTRATIVE_SUPPORT i nuvarande logik.',
    targetCSL: 'CSL5',
    expectedAppResult: 'CSL5_FINAL',
    answers: {
      Q01: 'YES',
      Q02: 'YES',
      Q03: 'YES',
      Q04: 'YES',
      Q05: 'YES',
      Q06: 'NO',
      Q07: 'YES',
      Q08: 'YES',
      Q09: 'NO',
      Q10: 'NO',
      Q11: 'NO',
      Q12: 'NO',
      Q13: 'NO',
      Q14: 'NO',
      Q15: 'YES',
      Q09b: 'NO',
      Q16: 'NO',
      Q16b: 'NO',
      Q17: 'NO',
      Q18: 'NO',
      Q18b: 'NO',
      Q19: 'NO',
      Q20: 'NO',
      Q21: 'NO',
      Q21b: 'NO',
      Q22: 'NO',
      Q23: 'NO',
      Q23b: 'NO',
      Q24: 'YES',
      Q24b: 'NO',
      Q25: 'NO',
      Q26: 'NO',
      Q27: 'NO',
      Q28: 'YES',
      Q29: 'YES',
      Q30: 'YES',
      Q31: 'NO',
      Q32: 'NO',
    },
    compliance: {
      '8.16(a)': {
        status: 'PARTIAL',
        notes:
          'Enheterna hanteras av IT men utan dedikerad systemsäkerhetsplan. Generell IT-policy gäller. Gap: ingen specifik SSP.',
      },
      '8.16(b)': {
        status: 'COMPLIANT',
        notes: 'CSL 5-policy (baseline) tillämpas via generell IT-säkerhetspolicy.',
      },
      '8.16(c)': {
        status: 'COMPLIANT',
        notes: 'Alla anställda signerar IT-villkor vid anställning.',
      },
      '8.16(d)': { status: 'COMPLIANT', notes: 'Standardanställda med bakgrundskontroll.' },
      '8.16(e)': {
        status: 'COMPLIANT',
        notes: 'Användare har inga adminrättigheter. MDM styr behörigheter.',
      },
      '8.16(f)': {
        status: 'PARTIAL',
        notes:
          'Standardkonfiguration från MDM. Begränsad härdning — användarna kan installera appar från godkänd butik.',
      },
      '8.16(g)': {
        status: 'COMPLIANT',
        notes: 'Enhetslösenord + biometrisk upplåsning. AD-kopplad e-post med MFA.',
      },
      '8.16(h)': {
        status: 'COMPLIANT',
        notes: 'MDM tillhandahåller automatisk skadeprogramsskanning.',
      },
      '8.16(i)': {
        status: 'PARTIAL',
        notes:
          'MDM loggar enhetsstate och policyefterlevnad. Ingen dedikerad säkerhetsloggning av användaraktivitet.',
      },
      '8.16(j)': {
        status: 'COMPLIANT',
        notes: 'Automatiska OS-uppdateringar aktiverade via MDM-policy.',
      },
      '8.16(k)': { status: 'COMPLIANT', notes: 'Ingår i årlig ISMS-revision.' },
      '8.16(l)': {
        status: 'NOT_APPLICABLE',
        notes: 'Personliga enheter — sårbarhetsbedömning hanteras genom MDM-uppdateringspolicy.',
      },
      '8.16(m)': {
        status: 'COMPLIANT',
        notes:
          'Privatägda enheter tillåts EJ anslutas till anläggningens nätverk — separat gästnät.',
      },
      '8.16(n)': {
        status: 'COMPLIANT',
        notes: 'MDM hanterar uppdateringar centralt. Ändringshantering via IT-standardprocess.',
      },
      '8.16(o)': {
        status: 'NOT_APPLICABLE',
        notes: 'Ingen lokal data av värde — all data i molntjänst med egen backup.',
      },
      '8.16(p)': { status: 'COMPLIANT', notes: 'Enheterna klassade som CSL 5 i CMDB.' },
      '8.16(q)': {
        status: 'NOT_APPLICABLE',
        notes:
          'Mobila enheter — fysisk åtkomstkontroll ej tillämplig. MDM ger fjärrlåsning/radering.',
      },
      '8.16(r)': {
        status: 'COMPLIANT',
        notes: 'Enheter registreras i MDM innan nätverksanslutning tillåts.',
      },
      '8.16(s)': {
        status: 'COMPLIANT',
        notes: 'Ändringar i enhetskonfiguration kräver IT-godkännande via MDM.',
      },
      '8.21(a)': {
        status: 'COMPLIANT',
        notes:
          'MDM-policy säkerställer minimum OS-version och säkerhetspatchar. Enheter som ej uppfyller baseline blockeras.',
      },
      '8.21(b)': {
        status: 'COMPLIANT',
        notes: 'Användare har inga adminrättigheter. Konfigurationsändringar via IT/MDM.',
      },
      '8.21(c)': {
        status: 'COMPLIANT',
        notes:
          'Internetåtkomst tillåten via kontrollerad proxy med URL-filtrering och TLS-inspektion.',
      },
      '8.21(d)': {
        status: 'COMPLIANT',
        notes: 'Fjärråtkomst till e-post och intranät via MFA-skyddad VPN/Zero Trust-lösning.',
      },
      '8.21(e)': {
        status: 'NOT_APPLICABLE',
        notes:
          'Mobila enheter ansluts till separerat gästnät/mobilnät — inget gränssnitt mot högre CSL-system.',
      },
    },
  },
];

// ─── Metadata-export (för UI-presentation) ──────────────────────

export const EXAMPLE_ASSESSMENTS_META: ExampleMeta[] = RAW_EXAMPLES.map(
  ({ answers: _answers, compliance: _compliance, ...meta }) => meta,
);

// ─── Konvertera till SystemAssessment ───────────────────────────

/**
 * Bygg en komplett SystemAssessment från ett exempelobjekt.
 * Svaren lagras per funktion (med functionId) för konsekvensfrågor
 * och globalt för övriga sektioner, i enlighet med appens modell.
 */
export function buildExampleAssessment(exampleId: string): SystemAssessment | null {
  const raw = RAW_EXAMPLES.find((e) => e.id === exampleId);
  if (!raw) return null;

  const now = new Date().toISOString();

  // Konvertera svarsmap till Answer-array
  // Konsekvensfrågor (Q16+) lagras globalt — motorn löser funktioner dynamiskt
  const answers = Object.entries(raw.answers).map(([questionId, value]) => ({
    questionId,
    value: value as AnswerValue,
  }));

  // Konvertera compliance-map till RequirementComplianceItem-array
  const requirementCompliance = raw.compliance
    ? Object.entries(raw.compliance).map(([paragraph, entry]) => ({
        requirementParagraph: paragraph,
        status: entry.status,
        notes: entry.notes,
      }))
    : undefined;

  return {
    id: `example-${raw.id}-${Date.now()}`,
    schemaVersion: 2,
    systemName: `${raw.fictionalName} (${raw.displayNameSv})`,
    systemDescription: raw.descriptionSv,
    facilityName: 'Exempelanläggning',
    assessor: 'Demoanvändare',
    createdAt: now,
    updatedAt: now,
    currentStep: 0,
    functions: [],
    answers,
    result: null,
    requirementCompliance,
  };
}
