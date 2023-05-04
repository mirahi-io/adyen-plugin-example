"use client";
import { useEffect } from "react";
import AdyenCheckout from "@adyen/adyen-web";
import { notFound } from "next/navigation";
import type { CoreOptions } from "@adyen/adyen-web/dist/types/core/types";

type PaymentPageProps = { searchParams: { [key: string]: string | string[] | undefined } };

export function PaymentPage({ searchParams }: PaymentPageProps) {
  const { id, sessionData } = searchParams || {};
  if (!id || !sessionData) notFound();

  const configuration: CoreOptions = {
    environment: "test", // Change to one of the environment values specified in step 4.
    clientKey: process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY, // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
    analytics: {
      enabled: false, // Set to false to not send analytics data to Adyen.
    },
    session: {
      id, // Unique identifier for the payment session.
      sessionData, // The payment session data.
    },
    // Any payment method specific configuration.
    // Find the configuration specific to each payment method:  https://docs.adyen.com/payment-methods
    paymentMethodsConfiguration: {
      card: {
        hasHolderName: true,
        holderNameRequired: true,
        hasCVC: true,
        // billingAddressRequired: true,
      },
      bcmc: {
        hasHolderName: true,
        holderNameRequired: true,
        hasCVC: true,
        // billingAddressRequired: true,
      },
    },
  } as const;
  useEffect(() => {
    (async () => {
      const checkout = await AdyenCheckout(configuration);
      checkout.create("dropin").mount("#dropin-container");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <main id="dropin-container" />;
}

export default PaymentPage;
