// server/nlp.js
function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function detectSemester(text) {
  const m = normalize(text);
  const semMatch = m.match(/(\b[1-8](st|nd|rd|th)?\b).*?(sem|semester)/);
  if (!semMatch) return null;
  return parseInt(semMatch[1], 10);
}

function detectIntent(text) {
  const m = normalize(text);

  if (/(syllabus|subjects|course|papers)/.test(m)) {
    const sem = detectSemester(m);
    return { type: 'syllabus', sem };
  }

  if (/(attendance|attendence|present|shortage)/.test(m)) {
    return { type: 'attendance' };
  }

  return { type: 'fallback' };
}

module.exports = { detectIntent, detectSemester, normalize };
