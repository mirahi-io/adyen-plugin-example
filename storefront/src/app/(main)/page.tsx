"use client";
import { gql } from "graphql-request";
import { useGraphQLClient } from "@/context/graphql-request-shop-client";
import Image from "next/image";
import { IBM_Plex_Serif } from "next/font/google";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const ibmPlex = IBM_Plex_Serif({ subsets: ["latin"], weight: "400" });

export default function Home() {
  const graphQLClient = useGraphQLClient();
  const reactQueryClient = useQueryClient();
  const router = useRouter();

  const btnClass =
    "bg-mirahi-500 hover:bg-mirahi-700 text-white font-bold py-2 px-4 rounded disabled:opacity-25 disabled:bg-mirahi-500";

  const { data: product, isLoading: productIsLoading } = useQuery<ProductData>({
    queryKey: ["item"],
    queryFn: () =>
      graphQLClient.request(gql`
        query findProduct {
          product(id: 3) {
            name
            variants {
              id
              price
              currencyCode
            }
            assets {
              source
            }
          }
        }
      `),
  });
  console.log("🚀 ~ file: page.tsx:38 ~ Home ~ product:", product);

  const { mutate: addLaptopToCart, isLoading: addToCardIsLoading } = useMutation({
    mutationFn: () =>
      graphQLClient.request(
        gql`
          mutation addComputerToOrder($productVariantId: ID! = 7, $quantityAdded: Int! = 1) {
            addItemToOrder(productVariantId: $productVariantId, quantity: $quantityAdded) {
              __typename
            }
          }
        `
      ),
    onSuccess: () => reactQueryClient.invalidateQueries(["cart"]),
  });

  const { mutate: setCustomer, isLoading: setCustomerIsLoading } = useMutation({
    mutationFn: () =>
      graphQLClient.request(gql`
        mutation setCustomerForOrder(
          $firstName: String! = "John"
          $lastName: String! = "Doe"
          $emailAddress: String! = "example@mirahi.io"
        ) {
          setCustomerForOrder(input: { firstName: $firstName, lastName: $lastName, emailAddress: $emailAddress }) {
            __typename
          }
        }
      `),
    onSuccess: () => reactQueryClient.invalidateQueries(["cart"]),
  });

  const { mutate: createPaymentIntent, isLoading: paymentIntendIsLoading } = useMutation({
    mutationFn: () =>
      graphQLClient.request(
        gql`
          mutation createPaymentIntent {
            createAdyenPaymentIntent {
              __typename
              ... on AdyenPaymentIntent {
                transactionId
                sessionData
              }
              ... on AdyenPaymentIntentError {
                message
              }
            }
          }
        `
      ),
    onSuccess: async (mutationRes: any) => {
      if (mutationRes?.createAdyenPaymentIntent.__typename === "AdyenPaymentIntent") {
        const { sessionData, transactionId } = mutationRes.createAdyenPaymentIntent;
        router.push(`/payment?id=${transactionId}&sessionData=${sessionData}`);
      } else {
        console.error("ERROR: ", mutationRes?.createAdyenPaymentIntent.message);
      }
    },
  });

  const { data: cart, isLoading: cartIsLoading } = useQuery<{
    activeOrder: {
      lines: {
        id: string;
        productVariant: {
          name: string;
          currencyCode: string;
        };
        unitPrice: number;
        quantity: number;
      }[];
      total: number;
      currencyCode: string;
      customer: {
        __typename: string;
      };
    };
  }>({
    queryKey: ["cart"],
    queryFn: () =>
      graphQLClient.request(
        gql`
          query getCurrentOrder {
            activeOrder {
              lines {
                id
                productVariant {
                  name
                  currencyCode
                }
                unitPrice
                quantity
              }
              total
              currencyCode
              customer {
                __typename
              }
            }
          }
        `
      ),
  });

  const anyLoading =
    paymentIntendIsLoading || setCustomerIsLoading || addToCardIsLoading || cartIsLoading || productIsLoading;
  const cartIsEmpty = !cart?.activeOrder?.lines?.length;

  return (
    <main className="flex min-h-screen flex-col md:flex-row md:justify-around p-24">
      <div>
        <div className=" flex flex-col items-center justify-center">
          <a href="https://mirahi.io" target="_blank" rel="noopener noreferrer">
            <Image src="/mirahi-logo.svg" alt="Vercel Logo" width={200} height={200} priority />
          </a>
        </div>
        {product ? (
          <div className="flex flex-col items-center gap-4 m-8">
            <h1 className="text-4xl font-bold">{product.product?.name}</h1>
            {product.product.assets?.at(0)?.source ? (
              <Image src={product.product.assets[0].source} alt="" width={200} height={200} />
            ) : null}
            <p className="text-2xl font-bold">{`${product.product.variants[0].price / 100} ${
              product.product.variants[0].currencyCode
            }`}</p>
            <button
              className={btnClass}
              onClick={() => addLaptopToCart()}
              disabled={!!cart?.activeOrder || anyLoading}
            >
              {`Order this`}
            </button>
          </div>
        ) : (
          <p className={ibmPlex.className}>{`Start your Vendure server to find a product`}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 m-8">
        <h1 className="text-4xl font-bold">{`Cart`}</h1>
        {!cartIsEmpty ? (
          cart.activeOrder.lines.map(line => (
            <div className="flex flex-col items-center gap-4 m-8" key={line.id}>
              <p className={ibmPlex.className}>{`${line.quantity}x ${line.productVariant.name} (${
                line.unitPrice / 100
              } ${line.productVariant.currencyCode})`}</p>
            </div>
          ))
        ) : (
          <p className={ibmPlex.className}>{`Your cart is empty`}</p>
        )}
        {!cartIsEmpty ? (
          <>
            <button
              className={btnClass}
              onClick={() => setCustomer()}
              disabled={!!cart?.activeOrder?.customer || cartIsEmpty || anyLoading}
            >
              {`Set customer`}
            </button>
            <button
              className={btnClass}
              onClick={() => createPaymentIntent()}
              disabled={!cart?.activeOrder?.customer || anyLoading}
            >
              {`Create payment intent (${(cart?.activeOrder?.total ?? 0) / 100} ${cart?.activeOrder?.currencyCode})`}
            </button>
          </>
        ) : null}
      </div>
    </main>
  );
}

type ProductData = {
  product: {
    name: string;
    variants: {
      id: string;
      price: number;
      currencyCode: string;
    }[];
    assets: {
      source: string;
    }[];
  };
};
