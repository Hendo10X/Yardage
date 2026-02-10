import { db } from "./drizzle";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

async function main() {
  const universities = [
    { name: "Federal University of Technology Owerri", domain: "futo.edu.ng" },
    { name: "University of Lagos", domain: "unilag.edu.ng" },
  ];

  console.log("Seeding whitelisted universities...");

  for (const uni of universities) {
    const existing = await db
      .select()
      .from(schema.universityWhitelist)
      .where(eq(schema.universityWhitelist.domain, uni.domain))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(schema.universityWhitelist).values(uni);
      console.log(`Added ${uni.name} (${uni.domain})`);
    } else {
      console.log(`${uni.name} (${uni.domain}) already exists.`);
    }
  }

  console.log("Seeding complete!");
}

main().catch((err) => {
  console.error("Seeding failed:");
  console.error(err);
  process.exit(1);
});
