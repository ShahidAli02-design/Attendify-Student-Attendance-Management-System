import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google Gen AI client if key exists
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  aiClient = new GoogleGenAI({ apiKey: geminiApiKey });
}

// Fallback intelligent response generator for college practical demo reliability
function generateSmartFallback(query: string, studentContext?: any): string {
  const q = query.toLowerCase();

  if (q.includes('python') || q.includes('code') || q.includes('script') || q.includes('formula')) {
    return `### 🐍 Python Attendance Calculation Concept

Here is how attendance calculation and eligibility checking is implemented in Python:

\`\`\`python
# Attendify Core Python Logic: Attendance Analytics
def calculate_attendance(attended_classes: int, total_classes: int) -> dict:
    if total_classes == 0:
        return {"percentage": 0.0, "status": "No data", "eligible": False}
    
    percentage = round((attended_classes / total_classes) * 100, 2)
    is_eligible = percentage >= 75.0
    
    # Calculate classes needed to achieve 75% criteria if lagging
    classes_needed = 0
    if percentage < 75.0:
        # Formula: (attended + x) / (total + x) >= 0.75
        # attended + x >= 0.75 * total + 0.75 * x
        # 0.25 * x >= 0.75 * total - attended
        classes_needed = max(0, int((0.75 * total_classes - attended_classes) / 0.25) + 1)
        
    return {
        "percentage": percentage,
        "eligible": is_eligible,
        "classes_needed_for_75": classes_needed,
        "status": "Eligible for Exams" if is_eligible else "Shortage Notice Issued"
    }

# Example run:
student_data = {"JS": (17, 20), "React": (14, 18), "Python": (23, 25), "Prog": (22, 25)}
for subject, (att, tot) in student_data.items():
    res = calculate_attendance(att, tot)
    print(f"{subject}: {res['percentage']}% ({res['status']})")
\`\`\`
*Key concept: Pure functions, Dictionary mappings, Type hinting, and Math formulation.*`;
  }

  if (q.includes('eligib') || q.includes('75') || q.includes('shortage') || q.includes('exam')) {
    const studentName = studentContext?.name || 'Student';
    const overall = studentContext?.overall || 86;
    return `### 📋 University Attendance Criteria (PRPCEM Norms)
1. **Mandatory Minimum Attendance:** 75% aggregate across all theory and practical subjects.
2. **Medical Concession:** In certified medical cases, relaxation up to 65% is permissible with valid Dean approval.
3. **Current Status for ${studentName}:** Overall attendance is **${overall}%**. You are currently **ELIGIBLE** to appear for end-semester practical and theory examinations.
4. **Tip:** If your attendance in any individual subject drops below 75%, attend the next 3 consecutive lecture hours to restore compliance.`;
  }

  if (q.includes('viva') || q.includes('practical') || q.includes('concept') || q.includes('question')) {
    return `### 💡 College Practical Viva Rapid Fire:
1. **Q: How does localStorage maintain attendance state in Attendify?**
   *A:* \`localStorage.setItem('key', JSON.stringify(data))\` stores key-value strings in the client browser across page reloads.
2. **Q: What is the difference between \`map()\` and \`filter()\` used in the Admin dashboard?**
   *A:* \`map()\` transforms each student record to a table row, whereas \`filter()\` extracts students matching search queries (like Roll No or Status).
3. **Q: Why are arrow functions preferred for event handlers like \`onClick\`?**
   *A:* Arrow functions maintain lexical \`this\` and provide concise callback syntax (e.g., \`() => handleMark(rollNo, 'Present')\`).
4. **Q: How do you check attendance using Python Pandas?**
   *A:* \`df.groupby('RollNo')['Status'].apply(lambda x: (x == 'Present').mean() * 100)\``;
  }

  if (q.includes('leave') || q.includes('medical') || q.includes('absent')) {
    return `### 📝 Leave Application Policy
- **Medical Leave:** Must be submitted along with a registered medical practitioner certificate within 3 working days.
- **Academic OD (On-Duty):** Permitted for representing PRPCEM in hackathons, seminars, or sports events.
- **How to apply:** Click on the "Submit Leave Request" button in your Student Profile. Once verified by the Admin/HOD, the attendance credit will reflect automatically.`;
  }

  return `Hello! I am your Attendify Academic Assistant. 
You can ask me anything about:
• Your attendance status & exam eligibility calculation
• Python scripts & data structures used in attendance analytics
• College policies (75% mandatory criteria, medical leave)
• React & JavaScript practical concepts for your lab viva!`;
}

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, studentContext } = req.body;
    const lastUserMessage = messages && messages.length > 0 
      ? messages[messages.length - 1].content 
      : '';

    if (!lastUserMessage) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    if (aiClient) {
      try {
        const systemInstruction = `You are "Attendify AI", a knowledgeable, friendly, and precise Academic and Attendance Assistant for students and faculty at PRPCEM (P. R. Pote Patil College of Engineering and Management).
You specialize in:
1. Student attendance queries, exam eligibility criteria (mandatory 75% university rule, medical concessions).
2. Python programming concepts for data analysis, attendance calculating scripts, pandas/dictionary data structures, and computer science fundamentals.
3. React and JavaScript concepts relevant to the student's lab practicals (DOM events, arrow functions, hooks like useState/useEffect, array methods, localStorage persistence).
4. Explaining formulas clearly with clean markdown formatting.

Current Student Context:
${studentContext ? JSON.stringify(studentContext, null, 2) : 'General student portal'}

Keep answers concise, direct, helpful, and formatted with clean markdown bullets or code snippets where applicable.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: lastUserMessage,
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });

        const reply = response.text || generateSmartFallback(lastUserMessage, studentContext);
        return res.json({ reply });
      } catch (err) {
        console.warn('Gemini API call failed, using high-quality local fallback:', err);
        const reply = generateSmartFallback(lastUserMessage, studentContext);
        return res.json({ reply, isFallback: true });
      }
    } else {
      const reply = generateSmartFallback(lastUserMessage, studentContext);
      return res.json({ reply, isFallback: true });
    }
  } catch (error) {
    console.error('Server error handling /api/chat:', error);
    res.status(500).json({ error: 'Internal server error processing query' });
  }
});

// Vite dev server mounting in development or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Attendify full-stack server running on port ${port}`);
  });
}

startServer();
