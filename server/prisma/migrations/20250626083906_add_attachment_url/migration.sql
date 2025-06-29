/*
  Warnings:

  - You are about to drop the column `adminComment` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `newSerialNumber` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Request` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_userId_fkey";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "adminComment",
DROP COLUMN "newSerialNumber",
DROP COLUMN "priority";

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
