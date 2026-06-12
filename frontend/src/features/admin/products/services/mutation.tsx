import { gql } from "@apollo/client";

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductDto!) {
    createProduct(input: $input) {
        productId
        productName
        productDescription
        imageUrl
        sku
        categoryId
        category {
          categoryId
          categoryName
          slug
        }
        productPrice
        reorderPoint
        available
        blocked
        inTransit
        createdAt
        updatedAt
    }
}
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: Int!, $input: UpdateProductDto!) {
    updateProduct(id: $id, input: $input) {
        productId
        productName
        productDescription
        imageUrl
        sku
        categoryId
        category {
          categoryId
          categoryName
          slug
        }
        productPrice
        reorderPoint
        available
        blocked
        inTransit
        createdAt
        updatedAt
    }
}
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($productId: Int!) {
    deleteProduct(productId: $productId) {
        productId
    }
}
`;