import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express'
import * as AdminJSPrisma from '@adminjs/prisma'
import { prisma } from '@onu/prisma'
import { DMMFClass } from '@prisma/client/runtime'
import * as dotenv from 'dotenv';

dotenv.config()

AdminJS.registerAdapter({
  Resource: AdminJSPrisma.Resource,
  Database: AdminJSPrisma.Database,
})

const PORT = 3000

const start = async () => {
  const app = express()

  const GlobalNavigation = {
    name: 'Global'
  }

  const DiscordNavigation = {
    name: 'Discord'
  }


  const dmmf = ((prisma as any)._baseDmmf as DMMFClass)
  const adminOptions = {
    // We pass Publisher to `resources`
    resources: [
      {
        resource: { model: dmmf.modelMap["Community"], client: prisma },
        options: {
          navigation: GlobalNavigation
        },
      },
      {
        resource: { model: dmmf.modelMap["DiscordGuild"], client: prisma },
        options: {
          navigation: DiscordNavigation
        },
      },
      {
        resource: { model: dmmf.modelMap["DiscordUser"], client: prisma },
        options: {
          navigation: DiscordNavigation
        },
      },
      {
        resource: { model: dmmf.modelMap["User"], client: prisma },
        options: {
          navigation: GlobalNavigation
        },
      },
      {
        resource: { model: dmmf.modelMap["Member"], client: prisma },
        options: {
          navigation: GlobalNavigation
        },
      },
      {
        resource: { model: dmmf.modelMap["DiscordMember"], client: prisma },
        options: {
          navigation: DiscordNavigation
        },
      },
      {
        resource: { model: dmmf.modelMap["User"], client: prisma },
        options: {
          navigation: GlobalNavigation
        },
      },
      {
        resource: { model: dmmf.modelMap["DiscordWelcomeThread"], client: prisma },
        options: {
          navigation: DiscordNavigation
        },
      },
      {
        resource: { model: dmmf.modelMap["DiscordWelcomeThreadWelcomers"], client: prisma },
        options: {
          navigation: DiscordNavigation
        },
      },
      {
        resource: { model: dmmf.modelMap["Account"], client: prisma },
        options: {
          navigation: GlobalNavigation
        },
      } 
    ],
  }

  const admin = new AdminJS(adminOptions)

  const adminRouter = AdminJSExpress.buildRouter(admin)
  app.use(admin.options.rootPath, adminRouter)

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
  })
}

start()