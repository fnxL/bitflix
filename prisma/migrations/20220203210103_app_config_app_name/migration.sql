/*
  Warnings:

  - A unique constraint covering the columns `[appName]` on the table `AppConfig` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appName` to the `AppConfig` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AppConfig_latestVersion_key";

-- AlterTable
ALTER TABLE "AppConfig" ADD COLUMN     "appName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AppConfig_appName_key" ON "AppConfig"("appName");
