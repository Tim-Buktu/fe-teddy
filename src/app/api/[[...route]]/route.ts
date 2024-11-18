import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { sign, verify } from "hono/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaClient } from "../../../../prisma/generated/client";

const prisma = new PrismaClient();

export const runtime = "nodejs";

const app = new Hono().basePath("/api");
app.use(logger());
app.use(
  "*",
  cors({
    origin: "*",
  })
);
app.get("/", (c) => {
  return c.json({
    message: "Connected to the API",
  });
});
app.post("/register", async (c) => {
  const { email, password } = await c.req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  const payload = {
    sub: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  };
  const token = await sign(payload, "secret");

  return c.json({
    token,
  });
});

app.post("/login", async (c) => {
  const { email, password } = await c.req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return c.json({ error: "Invalid password" }, 401);
  }

  const payload = {
    sub: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  };
  const token = await sign(payload, "secret");

  return c.json({
    token,
  });
});

app.get("/state", async (c) => {
  const token = c.req.query("token");

  console.log(token);

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const payload = await verify(token, "secret");

  console.log(payload);

  const user = await prisma.user.findFirst({
    where: { id: payload.sub as string },
  });

  console.log(user);

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return c.json({
    user,
  });
});

app.post("/state", async (c) => {
  const token = c.req.query("token");
  const { health, apples, laughter, medicine, coins } = await c.req.json();

  console.log(token, health, apples, laughter, medicine, coins);

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const payload = await verify(token, "secret");

  console.log(payload);

  const user = await prisma.user.findFirst({
    where: { id: payload.sub as string },
  });

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      health,
      apples,
      laughter,
      medicine,
      coins,
    },
  });

  return c.json({
    success: true,
  });
});

export const GET = handle(app);
export const POST = handle(app);
