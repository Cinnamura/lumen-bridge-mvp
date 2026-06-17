-- Add partial-payment tracking to schedule rows.
ALTER TABLE "payment_schedule"
ADD COLUMN "amount_paid" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- Preserve already settled rows and normalize statuses to the calendar-based model.
UPDATE "payment_schedule"
SET
  "amount_paid" = CASE
    WHEN "status" = 'paid' THEN "amount"
    ELSE 0
  END,
  "status" = CASE
    WHEN "status" = 'paid' THEN 'PAID'
    WHEN "status" = 'overdue' THEN 'OVERDUE'
    ELSE 'UNPAID'
  END;

ALTER TABLE "payment_schedule"
ALTER COLUMN "status" SET DEFAULT 'UNPAID';
