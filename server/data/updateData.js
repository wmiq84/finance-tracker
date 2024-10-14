import fs from 'fs'; 
import data from './data.json' assert { type: 'json' };

const computeMonthlyDataFromDaily = (dailyData) => {
  const monthlyData = {};

  dailyData.forEach((item) => {
    const date = new Date(item.date);
    const month = date.toLocaleString('default', { month: 'long' }).toLowerCase(); 
    const income = parseFloat(item.income.replace('$', '').replace(',', ''));
    const spending = parseFloat(item.spending.replace('$', '').replace(',', ''));

    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, spending: 0 };
    }

    monthlyData[month].income += income;
    monthlyData[month].spending += spending;
  });

  const monthlyArray = Object.keys(monthlyData).map((month) => ({
    month,
    income: `$${monthlyData[month].income.toFixed(2)}`,
    spending: `$${monthlyData[month].spending.toFixed(2)}`,
  }));

  console.log('Monthly Data:', monthlyArray);
  return monthlyArray;
};

const computeByCategory = (spendings) => {
  const incomeByCategory = {};
  const spendingByCategory = {};

  spendings.forEach((spending) => {
    const amount = parseFloat(spending.amount.replace('$', '').replace(',', ''));
    const category = spending.category.toLowerCase();

    if (!incomeByCategory[category]) {
      incomeByCategory[category] = 0;
    }
    if (!spendingByCategory[category]) {
      spendingByCategory[category] = 0;
    }

    incomeByCategory[category] += amount; 
    spendingByCategory[category] += amount; 
  });



  const formattedIncome = Object.keys(incomeByCategory).reduce((acc, key) => {
    acc[key] = `$${incomeByCategory[key].toFixed(2)}`;
    return acc;
  }, {});

  const formattedSpending = Object.keys(spendingByCategory).reduce((acc, key) => {
    acc[key] = `$${spendingByCategory[key].toFixed(2)}`;
    return acc;
  }, {});

  console.log('Income by Category:', formattedIncome);
  console.log('Spending by Category:', formattedSpending);
  return { incomeByCategory: formattedIncome, spendingByCategory: formattedSpending };
};

const updateData = () => {
  const monthlyData = computeMonthlyDataFromDaily(data.kpis[0].dailyData);

  const { incomeByCategory, spendingByCategory } = computeByCategory(data.spendings);

  data.kpis[0].monthlyData = monthlyData;
  data.kpis[0].incomeByCategory = incomeByCategory;
  data.kpis[0].spendingByCategory = spendingByCategory;

  const totalIncome = monthlyData.reduce((sum, month) => sum + parseFloat(month.income.replace('$', '')), 0);
  const totalSpending = monthlyData.reduce((sum, month) => sum + parseFloat(month.spending.replace('$', '')), 0);

  data.kpis[0].totalIncome = `$${totalIncome.toFixed(2)}`;
  data.kpis[0].totalSpending = `$${totalSpending.toFixed(2)}`;

  console.log('Total Income:', data.kpis[0].totalIncome);
  console.log('Total Spending:', data.kpis[0].totalSpending);

  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
};

updateData();
