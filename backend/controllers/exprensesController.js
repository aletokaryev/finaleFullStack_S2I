const Expense = require('../models/expenseModel');
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
    const userId = req.params.userId;

    const expenses = await Expense.find({ userId });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve expenses' });
  }
}

const postNewExpense = async (req, res) => {
  try {
    const { userId, categoryId, description, amount } = req.body;

    const category = await Category.findOne({ _id: categoryId });
    if (!category) {
      return res.status(404).json({ message: 'Category not found [server]' + category});
    }

    const expense = new Expense({
      userId,
      description,
      categoryId: category._id,
      amount
    });

    await expense.save();
    res.status(201).json({ message: 'Expense added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add expense [server]', error });
  }
}

const deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;

    await Expense.findByIdAndDelete(expenseId);
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete expense [server]', error });
  }
}

module.exports = { getCategory, getUserExpenses, postNewExpense, deleteExpense };
