"use client";

import { useGraphQLClient } from "@/context/graphql-request-shop-client";
import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { notFound } from "next/navigation";

type ConfirmPageProps = { searchParams: { [key: string]: string | string[] | undefined } };

export function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const { orderCode } = searchParams;
  if (!orderCode) notFound();

  const graphQLClient = useGraphQLClient();

  const { data: order } = useQuery<OrderByCodeData>({
    queryKey: ["order", orderCode],
    queryFn: () =>
      graphQLClient.request(
        gql`
          query getOrderByCode($code: String!) {
            orderByCode(code: $code) {
              customer {
                firstName
                lastName
              }
              total
              lines {
                id
                quantity
                productVariant {
                  name
                  price
                }
                customFields {
                  supplements
                  names
                }
              }
            }
          }
        `,
        { code: orderCode }
      ),
  });

  return (
    <main className={`container mx-auto mt-4`}>
      {order?.orderByCode ? <OrderLineReminder order={order.orderByCode} /> : null}
    </main>
  );
}

function OrderLineReminder({ order }: { order: OrderByCodeData["orderByCode"] }) {
  if (!order || !order.lines) return <></>;
  return (
    <>
      {order.lines.map((orderLine: any) => {
        const { quantity, productVariant, customFields } = orderLine;
        const names = customFields?.names ? ` (pour ${customFields.names})` : "";
        const supplements = customFields?.supplements ? ` [avec ${customFields.supplements.join(", ")}]` : "";
        return (
          <li key={productVariant.name}>
            {`${quantity} x ${productVariant.name}${supplements} (${(productVariant.price ?? 0) / 100})${names}`}
          </li>
        );
      })}
    </>
  );
}

type OrderByCodeData = {
  orderByCode: {
    customer: { firstName: string; lastName: string };
    total: number;
    lines: {
      id: string;
      quantity: number;
      productVariant: {
        name: string;
        price: number;
      };
    }[];
  };
};

export default ConfirmPage;
