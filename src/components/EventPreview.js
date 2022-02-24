// import react and utils
import React from "react";

export default function EventPreview({ event, handleShowEvent }) {
  return (
    <div className="event-preview">
      <h2>{event.name}</h2>
      <h2>#{event.hashtag}</h2>
      <button onClick={() => handleShowEvent(event)}>view</button>
    </div>
  );
}
