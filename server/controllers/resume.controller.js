import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const analyzeResume = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    /*
      The frontend sends this using:

      formData.append("company", selectedCompany);
    */
    const company =
      typeof req.body.company === "string" &&
      req.body.company.trim()
        ? req.body.company.trim()
        : "General";

    filePath = req.file.path;

    const fileBuffer = await fs.promises.readFile(filePath);

    const pdfData = new Uint8Array(fileBuffer);

    const pdfDocument = await pdfjsLib.getDocument({
      data: pdfData,
    }).promise;

    let resumeText = "";

    for (
      let pageNumber = 1;
      pageNumber <= pdfDocument.numPages;
      pageNumber++
    ) {
      const page = await pdfDocument.getPage(pageNumber);

      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => item.str || "")
        .join(" ");

      resumeText += `${pageText}\n`;
    }

    const cleanedText = resumeText
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanedText) {
      return res.status(400).json({
        success: false,
        message:
          "No readable text was found. The PDF may be an image or scanned document.",
      });
    }

    console.log("Resume processed successfully");
    console.log("Selected company:", company);
    console.log("Resume file:", req.file.originalname);
    console.log("Total pages:", pdfDocument.numPages);

    return res.status(200).json({
      success: true,
      message: "Resume processed successfully",

      fileName: req.file.originalname,
      totalPages: pdfDocument.numPages,

      company,
      selectedCompany: company,

      resumeText: cleanedText,
    });
  } catch (error) {
    console.error("Resume processing error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process the resume",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  } finally {
    if (filePath) {
      try {
        await fs.promises.unlink(filePath);

        console.log(
          "Temporary resume file deleted successfully"
        );
      } catch (deleteError) {
        console.error(
          "Could not delete temporary file:",
          deleteError.message
        );
      }
    }
  }
};