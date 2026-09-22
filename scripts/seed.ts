import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { challenges, embeds, questions, quizzes } from "../src/lib/db/schema";

/**
 * Example content so the games are clickable the moment the stack is up.
 * Safe to re-run: it does nothing if a quiz already exists.
 */

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = postgres(url, { max: 1 });
const db = drizzle(sql);

try {
  const existing = await db.select({ id: quizzes.id }).from(quizzes).limit(1);
  if (existing.length > 0) {
    console.log("Database already seeded — nothing to do.");
  } else {
    const [quiz] = await db
      .insert(quizzes)
      .values({
        title: "Warm-up",
        description: "A short example quiz to try the live game out.",
      })
      .returning();

    await db.insert(questions).values([
      {
        quizId: quiz.id,
        position: 0,
        kind: "choice",
        prompt: "Welcher Fluss fließt durch Heilbronn?",
        options: ["Neckar", "Rhein", "Donau", "Main"],
        answers: ["0"],
        timeLimitSeconds: 20,
        points: 1000,
      },
      {
        quizId: quiz.id,
        position: 1,
        kind: "choice",
        prompt: "Wofür steht die Abkürzung 'IoT'?",
        options: [
          "Internet of Things",
          "Input of Text",
          "Index of Tables",
          "Institute of Technology",
        ],
        answers: ["0"],
        timeLimitSeconds: 20,
        points: 1000,
      },
      {
        quizId: quiz.id,
        position: 2,
        kind: "text",
        prompt: "Welche Einheit misst Feinstaub? (Tipp: zwei Buchstaben und eine Zahl)",
        options: [],
        answers: ["PM10", "PM 10", "pm10"],
        timeLimitSeconds: 30,
        points: 1500,
      },
    ]);

    const secondsFromNow = (n: number) => new Date(Date.now() + n * 1000);

    await db.insert(challenges).values([
      {
        slug: "best-hack-photo",
        title: "Bestes Foto der Woche",
        prompt:
          "Ladet ein Foto aus eurer Arbeit hoch. Am Ende stimmen alle über die besten ab.",
        submissionKind: "image",
        submitStartsAt: secondsFromNow(0),
        submitEndsAt: secondsFromNow(120),
        voteStartsAt: secondsFromNow(120),
        voteEndsAt: secondsFromNow(240),
        votesPerTeam: 3,
        pointsPerVote: 100,
      },
      {
        slug: "team-motto",
        title: "Teamspruch",
        prompt: "Ein Satz, der euer Team beschreibt.",
        submissionKind: "text",
        submitStartsAt: secondsFromNow(0),
        submitEndsAt: secondsFromNow(120),
        voteStartsAt: secondsFromNow(120),
        voteEndsAt: secondsFromNow(240),
        votesPerTeam: 2,
        pointsPerVote: 50,
      },
    ]);

    await db.insert(embeds).values([
      {
        slug: "openguessr",
        title: "OpenGuessr",
        description: "Wo auf der Welt seid ihr? Punkte vergibt die Orga von Hand.",
        url: "https://openguessr.com/",
        kind: "OpenGuessr",
        aspectRatio: "16 / 9",
        startsAt: secondsFromNow(-5),
        endsAt: secondsFromNow(500),
      },
    ]);

    console.log("Seeded example quiz, challenges and embed.");
  }
} catch (error) {
  console.error("Seeding failed:", error);
  process.exit(1);
} finally {
  await sql.end();
}
