import jsPDF from "jspdf";

/**
 * Premium PrepAI interview report generator.
 *
 * Install:
 *   npm install jspdf
 *
 * Usage:
 *   import { downloadInterviewReport } from "../utils/generateInterviewPdf";
 *
 *   downloadInterviewReport({
 *     result: interviewResult,
 *     session: interviewSession,
 *   });
 */

const PAGE = {
  width: 210,
  height: 297,
  marginX: 16,
  top: 18,
  bottom: 18,
};

const COLORS = {
  navy: [15, 23, 42],
  blue: [37, 99, 235],
  blueSoft: [239, 246, 255],
  slate: [71, 85, 105],
  muted: [100, 116, 139],
  light: [241, 245, 249],
  border: [226, 232, 240],
  white: [255, 255, 255],
  green: [22, 163, 74],
  greenSoft: [240, 253, 244],
  amber: [217, 119, 6],
  amberSoft: [255, 251, 235],
  red: [220, 38, 38],
  redSoft: [254, 242, 242],
};

const clamp = (value, min = 0, max = 100) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return min;
  }

  return Math.min(max, Math.max(min, Math.round(number)));
};

const safeText = (value, fallback = "") => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ");
  }

  if (typeof value === "object") {
    return fallback;
  }

  return String(value).trim() || fallback;
};

const normalizeList = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item.trim();
        }

        if (item && typeof item === "object") {
          return safeText(
            item.text ||
              item.title ||
              item.point ||
              item.feedback ||
              item.message
          );
        }

        return "";
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\n|•|;/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const formatDate = (value) => {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const scoreStyle = (score) => {
  if (score >= 75) {
    return {
      text: COLORS.green,
      fill: COLORS.greenSoft,
      label: "Strong",
    };
  }

  if (score >= 50) {
    return {
      text: COLORS.amber,
      fill: COLORS.amberSoft,
      label: "Developing",
    };
  }

  return {
    text: COLORS.red,
    fill: COLORS.redSoft,
    label: "Needs work",
  };
};

const normalizeQuestionAnalysis = (result = {}, session = {}) => {
  const source =
    result.questionAnalysis ||
    result.questionBreakdown ||
    result.questions ||
    session.answers ||
    [];

  if (!Array.isArray(source)) {
    return [];
  }

  return source.map((item, index) => ({
    questionNumber:
      item.questionNumber ||
      item.number ||
      index + 1,
    category: safeText(item.category, "General"),
    question: safeText(
      item.question ||
        item.questionText ||
        item.prompt,
      `Question ${index + 1}`
    ),
    score: clamp(
      item.score ??
        item.validationScore ??
        item.rating ??
        0
    ),
    feedback: safeText(
      item.feedback ||
        item.validationFeedback ||
        item.aiFeedback ||
        item.comment,
      "No detailed feedback was generated for this question."
    ),
    missingPoints: normalizeList(
      item.missingPoints ||
        item.improvements ||
        item.suggestions
    ),
  }));
};

const getMetrics = (result = {}) => [
  {
    label: "Communication",
    value: clamp(result.communication),
  },
  {
    label: "Technical knowledge",
    value: clamp(
      result.technicalKnowledge ??
        result.technical
    ),
  },
  {
    label: "Confidence",
    value: clamp(result.confidence),
  },
  {
    label: "Grammar",
    value: clamp(result.grammar),
  },
  {
    label: "Problem solving",
    value: clamp(
      result.problemSolving ??
        result.problem_solving
    ),
  },
];

export const downloadInterviewReport = ({
  result = {},
  session = {},
} = {}) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const contentWidth =
    PAGE.width - PAGE.marginX * 2;

  let y = PAGE.top;
  let pageNumber = 1;

  const setText = (color) => {
    doc.setTextColor(...color);
  };

  const setFill = (color) => {
    doc.setFillColor(...color);
  };

  const setDraw = (color) => {
    doc.setDrawColor(...color);
  };

  const drawPageFooter = () => {
    setDraw(COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(
      PAGE.marginX,
      PAGE.height - 12,
      PAGE.width - PAGE.marginX,
      PAGE.height - 12
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setText(COLORS.muted);

    doc.text(
      "Generated by PrepAI",
      PAGE.marginX,
      PAGE.height - 7
    );

    doc.text(
      `Page ${pageNumber}`,
      PAGE.width - PAGE.marginX,
      PAGE.height - 7,
      { align: "right" }
    );
  };

  const addPage = () => {
    drawPageFooter();
    doc.addPage();
    pageNumber += 1;
    y = PAGE.top;
  };

  const ensureSpace = (heightNeeded) => {
    const usableBottom =
      PAGE.height - PAGE.bottom - 4;

    if (y + heightNeeded > usableBottom) {
      addPage();
      return true;
    }

    return false;
  };

  const writeWrapped = ({
    text,
    x,
    top,
    width,
    fontSize = 10,
    fontStyle = "normal",
    color = COLORS.slate,
    lineHeight = 5,
  }) => {
    const value = safeText(text);

    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    setText(color);

    const lines = doc.splitTextToSize(
      value,
      width
    );

    doc.text(lines, x, top, {
      baseline: "top",
      lineHeightFactor:
        lineHeight / fontSize,
    });

    return lines.length * lineHeight;
  };

  const drawSectionTitle = (title) => {
    ensureSpace(18);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    setText(COLORS.navy);
    doc.text(title, PAGE.marginX, y);

    setFill(COLORS.blue);
    doc.roundedRect(
      PAGE.marginX,
      y + 4,
      22,
      1.4,
      0.7,
      0.7,
      "F"
    );

    y += 13;
  };

  const drawBulletList = ({
    title,
    items,
    positive = true,
  }) => {
    if (!items.length) return;

    const cardFill = positive
      ? COLORS.greenSoft
      : COLORS.amberSoft;
    const accent = positive
      ? COLORS.green
      : COLORS.amber;

    const lineWidth = contentWidth - 18;

    const measured = items.map((item) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);

      return doc.splitTextToSize(
        safeText(item),
        lineWidth
      );
    });

    const height =
      16 +
      measured.reduce(
        (sum, lines) =>
          sum + Math.max(7, lines.length * 4.6),
        0
      ) +
      6;

    ensureSpace(height + 5);

    setFill(cardFill);
    setDraw(COLORS.border);
    doc.roundedRect(
      PAGE.marginX,
      y,
      contentWidth,
      height,
      4,
      4,
      "FD"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    setText(accent);
    doc.text(title, PAGE.marginX + 6, y + 9);

    let listY = y + 16;

    measured.forEach((lines) => {
      setFill(accent);
      doc.circle(
        PAGE.marginX + 7,
        listY - 1.3,
        1.1,
        "F"
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      setText(COLORS.slate);
      doc.text(
        lines,
        PAGE.marginX + 12,
        listY,
        {
          baseline: "top",
          lineHeightFactor: 1.35,
        }
      );

      listY += Math.max(
        7,
        lines.length * 4.6
      );
    });

    y += height + 6;
  };

  const candidateName = safeText(
    session.candidateName ||
      result.candidateName,
    "Candidate"
  );

  const targetRole = safeText(
    session.targetRole ||
      result.targetRole,
    "Software Developer"
  );

  const company = safeText(
    session.company ||
      session.selectedCompany ||
      result.company,
    "General"
  );

  const interviewerName = safeText(
    session.interviewerName ||
      session.interviewer?.name,
    "AI Interviewer"
  );

  const completedAt =
    session.completedAt ||
    result.completedAt ||
    new Date().toISOString();

  const overallScore = clamp(
    result.overallScore ??
      result.score ??
      result.totalScore
  );

  const performanceLabel = safeText(
    result.performanceLabel,
    overallScore >= 90
      ? "Outstanding performance"
      : overallScore >= 75
      ? "Strong performance"
      : overallScore >= 60
      ? "Good foundation"
      : "Needs improvement"
  );

  const strengths = normalizeList(
    result.strengths
  );

  const weaknesses = normalizeList(
    result.weaknesses ||
      result.improvements
  );

  const questionAnalysis =
    normalizeQuestionAnalysis(
      result,
      session
    );

  const metrics = getMetrics(result);

  // COVER / SUMMARY HEADER
  setFill(COLORS.navy);
  doc.roundedRect(
    0,
    0,
    PAGE.width,
    76,
    0,
    0,
    "F"
  );

  setFill(COLORS.blue);
  doc.circle(186, 15, 22, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  setText([147, 197, 253]);
  doc.text("PREPAI", PAGE.marginX, 18);

  doc.setFontSize(25);
  setText(COLORS.white);
  doc.text(
    "Interview Performance Report",
    PAGE.marginX,
    34
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  setText([203, 213, 225]);
  doc.text(
    `${company} · ${targetRole}`,
    PAGE.marginX,
    44
  );

  doc.text(
    `Generated on ${formatDate(completedAt)}`,
    PAGE.marginX,
    52
  );

  // score circle
  setFill(COLORS.white);
  doc.circle(172, 45, 20, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  setText(COLORS.blue);
  doc.text(
    String(overallScore),
    172,
    43,
    { align: "center" }
  );

  doc.setFontSize(8);
  setText(COLORS.slate);
  doc.text("/100", 172, 50, {
    align: "center",
  });

  y = 88;

  // Candidate details
  setFill(COLORS.white);
  setDraw(COLORS.border);
  doc.roundedRect(
    PAGE.marginX,
    y,
    contentWidth,
    42,
    5,
    5,
    "FD"
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  setText(COLORS.navy);
  doc.text(candidateName, PAGE.marginX + 7, y + 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setText(COLORS.muted);
  doc.text(targetRole, PAGE.marginX + 7, y + 18);

  const detailColumns = [
    ["Company", company],
    ["Interviewer", interviewerName],
    ["Status", performanceLabel],
  ];

  detailColumns.forEach(
    ([label, value], index) => {
      const columnWidth =
        (contentWidth - 14) / 3;
      const x =
        PAGE.marginX +
        7 +
        index * columnWidth;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      setText(COLORS.muted);
      doc.text(
        label.toUpperCase(),
        x,
        y + 29
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      setText(COLORS.navy);

      const lines = doc.splitTextToSize(
        value,
        columnWidth - 5
      );

      doc.text(lines.slice(0, 2), x, y + 35);
    }
  );

  y += 52;

  drawSectionTitle("Performance overview");

  const metricGap = 4;
  const cardWidth =
    (contentWidth - metricGap * 2) / 3;

  metrics.slice(0, 3).forEach(
    (metric, index) => {
      const x =
        PAGE.marginX +
        index * (cardWidth + metricGap);

      setFill(COLORS.light);
      setDraw(COLORS.border);
      doc.roundedRect(
        x,
        y,
        cardWidth,
        30,
        4,
        4,
        "FD"
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.8);
      setText(COLORS.muted);

      const labelLines =
        doc.splitTextToSize(
          metric.label,
          cardWidth - 8
        );

      doc.text(
        labelLines,
        x + 5,
        y + 8
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      setText(COLORS.navy);
      doc.text(
        `${metric.value}%`,
        x + 5,
        y + 23
      );

      setFill(COLORS.border);
      doc.roundedRect(
        x + 5,
        y + 26,
        cardWidth - 10,
        1.8,
        0.9,
        0.9,
        "F"
      );

      setFill(COLORS.blue);
      doc.roundedRect(
        x + 5,
        y + 26,
        ((cardWidth - 10) *
          metric.value) /
          100,
        1.8,
        0.9,
        0.9,
        "F"
      );
    }
  );

  y += 36;

  metrics.slice(3).forEach(
    (metric, index) => {
      const halfWidth =
        (contentWidth - metricGap) / 2;
      const x =
        PAGE.marginX +
        index * (halfWidth + metricGap);

      setFill(COLORS.light);
      setDraw(COLORS.border);
      doc.roundedRect(
        x,
        y,
        halfWidth,
        25,
        4,
        4,
        "FD"
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.2);
      setText(COLORS.muted);
      doc.text(
        metric.label,
        x + 5,
        y + 8
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      setText(COLORS.navy);
      doc.text(
        `${metric.value}%`,
        x + 5,
        y + 18
      );

      setFill(COLORS.border);
      doc.roundedRect(
        x + 38,
        y + 12,
        halfWidth - 44,
        2,
        1,
        1,
        "F"
      );

      setFill(COLORS.blue);
      doc.roundedRect(
        x + 38,
        y + 12,
        ((halfWidth - 44) *
          metric.value) /
          100,
        2,
        1,
        1,
        "F"
      );
    }
  );

  y += 34;

  drawBulletList({
    title: "Key strengths",
    items:
      strengths.length > 0
        ? strengths
        : [
            "Completed the interview and demonstrated a foundation to build on.",
          ],
    positive: true,
  });

  drawBulletList({
    title: "Priority improvements",
    items:
      weaknesses.length > 0
        ? weaknesses
        : [
            "Add more specific examples, technical depth, and measurable outcomes.",
          ],
    positive: false,
  });

  // QUESTION ANALYSIS
  addPage();
  drawSectionTitle("Question analysis");

  if (questionAnalysis.length === 0) {
    writeWrapped({
      text:
        "No question-level analysis was available in the interview result.",
      x: PAGE.marginX,
      top: y,
      width: contentWidth,
      fontSize: 10,
      color: COLORS.muted,
      lineHeight: 5,
    });

    y += 12;
  }

  questionAnalysis.forEach(
    (item, index) => {
      /*
        jsPDF uses the currently active font and font size while
        calculating splitTextToSize(). The question is rendered
        at 10.5pt bold, so activate that exact style before wrapping.
        This prevents long questions from overflowing the card.
      */
      const questionTextWidth =
        contentWidth - 14;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);

      const questionLines =
        doc.splitTextToSize(
          safeText(
            item.question,
            "Interview question"
          ),
          questionTextWidth
        );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      const feedbackLines =
        doc.splitTextToSize(
          safeText(
            item.feedback,
            "Your answer was evaluated successfully."
          ),
          contentWidth - 22
        );

      const missingLines =
        item.missingPoints.map((point) => {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);

          return doc.splitTextToSize(
            safeText(point),
            contentWidth - 28
          );
        });

      const missingHeight =
        missingLines.length > 0
          ? 12 +
            missingLines.reduce(
              (sum, lines) =>
                sum +
                Math.max(
                  6,
                  lines.length * 4.5
                ),
              0
            )
          : 0;

      const questionBlockHeight =
        questionLines.length * 5.7;

      const feedbackTextHeight =
        feedbackLines.length * 4.8;

      const cardHeight =
        20 +
        questionBlockHeight +
        10 +
        feedbackTextHeight +
        missingHeight +
        12;

      if (
        cardHeight >
        PAGE.height -
          PAGE.top -
          PAGE.bottom -
          8
      ) {
        // Very long content: allow it to flow as separate blocks.
        ensureSpace(32);
      } else {
        ensureSpace(cardHeight + 7);
      }

      const style = scoreStyle(item.score);

      setFill(COLORS.white);
      setDraw(COLORS.border);
      doc.setLineWidth(0.4);
      doc.roundedRect(
        PAGE.marginX,
        y,
        contentWidth,
        cardHeight,
        5,
        5,
        "FD"
      );

      // Q badge
      setFill(COLORS.blue);
      doc.roundedRect(
        PAGE.marginX + 6,
        y + 7,
        15,
        10,
        3,
        3,
        "F"
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      setText(COLORS.white);
      doc.text(
        `Q${item.questionNumber || index + 1}`,
        PAGE.marginX + 13.5,
        y + 13.4,
        { align: "center" }
      );

      // Category
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setText(COLORS.muted);
      doc.text(
        item.category,
        PAGE.marginX + 25,
        y + 13.5
      );

      // Score badge
      setFill(style.fill);
      doc.roundedRect(
        PAGE.width -
          PAGE.marginX -
          31,
        y + 7,
        25,
        10,
        3,
        3,
        "F"
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      setText(style.text);
      doc.text(
        `${item.score}/100`,
        PAGE.width -
          PAGE.marginX -
          18.5,
        y + 13.5,
        { align: "center" }
      );

      let innerY = y + 24;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      setText(COLORS.navy);
      doc.text(
        questionLines,
        PAGE.marginX + 7,
        innerY,
        {
          baseline: "top",
          lineHeightFactor: 1.35,
          maxWidth: questionTextWidth,
        }
      );

      innerY +=
        questionBlockHeight + 5;

      // Feedback area
      setFill(COLORS.blueSoft);

      const feedbackBoxHeight =
        12 +
        feedbackTextHeight;

      doc.roundedRect(
        PAGE.marginX + 6,
        innerY,
        contentWidth - 12,
        feedbackBoxHeight,
        3,
        3,
        "F"
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      setText(COLORS.blue);
      doc.text(
        "AI FEEDBACK",
        PAGE.marginX + 11,
        innerY + 7
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setText(COLORS.slate);
      doc.text(
        feedbackLines,
        PAGE.marginX + 11,
        innerY + 12,
        {
          baseline: "top",
          lineHeightFactor: 1.35,
          maxWidth: contentWidth - 22,
        }
      );

      innerY += feedbackBoxHeight + 5;

      if (missingLines.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        setText(COLORS.amber);
        doc.text(
          "HOW TO IMPROVE",
          PAGE.marginX + 7,
          innerY + 3
        );

        innerY += 8;

        missingLines.forEach((lines) => {
          setFill(COLORS.amber);
          doc.circle(
            PAGE.marginX + 9,
            innerY - 1.1,
            1,
            "F"
          );

          doc.setFont(
            "helvetica",
            "normal"
          );
          doc.setFontSize(9);
          setText(COLORS.slate);
          doc.text(
            lines,
            PAGE.marginX + 14,
            innerY,
            {
              baseline: "top",
              lineHeightFactor: 1.3,
            }
          );

          innerY += Math.max(
            6,
            lines.length * 4.5
          );
        });
      }

      y += cardHeight + 7;
    }
  );

  // Recommendation
  const recommendationTitle = safeText(
    result.recommendationTitle,
    "Recommended next step"
  );

  const recommendation = safeText(
    result.recommendation,
    "Structure every answer clearly, explain your decisions, and support your points with specific examples and measurable outcomes."
  );

  const recommendationLines =
    doc.splitTextToSize(
      recommendation,
      contentWidth - 14
    );

  const recommendationHeight =
    20 +
    recommendationLines.length * 4.8;

  ensureSpace(recommendationHeight + 10);

  drawSectionTitle("Final recommendation");

  setFill(COLORS.navy);
  doc.roundedRect(
    PAGE.marginX,
    y,
    contentWidth,
    recommendationHeight,
    5,
    5,
    "F"
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  setText(COLORS.white);
  doc.text(
    recommendationTitle,
    PAGE.marginX + 7,
    y + 10
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  setText([203, 213, 225]);
  doc.text(
    recommendationLines,
    PAGE.marginX + 7,
    y + 17,
    {
      baseline: "top",
      lineHeightFactor: 1.4,
    }
  );

  y += recommendationHeight + 8;

  drawPageFooter();

  const sanitizedName = candidateName
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  doc.save(
    `PrepAI-${sanitizedName || "Candidate"}-Interview-Report.pdf`
  );
};

export default downloadInterviewReport;
