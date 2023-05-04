import { gql } from "graphql-request";

gql`
  mutation addItemToOrder($productId: ID!, $quantityAdded: Int! = 1, $customFields: OrderLineCustomFieldsInput) {
    addItemToOrder(productVariantId: $productId, quantity: $quantityAdded, customFields: $customFields) {
      __typename
    }
  }
`;
