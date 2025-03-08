/*
  Warnings:

  - The `otpGeneratedTime` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `subtitle` on the `blog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `views` on table `blog` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "blog" DROP CONSTRAINT "blog_userId_fkey";

-- AlterTable
ALTER TABLE "blog" ALTER COLUMN "title" SET DATA TYPE TEXT,
DROP COLUMN "subtitle",
ADD COLUMN     "subtitle" TEXT NOT NULL,
ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "views" SET NOT NULL,
ALTER COLUMN "views" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "otpGeneratedTime",
ADD COLUMN     "otpGeneratedTime" INTEGER;

-- DropEnum
DROP TYPE "Subtitle";

-- AddForeignKey
ALTER TABLE "blog" ADD CONSTRAINT "blog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
