-- CreateTable
CREATE TABLE "RefreshToken" (
    "token" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");
