import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth.slice";
import { productsReducer } from "./products.slice";
import { productCategoriesReducer } from "./productCategories.slice";
import { usersReducer } from "./users.slice";

export * from "./auth.slice";
export * from "./products.slice";
export * from "./productCategories.slice";
export * from "./users.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productsReducer,
        productCategories: productCategoriesReducer,
        users: usersReducer
    }
})
