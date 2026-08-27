import { config } from 'dotenv';
config();

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaMariaDb(databaseUrl);
const prisma = new PrismaClient({ adapter });

async function fixBalances() {
  console.log('Starting balance fix...');

  const bankAccounts = await prisma.bankAccount.findMany({
    include: {
      deposits: true,
      transfers: true,
    },
  });

  for (const account of bankAccounts) {
    const startBalance = Number(account.startBalance) || 0;
    
    const totalDeposits = account.deposits.reduce((sum, deposit) => {
      return sum + (Number(deposit.amount) || 0);
    }, 0);

    const totalTransfers = account.transfers.reduce((sum, transfer) => {
      return sum + (Number(transfer.amount) || 0);
    }, 0);

    const correctBalance = startBalance + totalDeposits - totalTransfers;

    console.log(`\n${account.bankName} - ${account.accountName}`);
    console.log(`  Start Balance: ${startBalance}`);
    console.log(`  Total Deposits: ${totalDeposits}`);
    console.log(`  Total Transfers: ${totalTransfers}`);
    console.log(`  Current Balance in DB: ${Number(account.balance)}`);
    console.log(`  Correct Balance: ${correctBalance}`);

    if (Number(account.balance) !== correctBalance) {
      await prisma.bankAccount.update({
        where: { id: account.id },
        data: { balance: correctBalance },
      });
      console.log(`  ✅ Updated balance to ${correctBalance}`);
    } else {
      console.log(`  ✅ Balance is already correct`);
    }
  }

  console.log('\n✅ Balance fix complete!');
}

fixBalances()
  .catch((e) => {
    console.error('Error fixing balances:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
