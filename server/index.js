// server/index.js

const express = require('express');
const cors = require('cors');
const path = require('path');

// 🔹 Apna NLP + data modules (ye files abhi banaoge)
const { detectIntent } = require('./nlp');
const syllabusData = require('./data/syllabus.json');
const rulesData = require('./data/rules.json');

const app = express();
app.use(express.json());
app.use(cors());

// Helper: syllabus text banane ke liye
function formatSyllabus(branch, sem) {
  const semData = syllabusData[branch]?.[sem];
  if (!semData || semData.length === 0) {
    return `😕 ${branch} ${sem}th sem ke liye syllabus data abhi available nahi hai.`;
  }
  const list = semData
    .map(s => `• ${s.code}: ${s.name} (${s.credits} cr)`)
    .join('\n');
  return `**${branch} ${sem}th Sem Syllabus:**\n\n${list}`;
}

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  const intent = detectIntent(message);

  // 1) SYLLABUS QUERIES
  if (intent.type === 'syllabus') {
    // Sem nahi mila to pucho
    if (!intent.sem) {
      return res.json({
        answer: `📚 Kaun sa semester? Example: "6th sem CSE syllabus"`,
        sourceType: 'clarify'
      });
    }

    const ans = formatSyllabus('CSE', String(intent.sem));
    return res.json({
      answer: ans,
      sourceType: 'syllabus'
    });
  }

  // 2) ATTENDANCE RULES
  if (intent.type === 'attendance') {
    const att = rulesData.attendance;
    return res.json({
      answer:
        `📋 **AKTU Attendance Rules:**\n\n` +
        `• Minimum: ${att.min}\n` +
        `• Grace: ${att.grace}\n` +
        `• Note: ${att.note}`,
      sourceType: 'rules'
    });
  }

  // 3) FALLBACK – generic helper
  return res.json({
    answer:
      `AKTU Assistant: "${message}" exact samjha nahi.\n\n` +
      `Try kuch aise questions:\n` +
      `• "6th sem CSE syllabus"\n` +
      `• "attendance rules kya hain?"`,
    sourceType: 'fallback'
  });
});

// ✅ Backend port 5000 (frontend 3000 hai)
app.listen(5000, () => {
  console.log('🧠 Rule-based AKTU Assistant running on http://localhost:5000');
});
