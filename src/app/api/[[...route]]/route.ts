import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { logger }from 'hono/logger'
import { cors } from "hono/cors";
import { decode, sign, verify } from "hono/jwt";
import * as bcrypt from "bcrypt";

export const runtime = 'edge'

const app = new Hono().basePath('/api')
app.use(logger());
app.use(
	"*",
	cors({
		origin: "*",
	}),
);

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})


export const GET = handle(app)
export const POST = handle(app)