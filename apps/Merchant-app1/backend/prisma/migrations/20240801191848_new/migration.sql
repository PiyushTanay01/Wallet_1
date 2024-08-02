/*
  Warnings:

  - You are about to drop the column `userId` on the `MerchantAccount` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[merchantId]` on the table `MerchantAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `merchantId` to the `MerchantAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MerchantAccount" DROP CONSTRAINT "MerchantAccount_userId_fkey";

-- DropIndex
DROP INDEX "MerchantAccount_userId_key";

-- AlterTable
ALTER TABLE "MerchantAccount" DROP COLUMN "userId",
ADD COLUMN     "merchantId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MerchantAccount_merchantId_key" ON "MerchantAccount"("merchantId");

-- AddForeignKey
ALTER TABLE "MerchantAccount" ADD CONSTRAINT "MerchantAccount_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
