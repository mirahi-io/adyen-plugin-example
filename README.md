# Adyen Vendure plugin example

This repository showcases an implementation of the [Adyen payment plugin](https://www.npmjs.com/package/@mirahi/vendure-adyen-dropin-plugin) for Vendure.

## Installation

```bash
git clone
cd vendure-adyen-plugin-example
cd storefront
yarn install
cd ../vendure
yarn install
```

Add your credentials in both .env files

Then you can launch the storefront and the vendure server in two separate terminals from the root folder of the project:

The server will run on port 3000:

```bash
yarn vendure
```

Add a new Payment method in the Vendure admin UI, and select the Adyen payment method.
Then add your Adyen API key and the merchant account.

The storefront will run on port 4000:

```bash
yarn storefront
```

WARNING: Use the storefront in Incognito mode, otherwise the session cookie from the Vendure admin UI will conflict.
