const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
const OpenAI = require("openai");
const { PDFParse } = require("pdf-parse");
dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const uploadedTexts = {};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "ModuleMind backend werkt" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Geen bestand ontvangen" });
    }

    const parser = new PDFParse({ data: req.file.buffer });
    const pdfData = await parser.getText();
    const uploadId = Date.now().toString();

    uploadedTexts[uploadId] = pdfData.text;

    res.json({
      message: "PDF gelezen",
      uploadId,
      textPreview: pdfData.text.slice(0, 300),
    });
  } catch (error) {
    console.error("PDF parse error:", error);
    res.status(500).json({
      error: error.message || "PDF kon niet gelezen worden",
    });
  }
});

app.post("/modules", async (req, res) => {
  try {
    const {
      subject,
      sub_subject,
      user_id,
      created_by,
      owner_role,
      visibility,
    } = req.body;

    if (!subject || !sub_subject || !user_id) {
      return res.status(400).json({
        error: "subject, sub_subject en user_id zijn verplicht",
      });
    }

    const { data, error } = await supabase
      .from("modules")
      .insert([
        {
          subject,
          sub_subject,
          user_id,
          created_by: created_by || user_id,
          owner_role: owner_role || "leerling",
          visibility: visibility || "private",
        },
      ])
      .select();

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    res.json(data[0]);
  } catch (error) {
    console.error("Create module error:", error);

    res.status(500).json({
      error: "Serverfout bij module aanmaken",
    });
  }
});

app.get("/modules", async (req, res) => {
  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.post("/generate-questions", async (req, res) => {
  try {
    const { subject, subSubject, uploadId } = req.body;

if (!subject || !subSubject) {
  return res.status(400).json({
    error: "subject en subSubject zijn verplicht",
  });
}

const fileText = uploadedTexts[uploadId];

if (!fileText) {
  return res.status(400).json({
    error: "Geen PDF-tekst gevonden. Upload eerst een PDF.",
  });
}
    
const prompt = `
Maak 4 oefenvragen in het Nederlands voor een leerling secundair onderwijs.

Gebruik vooral deze tekst uit de PDF:
${fileText.slice(0, 6000)}

Vak: ${subject}
Subvak: ${subSubject}

Maak verschillende vraagtypes:
- multiple_choice
- short_answer
- true_false
- open_question

Geef ALLEEN geldige JSON terug.
Gebruik exact deze structuur:
[
  {
    "type": "multiple_choice",
    "question": "vraagtekst",
    "answers": ["antwoord A", "antwoord B", "antwoord C", "antwoord D"],
    "correctAnswer": "exact juiste antwoord"
  },
  {
    "type": "short_answer",
    "question": "vraagtekst",
    "answers": [],
    "correctAnswer": "kort correct antwoord"
  },
  {
    "type": "true_false",
    "question": "stelling",
    "answers": ["Waar", "Niet waar"],
    "correctAnswer": "Waar"
  },
  {
    "type": "open_question",
    "question": "vraagtekst",
    "answers": [],
    "correctAnswer": "voorbeeldantwoord"
  }
]
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const rawText = response.output_text;
    const questions = JSON.parse(rawText);

    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Fout bij genereren van vragen",
    });
  }
});

app.post("/questions", async (req, res) => {
  try {
    const { module_id, questions } = req.body;

    if (!module_id) {
      return res.status(400).json({ error: "module_id ontbreekt" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "questions ontbreken" });
    }

    const rows = questions.map((q) => ({
      module_id,
      type: q.type || "unknown",
      question: q.question || "",
      answers: q.answers || [],
      correct_answer: q.correctAnswer || q.correct_answer || "",
    }));

    const { data, error } = await supabase
      .from("questions")
      .insert(rows)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error("Save questions error:", error);
    res.status(500).json({ error: "Serverfout bij opslaan vragen" });
  }
});

app.get("/modules/:id/questions", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("module_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

const PORT = process.env.PORT || 3000;

app.delete("/modules/:id", async (req, res) => {
  const { id } = req.params;

  const { error: questionError } = await supabase
    .from("questions")
    .delete()
    .eq("module_id", id);

  if (questionError) {
    return res.status(500).json({ error: questionError.message });
  }

  const { error: moduleError } = await supabase
    .from("modules")
    .delete()
    .eq("id", id);

  if (moduleError) {
    return res.status(500).json({ error: moduleError.message });
  }

  res.json({ message: "Module verwijderd" });
});

app.post("/modules/by-ids", async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.json([]);
  }

  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .in("id", ids);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Backend draait op http://localhost:${PORT}`);
});