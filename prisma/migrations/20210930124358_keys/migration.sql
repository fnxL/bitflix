-- CreateTable
CREATE TABLE "keys" (
    "inviteKey" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "keys_inviteKey_key" ON "keys"("inviteKey");
