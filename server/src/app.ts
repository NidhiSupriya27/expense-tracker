import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import expenseRoutes from './routes/expense.routes';
import { summaryRouter, budgetRouter } from './routes/summary.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT ?? 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/expenses', expenseRoutes);
app.use('/api/summary', summaryRouter);
app.use('/api/budgets', budgetRouter);

// Health check for Render / Railway
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Error handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV ?? 'development'}`);
});

export default app;
