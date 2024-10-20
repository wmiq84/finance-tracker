import fs from 'fs';
import mongoose from 'mongoose';
import Income from '../models/Income.js';
import Spending from '../models/Spending.js';
import KPI from '../models/KPI.js';
import dotenv from 'dotenv';

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fetchDataFromDb = async () => {
  const incomes = await Income.find();
  const spendings = await Spending.find();
  return { incomes, spendings };
};

const computeMonthlyDataFromTransactions = (incomes, spendings) => {
  const monthlyData = {};

  incomes.forEach((item) => {
    const date = new Date(item.date);
    const month = date.toLocaleString('default', { month: 'long' }).toLowerCase();
    const income = item.amount;

    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, spending: 0 };
    }

    monthlyData[month].income += income;
  });

  spendings.forEach((item) => {
    const date = new Date(item.date);
    const month = date.toLocaleString('default', { month: 'long' }).toLowerCase();
    const spending = item.amount;

    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, spending: 0 };
    }

    monthlyData[month].spending += spending;
  });

  let runningNetWorth = 0;
  const monthlyArray = Object.keys(monthlyData).map((month) => {
	const income = parseFloat(monthlyData[month].income);
	const spending = parseFloat(monthlyData[month].spending);
  
	// Calculate net as a number (income minus spending)
	const net = income - spending;
  
	// Accumulate running net worth, which can be positive or negative
	runningNetWorth += net;
    return {
      month,
      income: `$${monthlyData[month].income.toFixed(2)}`,
      spending: `$${monthlyData[month].spending.toFixed(2)}`,
      net: `$${net.toFixed(2)}`,
      runningNetWorth: runningNetWorth.toFixed(2),
    };
  });

  console.log('Monthly Data:', monthlyArray);
  return monthlyArray;
};

const computeByCategory = (incomes, spendings) => {
  const incomeByCategory = {};
  const spendingByCategory = {};

  incomes.forEach((income) => {
    const amount = income.amount;
    const category = income.category.toLowerCase();

    if (!incomeByCategory[category]) {
      incomeByCategory[category] = 0;
    }
    incomeByCategory[category] += amount;
  });

  spendings.forEach((spending) => {
    const amount = spending.amount;
    const category = spending.category.toLowerCase();

    if (!spendingByCategory[category]) {
      spendingByCategory[category] = 0;
    }

    spendingByCategory[category] += amount;
  });

  const formattedIncome = Object.keys(incomeByCategory).reduce((acc, key) => {
    acc[key] = `$${incomeByCategory[key].toFixed(2)}`;
    return acc;
  }, {});

  const formattedSpending = Object.keys(spendingByCategory).reduce(
    (acc, key) => {
      acc[key] = `$${spendingByCategory[key].toFixed(2)}`;
      return acc;
    },
    {}
  );

  console.log('Income by Category:', formattedIncome);
  console.log('Spending by Category:', formattedSpending);
  return {
    incomeByCategory: formattedIncome,
    spendingByCategory: formattedSpending,
  };
};

const updateData = async () => {
  const { incomes, spendings } = await fetchDataFromDb();

  const monthlyData = computeMonthlyDataFromTransactions(incomes, spendings);

  const { incomeByCategory, spendingByCategory } = computeByCategory(incomes, spendings);

  const totalIncome = monthlyData.reduce(
    (sum, month) => sum + parseFloat(month.income.replace('$', '')),
    0
  );
  const totalSpending = monthlyData.reduce(
    (sum, month) => sum + parseFloat(month.spending.replace('$', '')),
    0
  );

  // Find the KPI document in MongoDB
  const kpi = await KPI.findOne(); // Assuming there's only one KPI document

  if (kpi) {
    kpi.monthlyData = monthlyData;
    kpi.incomeByCategory = incomeByCategory;
    kpi.spendingByCategory = spendingByCategory;
    kpi.totalIncome = totalIncome;
    kpi.totalSpending = totalSpending;

    // Save the updated KPI document to MongoDB
    await kpi.save();
    console.log('KPI data updated in MongoDB');
  } else {
    console.error('No KPI document found to update');
  }

  console.log('Data updated successfully');
};

updateData();
