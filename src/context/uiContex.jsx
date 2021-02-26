import makeStore from "../store/store";

const initialState = {
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  console.log("ACTION", action.type);
  switch (action.type) {
    case "START_LOADING":
      return {
        ...state,
        loading: true,
      };

    case "END_LOADING":
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

const [UiProvider, useUiStore, useUiDispatch] = makeStore(
  reducer,
  initialState
);

export { UiProvider, useUiStore, useUiDispatch };
