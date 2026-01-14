-- CreateTable
CREATE TABLE "ActiveLogin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logoutAt" TIMESTAMP(3),
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "ActiveLogin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActiveLogin_sessionId_key" ON "ActiveLogin"("sessionId");

-- AddForeignKey
ALTER TABLE "ActiveLogin" ADD CONSTRAINT "ActiveLogin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
