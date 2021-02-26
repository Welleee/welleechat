import makeStore from "../store/store";

const initialState = {
  userRooms: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_ROOMS":
      return {
				//Function some to avoid duplicate items in the array
        userRooms: state.userRooms.some(
          (userRoom) => userRoom.uid === action.payload.uid
        )
          ? state.userRooms
          : [...state.userRooms, action.payload],
      };
    default:
      return state;
  }
};

const [ChatProvider, useChatStore, useChatDispatch] = makeStore(
  reducer,
  initialState
);

export { ChatProvider, useChatStore, useChatDispatch };
