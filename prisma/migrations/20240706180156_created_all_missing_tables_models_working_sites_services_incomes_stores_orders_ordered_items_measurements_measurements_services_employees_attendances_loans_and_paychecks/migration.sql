-- CreateTable
CREATE TABLE "employees_attendances" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "working_site_id" INTEGER NOT NULL,
    "date" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "employees_attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paychecks" (
    "id" SERIAL NOT NULL,
    "employees_id" INTEGER NOT NULL,
    "payed_at" TIMESTAMPTZ(6) NOT NULL,
    "start_date_range" TIMESTAMPTZ(6) NOT NULL,
    "end_date_rage" TIMESTAMPTZ(6) NOT NULL,
    "value" BIGINT NOT NULL,

    CONSTRAINT "paychecks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loans" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "value" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "paycheck_id" INTEGER NOT NULL,

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "working_sites" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "registration_number" BIGINT NOT NULL,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "address_id" INTEGER NOT NULL,

    CONSTRAINT "working_sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "working_site_id" INTEGER NOT NULL,
    "incidence" INTEGER NOT NULL,
    "approximate_progress" INTEGER NOT NULL DEFAULT 0,
    "estimated_cost" BIGINT NOT NULL,
    "estimated_start_date" TIMESTAMPTZ(6) NOT NULL,
    "estimated_end_date" TIMESTAMPTZ(6) NOT NULL,
    "real_start_date" TIMESTAMPTZ(6) NOT NULL,
    "real_end_date" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incomes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "working_site_id" INTEGER NOT NULL,
    "value" BIGINT NOT NULL,
    "received_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "incomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "address_id" INTEGER NOT NULL,
    "phone" BIGINT,
    "email" VARCHAR(255),

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "working_site_id" INTEGER NOT NULL,
    "store_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "cancelled_at" TIMESTAMPTZ(6) NOT NULL,
    "value" BIGINT NOT NULL,
    "negotiated_value" BIGINT NOT NULL,
    "cash_value" BIGINT NOT NULL,
    "financed_value" BIGINT NOT NULL,
    "observation" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordered_items" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "value" BIGINT NOT NULL,
    "service_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,

    CONSTRAINT "ordered_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "measurements" (
    "id" SERIAL NOT NULL,
    "working_site_id" INTEGER NOT NULL,
    "date" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "measurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "measurements_services" (
    "id" SERIAL NOT NULL,
    "measurement_id" INTEGER NOT NULL,
    "servide_id" INTEGER NOT NULL,
    "required_conclusion_percentage" INTEGER NOT NULL,

    CONSTRAINT "measurements_services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "working_sites_registration_number_key" ON "working_sites"("registration_number");

-- AddForeignKey
ALTER TABLE "employees_attendances" ADD CONSTRAINT "employees_attendances_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees_attendances" ADD CONSTRAINT "employees_attendances_working_site_id_fkey" FOREIGN KEY ("working_site_id") REFERENCES "working_sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paychecks" ADD CONSTRAINT "paychecks_employees_id_fkey" FOREIGN KEY ("employees_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_paycheck_id_fkey" FOREIGN KEY ("paycheck_id") REFERENCES "paychecks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_sites" ADD CONSTRAINT "working_sites_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_working_site_id_fkey" FOREIGN KEY ("working_site_id") REFERENCES "working_sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_working_site_id_fkey" FOREIGN KEY ("working_site_id") REFERENCES "working_sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_working_site_id_fkey" FOREIGN KEY ("working_site_id") REFERENCES "working_sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordered_items" ADD CONSTRAINT "ordered_items_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordered_items" ADD CONSTRAINT "ordered_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_working_site_id_fkey" FOREIGN KEY ("working_site_id") REFERENCES "working_sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurements_services" ADD CONSTRAINT "measurements_services_measurement_id_fkey" FOREIGN KEY ("measurement_id") REFERENCES "measurements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurements_services" ADD CONSTRAINT "measurements_services_servide_id_fkey" FOREIGN KEY ("servide_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
