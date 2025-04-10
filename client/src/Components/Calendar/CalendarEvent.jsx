export const CalendarEvent = ({event}) => {
  return (
    <span className={`calendar-event ${
      event.status === 1 ? "upcoming" :
      event.status === 2 ? "active" :
      event.status === 3 ? "closed" :
      event.status === 4 ? "cancelled" :
      event.status === 5 ? "finished" :
      "unknown"
    }`}>
      {event.event_name}
    </span>
  );
};