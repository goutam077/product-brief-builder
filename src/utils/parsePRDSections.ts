
/**
 * Splits document text (raw or extracted) into PRD sections based on heading keywords,
 * regardless of their formatting. Headings are matched even with extra spaces, colons, or dashes.
 */

const SECTION_DEFS = [
  { id: "overview", keywords: ["overview"] },
  { id: "objectives", keywords: ["objectives", "goals"] },
  { id: "assumptions", keywords: ["assumptions"] },
  { id: "functional", keywords: ["functional requirements", "functional requirement"] },
  { id: "nonfunctional", keywords: ["non-functional requirements", "non functional requirements", "nonfunctional requirements", "nonfunctional requirement"] },
  { id: "constraints", keywords: ["constraints", "limitations"] },
  { id: "success", keywords: ["success metrics", "acceptance criteria"] },
];

// Match section heading, e.g. Objectives:, Objectives-, objectives, etc.
function makeSectionRegex(keyword: string): RegExp {
  // ^\s*keyword\s*[:\-]?\s*$
  return new RegExp(
    "^\\s*" + keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + "\\s*[:\\-]?(\\s*)$",
    "i"
  );
}

const sectionHeadingPatterns = SECTION_DEFS
  .map(sec => sec.keywords.map(k => ({ id: sec.id, regex: makeSectionRegex(k) })))
  .flat();

export function parsePRDSectionsFromDoc(raw: string) {
  // Split input text into lines
  const lines = raw
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  let sections: { [key: string]: string[] } = {};
  let currentId: string | null = null;

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];

    // Find if this line is a section heading
    const match = sectionHeadingPatterns.find(({ regex }) => regex.test(line));
    if (match) {
      currentId = match.id;
      if (!sections[currentId]) sections[currentId] = [];
      continue; // Heading line itself is not included
    }
    if (currentId) {
      sections[currentId].push(line);
    }
  }

  // Compose section content, joining lines
  const parsed: { [key: string]: string } = {};
  SECTION_DEFS.forEach(sec => {
    parsed[sec.id] = (sections[sec.id] || []).join("\n").trim();
  });

  // For debugging
  if (typeof window !== "undefined") {
    console.log("[parsePRDSectionsFromDoc]", parsed);
  }
  return parsed;
}
