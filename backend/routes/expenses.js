const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/exprensesController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/auth/users/:id/categories', expenseController.getCategory);
router.get('/auth/users/:id/expenses', authenticateToken, expenseController.getUserExpenses);
router.post('/auth/users/:id/expenses', authenticateToken, expenseController.postNewExpense);
router.delete('/auth/users/:id/expenses/:expenseId', authenticateToken, expenseController.deleteExpense);

module.exports = router;