import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import FeedbackForm from "./FeedbackForm";
import { enUS } from "date-fns/locale";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function RecruiterCalendar() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await axiosInstance.get("/interviews/company");
      const formatted = res.data.data.map((inv) => ({
        ...inv,
        title: `${inv.roundName} - ${inv.status}`,
        start: new Date(inv.scheduledAt),
        end: new Date(
          new Date(inv.scheduledAt).getTime() + inv.durationMinutes * 60000,
        ),
      }));
      setInterviews(formatted);
    } catch (e) {
      toast.error("Failed to load calendar");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    if (event.status === "SCHEDULED" || event.status === "RESCHEDULED") {
      setIsFeedbackOpen(true);
    } else {
      toast("Interview is " + event.status + ". View details in ATS Board.");
    }
  };

  if (loading)
    return (
      <div className="text-center p-10 font-bold">Loading Calendar...</div>
    );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border mt-6">
      <h2 className="text-2xl font-bold mb-6">Interview Calendar</h2>
      <div className="h-[600px]">
        <Calendar
          localizer={localizer}
          events={interviews}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={(event) => {
            const backgroundColor =
              event.status === "SCHEDULED"
                ? "#3b82f6"
                : event.status === "COMPLETED"
                  ? "#10b981"
                  : "#ef4444";
            return { style: { backgroundColor } };
          }}
        />
      </div>

      {isFeedbackOpen && selectedEvent && (
        <FeedbackForm
          interview={selectedEvent}
          onClose={() => setIsFeedbackOpen(false)}
          onSuccess={() => {
            setIsFeedbackOpen(false);
            fetchInterviews();
          }}
        />
      )}
    </div>
  );
}
