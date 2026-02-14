import { db } from "./drizzle";
import * as schema from "./schema";
import { generateSlug } from "../lib/utils";

async function main() {
  const categories = [
    "Electronics",
    "Furniture",
    "Clothing",
    "Books",
    "Kitchen",
    "Home Decor",
    "Sports",
    "Toys",
    "Art",
    "Other",
  ];

  console.log("Seeding categories...");

  for (const name of categories) {
    const slug = generateSlug(name);
    try {
        await db.insert(schema.category).values({
            name,
            slug,
            description: `Category for ${name}`,
        });
        console.log(`Added category: ${name}`);
    } catch (error) {
        console.log(`Category ${name} already exists or failed to add.`);
    }
  }

  console.log("Seeding complete!");
}

main().catch((err) => {
  console.error("Seeding failed:");
  console.error(err);
  process.exit(1);
});
