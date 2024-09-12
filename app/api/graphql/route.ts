//import { NextRequest } from 'next/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServer } from '@apollo/server'
//import { gql } from 'graphql-tag';
import { PrismaClient } from '@prisma/client'
import  {prisma}  from '../../../prisma/db'

type Context = {
    prisma: PrismaClient
}

const typeDefs = `#graphql
    type Task {
        id: String
        title: String
        content: String
        updatedAt: String
        createdAt: String
        done: Boolean
      }  

    type User {
        id: ID!
        name: String
        avatar: String
        updatedAt: String
        createdAt: String
        tasks: [Task]
        taskId: String
        }

    type Query {
            # task(id: ID): Task
            tasks: [Task]
        }
    type Query {
            # user (id: ID): user
            users: [User]
        }
`

const resolvers = {
    Query: {
        tasks: async (parent: any, args: any, context: Context) => {
            return await context.prisma.task.findMany()
        },

        users: async (parent: any, args: any, context: Context) => {
            return await context.prisma.user.findMany()
        },
        // tasks: async (parent: any, args: any, context: Context) => {
        //     return await context.prisma.task.findMany({
        //         where: {
        //             id: args.id
        //         }
        //     })
        // },
    },
    // User: {
    //     users: async (parent: any, args: any, context: Context) => {
    //         return await context.prisma.user.findMany()
    //     }
    // },
    // Task: {
    //     tasks: async (parent: any, args: any, context: Context) => {
    //         return await context.prisma.task.findMany()
    //     }
    // }
}



const apolloServer = new ApolloServer<Context>({
    resolvers,
    typeDefs,
})



// const server = new ApolloServer({
//     resolvers,
//     typeDefs,
//   });

//   const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer, {
//     context: async req => ({ req }),
//   })

const handler =  startServerAndCreateNextHandler(apolloServer, {
    context: async (req, res) => ({
        req, res, prisma
    })
})

export { handler as GET, handler as POST }