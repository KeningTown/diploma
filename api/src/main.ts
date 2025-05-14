import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { MikroORM } from '@mikro-orm/core'

import { AppModule } from './app.module'

import { InitialDbSeeder } from './seeders/InitialDbSeeder'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const migrator = app.get(MikroORM).getMigrator()
  const executedMigrations = await migrator.getExecutedMigrations()
  const pendingMigrations = await migrator.getPendingMigrations()

  await app.get(MikroORM).getMigrator().up()

  if (!executedMigrations.length && pendingMigrations.length) {
    await app.get(MikroORM).seeder.seed(InitialDbSeeder)
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  await app.listen(process.env.APP_PORT)
}

bootstrap()
