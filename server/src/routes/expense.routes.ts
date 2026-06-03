import { Router } from 'express';
import { expenseController } from '../controllers/expense.controller';
import { validate } from '../middleware/validate.middleware';
import {
  createExpenseSchema,
  updateExpenseSchema,
  expenseFiltersSchema,
} from '../validators/expense.validator';

const router = Router();

// GET /api/expenses — list with optional filters + pagination
router.get('/', validate(expenseFiltersSchema, 'query'), expenseController.getAll);

// GET /api/expenses/:id — single expense
router.get('/:id', expenseController.getById);

// POST /api/expenses — create new expense
router.post('/', validate(createExpenseSchema), expenseController.create);

// PUT /api/expenses/:id — update expense
router.put('/:id', validate(updateExpenseSchema), expenseController.update);

// DELETE /api/expenses/:id — delete expense
router.delete('/:id', expenseController.delete);

export default router;
