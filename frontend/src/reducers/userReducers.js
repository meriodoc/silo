import {
  USER_ADDRESS_MAP_CONFIRM,
  USER_DELETE_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_RESET,
  USER_DELETE_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNOUT,
  USER_TOPSELLERS_LIST_FAIL,
  USER_TOPSELLERS_LIST_REQUEST,
  USER_TOPSELLERS_LIST_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_RESET,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_REQUEST,
  USER_UPDATE_RESET,
  USER_UPDATE_SUCCESS,
} from "../constants/userConstants";

export const userSigninReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_SIGNIN_REQUEST:
      /* If it is the case - set loading to true */
      return { loading: true };
    case USER_SIGNIN_SUCCESS:
      /* action.payload comes from userActions.js = payload: data (from backend) */
      return { loading: false, userInfo: action.payload };
    case USER_SIGNIN_FAIL:
      /* Need to get rid of loading = false */
      return { loading: false, error: action.payload };
    /* By having an empty object, data in the userInfo above, will be removed */
    case USER_SIGNOUT:
      return {};
    default:
      return state;
  }
};
export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      /* If it is the case - set loading to true */
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      /* action.payload comes from userActions.js = payload: data (from backend) */
      return { loading: false, userInfo: action.payload };
    case USER_REGISTER_FAIL:
      /* Need to get rid of loading = false */
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      /* If it is the case - set loading to true */
      return { loading: true };
    case USER_DETAILS_SUCCESS:
      /* action.payload comes from userActions.js = payload: data (from backend) */
      return { loading: false, user: action.payload };
    case USER_DETAILS_FAIL:
      /* Need to get rid of loading = false */
      return { loading: false, error: action.payload };
    case USER_DETAILS_RESET:
      return { loading: true };
    default:
      return state;
  }
};
export const userUpdateProfileReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      /* If it is the case - set loading to true */
      return { loading: true };
    case USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true };
    case USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    case USER_UPDATE_PROFILE_RESET:
      return {};
    default:
      return state;
  }
};

export const userListReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case USER_LIST_REQUEST:
      /* If it is the case - set loading to true */
      return { loading: true };
    case USER_LIST_SUCCESS:
      return { loading: false, users: action.payload };
    case USER_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const userDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_DELETE_REQUEST:
      /* If it is the case - set loading to true */
      return { loading: true };
    case USER_DELETE_SUCCESS:
      return { loading: false, success: true };
    case USER_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case USER_DELETE_RESET:
      return {};
    default:
      return state;
  }
};
export const userUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_REQUEST:
      /* If it is the case - set loading to true */
      return { loading: true };
    case USER_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case USER_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case USER_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const userTopSellersListsReducer = (
  state = { loading: true },
  action
) => {
  switch (action.type) {
    case USER_TOPSELLERS_LIST_REQUEST:
      /* If it is the case - set loading to true */
      return { loading: true };
    case USER_TOPSELLERS_LIST_SUCCESS:
      return { loading: false, users: action.payload };
    case USER_TOPSELLERS_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userAddressMapReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_ADDRESS_MAP_CONFIRM:
      return { address: action.payload };
    default:
      return state;
  }
};

/*  NB After defining a reducer I need to add that reducer to store.js */
