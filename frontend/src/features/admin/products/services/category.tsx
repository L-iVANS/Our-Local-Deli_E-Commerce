import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      categoryId
      categoryName
      slug
      skuPrefix
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryDto!) {
    createCategory(input: $input) {
      categoryId
      categoryName
      slug
      skuPrefix
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: Int!, $input: UpdateCategoryDto!) {
    updateCategory(id: $id, input: $input) {
      categoryId
      categoryName
      slug
      skuPrefix
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($categoryId: Int!) {
    deleteCategory(categoryId: $categoryId) {
      categoryId
    }
  }
`;

export const ASSIGN_RANDOM_CATEGORIES = gql`
  mutation AssignRandomCategoriesToProducts {
    assignRandomCategoriesToProducts {
      message
      count
    }
  }
`;
