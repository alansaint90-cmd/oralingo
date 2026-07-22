import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { seedChallenges } from "./challenges.mjs";

const { Pool } = pg;
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const migrationId = "0000_empty_ben_parker";

function shouldSkip() {
  return process.env.SKIP_DB_BOOTSTRAP === "true" || process.env.RUN_DB_BOOTSTRAP === "false";
}

function requiredBootstrap() {
  return process.env.DB_BOOTSTRAP_REQUIRED === "true" || process.env.NODE_ENV === "production";
}

async function tableExists(client, tableName) {
  const result = await client.query("select to_regclass($1) as table_name", [`public.${tableName}`]);
  return Boolean(result.rows[0]?.table_name);
}

async function ensureMigrationTable(client) {
  await client.query(`
    create table if not exists schema_migrations (
      id text primary key,
      applied_at timestamp not null default now()
    )
  `);
}

async function migrationApplied(client) {
  const result = await client.query("select id from schema_migrations where id = $1", [migrationId]);
  return result.rowCount > 0;
}

async function applyInitialMigration(client) {
  await ensureMigrationTable(client);

  if (await migrationApplied(client)) {
    return;
  }

  if (await tableExists(client, "users")) {
    await client.query("insert into schema_migrations (id) values ($1) on conflict (id) do nothing", [migrationId]);
    return;
  }

  const migrationPath = path.join(rootDir, "src", "lib", "db", "migrations", "0000_empty_ben_parker.sql");
  const migrationSql = await readFile(migrationPath, "utf8");
  const statements = migrationSql
    .split("--> statement-breakpoint")
    .map((statement) => statement.trim())
    .filter(Boolean);

  await client.query("begin");
  try {
    for (const statement of statements) {
      await client.query(statement);
    }
    await client.query("insert into schema_migrations (id) values ($1)", [migrationId]);
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  }
}

async function seedInitialChallenges(client) {
  const result = await client.query("select count(*)::int as total from challenges where is_deleted = false");
  if ((result.rows[0]?.total ?? 0) >= seedChallenges.length) {
    return;
  }

  for (const challenge of seedChallenges) {
    await client.query(
      `
        insert into challenges (
          title,
          description,
          instructions,
          category,
          primary_skill,
          difficulty,
          preparation_time,
          speaking_time,
          active,
          modified_by
        )
        select $1, $2, $3, $4, $5, $6, $7, $8, true, null
        where not exists (
          select 1 from challenges
          where title = $1 and category = $4 and is_deleted = false
        )
      `,
      challenge
    );
  }
}

export async function bootstrapDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (shouldSkip()) {
    console.log("[db] Bootstrap ignorado por configuracao.");
    return;
  }

  if (!connectionString) {
    const message = "[db] DATABASE_URL nao configurada.";
    if (requiredBootstrap()) throw new Error(message);
    console.warn(message);
    return;
  }

  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    await applyInitialMigration(client);
    await seedInitialChallenges(client);
    console.log("[db] Banco pronto.");
  } finally {
    client.release();
    await pool.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  bootstrapDatabase().catch((error) => {
    console.error("[db] Falha no bootstrap:", error);
    process.exit(1);
  });
}
