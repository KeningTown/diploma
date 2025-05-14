import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql'
import { EntityGenerator } from '@mikro-orm/entity-generator'
import { Migrator } from '@mikro-orm/migrations'
import { SeedManager } from '@mikro-orm/seeder'

export default defineConfig({
  migrations: {
    path: 'dist/src/migrations',
    pathTs: 'src/migrations'
  },
  seeder: {
    path: 'dist/src/seeders',
    pathTs: 'src/seeders'
  },
  driver: PostgreSqlDriver,
  extensions: [EntityGenerator, Migrator, SeedManager],
  entities: ['dist/src/modules/**/*.entity.js'],
  entitiesTs: ['src/modules/**/*.entity.ts'],
  debug: true,
  forceUtcTimezone: true
})
