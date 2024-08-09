import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  spotify_id: text("spotify id"),
  email: text("email"),
  display_name: text("display name"),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
