const initialState = {
    user: null,
    roomId: null,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_USER":
        return { ...state, user: action.payload };
        
      case "SET_ROOM_ID":
        return { ...state, roomId: action.payload };
  
      default:
        return state;
    }
  };
  
  export default userReducer;
  