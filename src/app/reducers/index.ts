/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import {InjectionToken} from '@angular/core';
import {LayoutFeature, LayoutState} from "@example-app/core/slices";
import * as fromRouter from '@ngrx/router-store';
import {Action, ActionReducer, ActionReducerMap, MetaReducer,} from '@ngrx/store';
import {environment} from '../../environments/environment';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
    [LayoutFeature.name]: LayoutState;
    router: fromRouter.RouterReducerState<any>;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>('Root reducers token', {
    factory: () => ({
        [LayoutFeature.name]: LayoutFeature.reducer,
        router: fromRouter.routerReducer,
    }),
});

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
    return (state, action) => {
        const result = reducer(state, action);
        console.groupCollapsed(action.type);
        console.log('prev state', state);
        console.log('action', action);
        console.log('next state', result);
        console.groupEnd();

        return result;
    };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<State>[] = !environment.production
    ? [logger]
    : [];

/**
 * Router Selectors
 */
export const {selectRouteData} = fromRouter.getSelectors();
