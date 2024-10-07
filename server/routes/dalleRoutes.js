import express from "express";
import * as dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.route("/").get((req, res) => {
  res.send("Hello from DALL_E!");
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;
    const aiResponse = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const image = aiResponse.data[0].b64_json;

    res.status(200).json({ photo: image });
  } catch (error) {
    console.error(error);

    if (error.error && error.error.code === "billing_hard_limit_reached") {
      res.status(402).json({
        error:
          "OpenAI API usage limit reached. Please try again later or contact the administrator.",
      });
    } else {
      res.status(500).json({
        error:
          "An error occurred while generating the image. Please try again.",
      });
    }
  }
});

export default router;
