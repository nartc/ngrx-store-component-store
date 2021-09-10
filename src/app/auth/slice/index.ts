import {actions, selectLoggedIn, selectors, selectUser} from './auth.slice';

export {AuthFeature} from './auth.slice';

export const AuthSelectors = {
    selectUser,
    selectLoggedIn,
    ...selectors
};

const {loginSuccess, loginRedirect, logoutConfirmation, logoutConfirmationDismiss, logout} = actions;
export const AuthApiActions = {loginSuccess, loginRedirect};
export const AuthActions = {logout, logoutConfirmation, logoutConfirmationDismiss};
