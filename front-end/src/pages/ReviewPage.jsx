import { useSelector } from "react-redux";

function ReviewPage() {
  const chatData = useSelector((state) => state.chat);

  return (
    <div>
      <h2>Review Page</h2>
      <p>User ID: {chatData.userId}</p>
      <p>Listener ID: {chatData.listenerId}</p>
    </div>
  );
}

export default ReviewPage;
