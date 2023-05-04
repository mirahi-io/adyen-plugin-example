# Adyen Vendure plugin example

This repository showcases an implementation of the [Adyen payment plugin](https://www.npmjs.com/package/@mirahi/vendure-adyen-dropin-plugin) for Vendure.

## Installation

Install the dependencies in both the `storefront` and the `vendure` folder:

```bash
git clone
cd vendure-adyen-plugin-example
cd storefront
yarn install
cd ../vendure
yarn install
```

## Keys and credentials

Add your credentials in both .env files:

- NEXT_PUBLIC_ADYEN_CLIENT_KEY: Adyen client key (storefront)
- If configured:
  - HMAC_KEY (vendure)
  - BASIC_AUTH_USERNAME (vendure)
  - BASIC_AUTH_PASSWORD (vendure)

## Running the server

Then you can launch the storefront and the vendure server in two separate terminals from the root folder of the project.

The server will run on port 3000:

```bash
yarn vendure
```

Modify the Adyen Payment method in the Vendure admin UI by adding your Adyen API key.
Also, change your Channel token to have it match your Adyen merchant account name.

## Running the storefront

The storefront will run on port 4200:

```bash
yarn storefront
```

WARNING: Use the storefront in Incognito mode, otherwise the session cookie from the Vendure admin UI will conflict.

You can make now a simple order for a wireless mouse!
