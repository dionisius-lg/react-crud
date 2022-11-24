import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth.slice";
import { citiesReducer } from "./cities.slice";
import { productCategoriesReducer } from "./productCategories.slice";
import { productsReducer } from "./products.slice";
import { provincesReducer } from "./provinces.slice";
import { userLevelsReducer } from "./userLevels.slice";
import { usersReducer } from "./users.slice";

export * from "./auth.slice";
export * from "./cities.slice";
export * from "./productCategories.slice";
export * from "./products.slice";
export * from "./provinces.slice";
export * from "./userLevels.slice";
export * from "./users.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cities: citiesReducer,
        productCategories: productCategoriesReducer,
        products: productsReducer,
        provinces: provincesReducer,
        userLevels: userLevelsReducer,
        users: usersReducer
    }
})
