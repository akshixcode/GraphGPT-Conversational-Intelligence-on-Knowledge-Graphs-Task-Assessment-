const express = require("express");
const router = express.Router();
const axios = require("axios");

async function callLLM(prompt) {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data.choices[0].message.content;
}

router.post("/", async (req, res) => {
  const db = req.app?.locals?.db;
  const { query } = req.body;

  if (!db) return res.status(500).send("DB not connected");

  if (!query.match(/order|invoice|delivery|payment|product|billing/i)) {
    return res.send("This system is designed for dataset queries only.");
  }

  try {
    const mongoPrompt = `
Convert the user query into MongoDB aggregation query.

User Query: ${query}

Return ONLY JSON using standard JSON:
- Use collection name as "collection"
- Use aggregation pipeline array as "pipeline"
- Dates must be strings in "YYYY-MM-DD" format
- Do NOT use ISODate() or MongoDB constructors
`;

    let llmResponse = await callLLM(mongoPrompt);
     console.log("LLM RAW:", llmResponse);

    llmResponse = llmResponse.replace(/ISODate\("([^"]+)"\)/g, '"$1"');
   llmResponse = llmResponse.replace(/```json|```/g, "").trim();

const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);

if (!jsonMatch) {
  throw new Error("Invalid JSON from LLM");
}

const parsed = JSON.parse(jsonMatch[0]);

   
    parsed.pipeline.forEach((stage) => {
      if (stage.$match) {
        Object.keys(stage.$match).forEach((key) => {
          const val = stage.$match[key];
          if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
            stage.$match[key] = new Date(val);
          }
        });
      }
    });

    const result = await db
      .collection(parsed.collection)
      .aggregate(parsed.pipeline)
      .toArray();
    const highlightNodes = [];
    result.forEach((item) => {
      if (item.salesOrder) highlightNodes.push(`order_${item.salesOrder}`);
      if (item.deliveryDocument)
        highlightNodes.push(`delivery_${item.deliveryDocument}`);
      if (item.billingDocument)
        highlightNodes.push(`invoice_${item.billingDocument}`);
      if (item.customer) highlightNodes.push(`customer_${item.customer}`);
    });

    const finalPrompt = `
Answer in 1 line.

Question: ${query}
Data: ${JSON.stringify(result)}
`;

    const answer = await callLLM(finalPrompt);

    res.json({
      answer,
      data: result,
      highlightNodes,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Error ❌");
  }

  
});

module.exports = router;
