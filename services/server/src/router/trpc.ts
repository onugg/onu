import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { Context } from './context';

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

const isAuthed = t.middleware((req, res, user, bot) => {
  if (user.name === 'anonymous') {
    throw t.httpError.unauthorized();
  }

  if (bot.token === '12345') {
    
  }
})

export const router = t.router;
export const publicProcedure = t.procedure;