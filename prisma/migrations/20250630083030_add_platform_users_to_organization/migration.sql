-- CreateTable
CREATE TABLE "platform_users" (
    "id" TEXT NOT NULL,
    "company" TEXT,
    "job_title" TEXT,
    "industry" TEXT,
    "location" TEXT,
    "age" TEXT,
    "signup_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monthly_spend_usd" DOUBLE PRECISION,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "org_id" TEXT NOT NULL,

    CONSTRAINT "platform_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "platform_users_org_id_idx" ON "platform_users"("org_id");

-- AddForeignKey
ALTER TABLE "platform_users" ADD CONSTRAINT "platform_users_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
