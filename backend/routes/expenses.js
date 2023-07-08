const express = require('express')
const router = express.Router();
const expenseController = require('../controllers/exprensesController')

router.get('/categories', expenseController.getCategory)

router.get('/expenses/:userId', expenseController.getUserExpenses)
router.post('/expenses', expenseController.postNewExpense)
router.delete('/expenses/:expenseId', expenseController.deleteExpense)

module.exports = router
