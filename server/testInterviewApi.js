const testInterviewApi = async () => {
  try {
    console.log("Sending sample resume to interview API...");

    const sampleResumeText = `
      Souvik Das is a software engineering student graduating in 2027.

      Technical skills include JavaScript, React.js, Node.js, Express.js,
      MongoDB, Firebase, C++, Data Structures and Algorithms.

      Projects include PrepAI, an AI-powered interview preparation platform.
      The application allows users to upload PDF resumes, extracts resume
      information, generates personalized interview questions and provides
      interview feedback.

      Another project involved human resource data analysis using Python,
      Pandas, data visualization and machine learning techniques.

      Souvik has experience building responsive frontend applications,
      REST APIs, authentication systems and database-backed applications.
    `;

    const response = await fetch(
      "http://localhost:5000/api/interview/generate-questions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          resumeText: sampleResumeText,
        }),
      }
    );

    const data = await response.json();

    console.log("\nStatus:", response.status);
    console.log("\nComplete response:");
    console.dir(data, {
      depth: null,
    });

    if (!response.ok) {
      throw new Error(
        data.error ||
          data.message ||
          "Interview question generation failed"
      );
    }

    console.log("\nCandidate:", data.interview.candidateName);
    console.log("Target role:", data.interview.targetRole);

    console.log("\nGenerated interview questions:");

    data.interview.questions.forEach((item) => {
      console.log(`\n${item.id}. [${item.category}]`);
      console.log(item.question);
      console.log(`Difficulty: ${item.difficulty}`);
      console.log(`Time: ${item.timeLimit} seconds`);
    });
  } catch (error) {
    console.error("\nTest failed:");
    console.error(error.message);
  }
};

testInterviewApi();