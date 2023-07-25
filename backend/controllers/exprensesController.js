// controllers/expensesController.js
const Expense = require("../models/expenseModel");
const Category = require('../models/categoryModel');

const getCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve categories', error });
  }
}

const getUserExpenses = async (req, res) => {
  try {
    const userId = req.user;
    const expenses = await Expense.find({ userId: userId });
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching user expenses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const postNewExpense = async (req, res) => {
  try {
    // const userId = req.user._id;
    const {userId, categoryId, description, amount } = req.body;

    // Creazione di una nuova spesa associata all'utente corrente
    console.log('UserID:', userId);
    console.log('CategoryId:', categoryId);
    console.log('Description:', description);
    console.log('Amount:', amount);

    const newExpense = new Expense({
      userId,
      categoryId,
      description,
      amount,
    });

    await newExpense.save();

    res.status(201).json({ message: 'Expense added successfully' });
  } catch (error) {
    console.error('Error adding new expense:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const userId = req.user._id;
    const expenseId = req.params.expenseId;

    // Verifica se l'utente possiede questa spesa
    const expense = await Expense.findOne({ _id: expenseId, user: userId });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await Expense.deleteOne({ _id: expenseId });

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {getCategory, getUserExpenses, postNewExpense, deleteExpense };
