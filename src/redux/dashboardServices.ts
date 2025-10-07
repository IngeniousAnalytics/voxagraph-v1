// src/redux/slices/dashboardServices.ts
import { AnyAction } from 'redux';

export type Permission = { feature: string; permission: string };
export type DbRef = { db_id: number; name: string; default_db?: boolean };
export interface UserInfo { user_id: number; username: string; email?: string; roles: string[]; permissions: Permission[]; db_access: DbRef[]; access_token?: string | null; }

export interface DashboardServicesState {
  userInfo: UserInfo | null;
  I_CONNECT_WITH: DbRef | null;
  loading: boolean;
}

const initialState: DashboardServicesState = {
  userInfo: null,
  I_CONNECT_WITH: null,
  loading: false,
};

export const SET_USER_INFO = 'dashboardServices/SET_USER_INFO' as const;
export const SET_CONNECT_WITH = 'dashboardServices/SET_CONNECT_WITH' as const;
export const SET_LOADING = 'dashboardServices/SET_LOADING' as const;

export const setUserInfo = (payload: UserInfo | null) => ({ type: SET_USER_INFO, payload });
export const setConnectWith = (payload: DbRef | null) => ({ type: SET_CONNECT_WITH, payload });
export const setLoading = (payload: boolean) => ({ type: SET_LOADING, payload });

export function dashboardServicesReducer(
  state: DashboardServicesState = initialState,   // 👈 typed default
  action: AnyAction                                // or create a union of your action types
): DashboardServicesState {
  switch (action.type) {
    case SET_USER_INFO:
      return { ...state, userInfo: action.payload };
    case SET_CONNECT_WITH:
      return { ...state, I_CONNECT_WITH: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export default dashboardServicesReducer;
