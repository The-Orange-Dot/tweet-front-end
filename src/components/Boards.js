// import react and utils
import React from "react";
import { ActionCableProvider } from "react-actioncable-provider";
import { useState } from "react";
import Icon from "@mui/material/Icon";
// import { UserContext } from "../App";

// import components
import Event from "./Event";
import NewBoardForm from "./NewBoardForm";
import EventPreview from "./EventPreview";
import "../App.css";

function Boards({ user }) {
  // const user = useContext(UserContext);
  const token = localStorage.getItem("jwt");

  // sets state
  const [formPopup, setFormPopup] = useState(false);
  const [errors, setErrors] = useState([]);
  const [events, setEvents] = useState(user.events);
  const [eventPage, setEventPage] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  // fetch for creating new event
  function handleCreateNewEvent(e, eventFormData) {
    e.preventDefault();
    fetch(`http://localhost:3000/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventFormData),
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          console.log(data);
          setFormPopup(!formPopup);
          setEvents([...events, data]);
        });
      } else {
        res.json().then((data) => {
          setErrors(data.errors);
        });
      }
    });
  }

  // function to handle showing single event when preview button is clicked
  function handleShowEvent(event) {
    setEventPage(true);
    setCurrentEvent(event);
  }

  // renders new form popup when button is clicked
  if (formPopup) {
    return (
      <div>
        <NewBoardForm
          user={user}
          setFormPopup={setFormPopup}
          handleCreateNewEvent={handleCreateNewEvent}
        />
        {errors ? errors.map((e) => <div>{e}</div>) : null}
      </div>
    );
  }

  // if user has no events, only offer to add new
  if (!events) {
    return (
      <div id="board-container">
        <p>You don't have any boards...</p>
        <p>Click to add one now.</p>
        <Icon id="icon-large" onClick={() => setFormPopup(true)}>
          edit_calendar
        </Icon>
      </div>
    );
  }

  // renders single event when preview is clicked
  if (eventPage) {
    // <ActionCableProvider url="ws://localhost:3000/cable">
    //       <Event />
    //     </ActionCableProvider>
    return (
      <Event event={currentEvent} setEventPage={setEventPage} user={user} />
    );
  }

  // if user has boards, map over and render Event component for each, inside ActionCableProvider
  else
    return (
      <div id="boards-container">
        <div className="welcome">
          <p>welcome, {user.first_name}</p>
          <Icon id="icon-med" onClick={() => setFormPopup(true)}>
            edit_calendar
          </Icon>
        </div>
        <div className="previews">
          {events.map((event) => {
            return (
              <EventPreview
                event={event}
                key={event.id}
                handleShowEvent={handleShowEvent}
              />
            );
          })}
        </div>
      </div>
    );
}

export default Boards;
