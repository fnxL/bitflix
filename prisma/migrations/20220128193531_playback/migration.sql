/*
  Warnings:

  - You are about to drop the column `id` on the `Movie` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Movie_id_key";

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "id";
