-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "wage" INTEGER NOT NULL,
    "hired_at" TIMESTAMPTZ(6) NOT NULL,
    "address_id" INTEGER,
    "phone" INTEGER,
    "document_number" VARCHAR(255) NOT NULL,
    "pix" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "observation" TEXT,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "number" VARCHAR(255) NOT NULL,
    "complement" VARCHAR(255) NOT NULL,
    "neighbourhood" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "postal_code" INTEGER NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_document_number_key" ON "employees"("document_number");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
