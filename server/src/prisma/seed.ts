import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Health', 'Shopping', 'Other'];

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10, 0, 0, 0);
  return d;
}

async function main(): Promise<void> {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.expense.deleteMany();
  await prisma.budget.deleteMany();

  // Seed budgets
  const budgets = [
    { category: 'Food', monthlyLimit: 8000 },
    { category: 'Transport', monthlyLimit: 3000 },
    { category: 'Bills', monthlyLimit: 5000 },
    { category: 'Entertainment', monthlyLimit: 2000 },
    { category: 'Health', monthlyLimit: 2500 },
    { category: 'Shopping', monthlyLimit: 4000 },
    { category: 'Other', monthlyLimit: 1500 },
  ];

  for (const budget of budgets) {
    await prisma.budget.create({ data: budget });
  }

  // Seed expenses over the past 60 days
  const expenses = [
    { amount: 450, category: 'Food', date: daysAgo(1), note: 'Groceries from BigBasket' },
    { amount: 1200, category: 'Food', date: daysAgo(2), note: 'Dinner at restaurant' },
    { amount: 85, category: 'Transport', date: daysAgo(1), note: 'Ola ride to office' },
    { amount: 2500, category: 'Bills', date: daysAgo(5), note: 'Electricity bill' },
    { amount: 800, category: 'Entertainment', date: daysAgo(3), note: 'Netflix + Spotify' },
    { amount: 350, category: 'Food', date: daysAgo(4), note: 'Weekly vegetables' },
    { amount: 1500, category: 'Health', date: daysAgo(6), note: 'Pharmacy' },
    { amount: 3200, category: 'Shopping', date: daysAgo(7), note: 'Clothes from Myntra' },
    { amount: 600, category: 'Transport', date: daysAgo(8), note: 'Petrol' },
    { amount: 999, category: 'Entertainment', date: daysAgo(9), note: 'Movie tickets (2)' },
    { amount: 280, category: 'Food', date: daysAgo(10), note: 'Swiggy order' },
    { amount: 1800, category: 'Bills', date: daysAgo(12), note: 'Internet bill' },
    { amount: 450, category: 'Food', date: daysAgo(13), note: 'Fruits and snacks' },
    { amount: 2200, category: 'Health', date: daysAgo(15), note: 'Doctor consultation' },
    { amount: 750, category: 'Transport', date: daysAgo(16), note: 'Metro monthly pass' },
    { amount: 5500, category: 'Shopping', date: daysAgo(18), note: 'Electronics accessories' },
    { amount: 320, category: 'Food', date: daysAgo(19), note: 'Coffee and snacks' },
    { amount: 1200, category: 'Other', date: daysAgo(20), note: 'Birthday gift' },
    { amount: 680, category: 'Food', date: daysAgo(21), note: 'Weekend brunch' },
    { amount: 3500, category: 'Bills', date: daysAgo(22), note: 'Mobile recharge annual' },
    { amount: 430, category: 'Entertainment', date: daysAgo(24), note: 'Books' },
    { amount: 900, category: 'Food', date: daysAgo(25), note: 'Party supplies' },
    { amount: 1100, category: 'Transport', date: daysAgo(27), note: 'Cab to airport' },
    { amount: 250, category: 'Food', date: daysAgo(28), note: 'Tea and breakfast' },
    { amount: 2800, category: 'Health', date: daysAgo(30), note: 'Gym membership' },
    { amount: 1600, category: 'Shopping', date: daysAgo(32), note: 'Home decor' },
    { amount: 480, category: 'Food', date: daysAgo(35), note: 'Zomato order' },
    { amount: 700, category: 'Entertainment', date: daysAgo(38), note: 'Gaming subscription' },
    { amount: 1950, category: 'Bills', date: daysAgo(40), note: 'Water and maintenance' },
    { amount: 550, category: 'Other', date: daysAgo(45), note: 'Stationery' },
  ];

  for (const expense of expenses) {
    await prisma.expense.create({ data: expense });
  }

  console.log(`✅ Seeded ${budgets.length} budgets and ${expenses.length} expenses`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
