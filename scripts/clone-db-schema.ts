const { Client } = require('pg');

async function cloneSchema() {
  // Працюємо тільки на Preview-деплоях у Vercel
  if (process.env.VERCEL_ENV !== 'preview') {
    console.log('Skipping schema clone: Not a Vercel Preview environment.');
    return;
  }

  const baseUrl = process.env.DATABASE_URL;
  if (!baseUrl) {
    console.error('DATABASE_URL is missing!');
    process.exit(1);
  }

  const branchName = process.env.VERCEL_GIT_COMMIT_REF || 'preview';
  const targetSchema = `pr_${branchName.replace(/[^a-zA-Z0-9_]/g, '_')}`;

  const client = new Client({ connectionString: baseUrl });
  await client.connect();

  try {
    console.log(`Checking if target schema "${targetSchema}" exists...`);
    
    const res = await client.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`,
      [targetSchema]
    );

    if (res.rows.length === 0) {
      console.log(`Creating schema "${targetSchema}" and copying tables/data from "public"...`);
      
      await client.query(`CREATE SCHEMA "${targetSchema}";`);

      const tablesRes = await client.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`
      );

      for (const row of tablesRes.rows) {
        const table = row.table_name;
        await client.query(
          `CREATE TABLE "${targetSchema}"."${table}" (LIKE "public" ."${table}" INCLUDING ALL);`
        );
        await client.query(
          `INSERT INTO "${targetSchema}"."${table}" SELECT * FROM "public"."${table}";` 
        );
      }

      console.log(`Successfully cloned "public" schema to "${targetSchema}"!`);
    } else {
      console.log(`Schema "${targetSchema}" already exists. Skipping data copy.`);
    }
  } catch (err) {
    console.error('Error while cloning schema:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

cloneSchema();