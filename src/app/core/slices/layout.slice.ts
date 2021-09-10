import {AuthActions} from "@example-app/auth/slice";
import {immerOn} from "ngrx-immer/store";
import {createNamespacedSlice} from "ngrx-slice";

export interface LayoutState {
    showSidenav: boolean;
}

const initialState: LayoutState = {
    showSidenav: false,
};

export const {LayoutActions, LayoutSelectors, LayoutFeature} = createNamespacedSlice({
    name: 'layout',
    initialState,
    reducers: {
        openSidenav: state => {
            state.showSidenav = true;
        },
        closeSidenav: state => {
            state.showSidenav = false;
        }
    },
    extraReducers: [
        immerOn(AuthActions.logoutConfirmation, (state: LayoutState) => {
            state.showSidenav = false;
        })
    ]
})
