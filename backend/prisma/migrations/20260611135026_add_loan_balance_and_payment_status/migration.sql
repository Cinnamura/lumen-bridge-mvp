-- AlterTable
ALTER TABLE "loans" ADD COLUMN     "paid_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "remaining_amount" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'success';

-- Backfill balances for existing loans from recorded payments.
-- paid_amount = sum of payments; remaining_amount = total_repayment - paid (clamped at 0).
UPDATE "loans" l
SET "paid_amount" = COALESCE(p.total, 0)
FROM (
  SELECT "loan_id", SUM("amount") AS total FROM "payments" GROUP BY "loan_id"
) p
WHERE l.id = p."loan_id";

UPDATE "loans"
SET "remaining_amount" = GREATEST("total_repayment" - "paid_amount", 0);

-- Loans that were already closed have no outstanding balance.
UPDATE "loans" SET "remaining_amount" = 0 WHERE "status" = 'closed';

-- Active/pending loans that have not been signed yet keep the full amount due
-- (paid_amount stays 0, remaining_amount already equals total_repayment above).
