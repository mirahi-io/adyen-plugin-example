import {MigrationInterface, QueryRunner} from "typeorm";

export class myMigration1683118479519 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_order" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "code" varchar NOT NULL, "state" varchar NOT NULL, "active" boolean NOT NULL DEFAULT (1), "orderPlacedAt" datetime, "couponCodes" text NOT NULL, "shippingAddress" text NOT NULL, "billingAddress" text NOT NULL, "currencyCode" varchar NOT NULL, "subTotal" integer NOT NULL, "subTotalWithTax" integer NOT NULL, "shipping" integer NOT NULL DEFAULT (0), "shippingWithTax" integer NOT NULL DEFAULT (0), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "taxZoneId" integer, "customerId" integer, "customFieldsAdyenpluginpaymentmethodcode" varchar(255), CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "customer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_order"("createdAt", "updatedAt", "code", "state", "active", "orderPlacedAt", "couponCodes", "shippingAddress", "billingAddress", "currencyCode", "subTotal", "subTotalWithTax", "shipping", "shippingWithTax", "id", "taxZoneId", "customerId") SELECT "createdAt", "updatedAt", "code", "state", "active", "orderPlacedAt", "couponCodes", "shippingAddress", "billingAddress", "currencyCode", "subTotal", "subTotalWithTax", "shipping", "shippingWithTax", "id", "taxZoneId", "customerId" FROM "order"`, undefined);
        await queryRunner.query(`DROP TABLE "order"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_order" RENAME TO "order"`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" RENAME TO "temporary_order"`, undefined);
        await queryRunner.query(`CREATE TABLE "order" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "code" varchar NOT NULL, "state" varchar NOT NULL, "active" boolean NOT NULL DEFAULT (1), "orderPlacedAt" datetime, "couponCodes" text NOT NULL, "shippingAddress" text NOT NULL, "billingAddress" text NOT NULL, "currencyCode" varchar NOT NULL, "subTotal" integer NOT NULL, "subTotalWithTax" integer NOT NULL, "shipping" integer NOT NULL DEFAULT (0), "shippingWithTax" integer NOT NULL DEFAULT (0), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "taxZoneId" integer, "customerId" integer, CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "customer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "order"("createdAt", "updatedAt", "code", "state", "active", "orderPlacedAt", "couponCodes", "shippingAddress", "billingAddress", "currencyCode", "subTotal", "subTotalWithTax", "shipping", "shippingWithTax", "id", "taxZoneId", "customerId") SELECT "createdAt", "updatedAt", "code", "state", "active", "orderPlacedAt", "couponCodes", "shippingAddress", "billingAddress", "currencyCode", "subTotal", "subTotalWithTax", "shipping", "shippingWithTax", "id", "taxZoneId", "customerId" FROM "temporary_order"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_order"`, undefined);
   }

}
