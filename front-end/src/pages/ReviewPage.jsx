import { useLocation } from "react-router-dom";

function ReviewPage() {
  const location = useLocation();
  
  // Handle undefined state
  const { room_id, listener_id, user_id } = location.state ?? {};

  if (!room_id || !listener_id || !user_id) {
    return <h1>Error: Missing required chat details</h1>;
  }

  return (
    <div>
      <h1>Review Page</h1>
      <p>Room ID: {room_id}</p>
      <p>Listener ID: {listener_id}</p>
      <p>User ID: {user_id}</p>
    </div>
  );
}

export default ReviewPage;
