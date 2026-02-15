import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import { execSync } from 'child_process';

// detect --seed flag
const shouldSeed = process.argv.includes('--seed');
// console.log("fffffff", process.argv);
async function dropAllTables() {
  // 🚫 HARD STOP FOR PRODUCTION
  if (process.env.NODE_ENV === 'production') {
    console.error('🚫 DROP TABLES is BLOCKED in PRODUCTION');
    process.exit(1);
  }

  console.log(`⚠️ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('🧨 Dropping all tables...');

  await AppDataSource.initialize();
  console.log('✅ Database connected');

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  // Disable foreign key checks (MySQL)
  await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');

  // 🔥 Drop entity tables
  for (const entity of AppDataSource.entityMetadatas) {
    const tableName = entity.tableName;
    console.log(`🗑 Dropping table: ${tableName}`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`${tableName}\``);
  }

  // 🔥 Drop migrations table
  console.log('🗑 Dropping table: migrations');
  await queryRunner.query('DROP TABLE IF EXISTS `migrations`');

  // Enable FK checks back
  await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');

  await queryRunner.release();
  await AppDataSource.destroy();

  console.log('✅ All tables dropped');

  // 🌱 RUN SEED SCRIPT
  if (shouldSeed) {
    console.log('🌱 Running seeders (npm run seed:all)...');
    execSync('npm run migration:run', { stdio: 'inherit' });
    execSync('npm run seed:all', { stdio: 'inherit' });

  }

  console.log('🎉 migration:fresh completed');
  process.exit(0);
}

dropAllTables().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
