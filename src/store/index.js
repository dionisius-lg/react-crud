import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth.slice";
import { productCategoriesReducer } from "./productCategories.slice";
import { productsReducer } from "./products.slice";
import { userLevelsReducer } from "./userLevels.slice";
import { usersReducer } from "./users.slice";

export * from "./auth.slice";
export * from "./productCategories.slice";
export * from "./products.slice";
export * from "./userLevels.slice";
export * from "./users.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        productCategories: productCategoriesReducer,
        products: productsReducer,
        userLevels: userLevelsReducer,
        users: usersReducer
    }
})
