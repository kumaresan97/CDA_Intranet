/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable   @typescript-eslint/no-use-before-define */
import * as React from "react";
import { useEffect } from "react";
import { EventService } from "../../../Services/Upcoming/UpcomingService";
import ReDatePicker from "../FormInputs/Datepicker/CustomDatePicker";
import ReInput from "../FormInputs/Input/CustomInput";
import CustomModal from "../modal/Custommodal";
import styles from "./UpcomingEvents.module.scss";
import { message, Modal, Skeleton } from "antd";
import ReTextArea from "../FormInputs/TextArea/CustomTextArea";
import { useLanguage } from "../useContext/useContext";

const UpcomingEvents = ({ eventsData, lang }: any) => {
  const { isAdmin, isArabic } = useLanguage();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const arabicMonths = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const [events, setEvents] = React.useState<any[]>([]);

  // MODAL STATE
  const [modalOpen, setModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [isEdit, setIsEdit] = React.useState(false);
  const [editId, setEditId] = React.useState<number | null>(null);

  // FORM STATE (one state for Add & Edit)
  const [form, setForm] = React.useState({
    ID: null,
    Event_En: "",
    Event_Ar: "",
    Description_En: "",
    Description_Ar: "",
    EventDate: null as Date | null,
    isDelete: false,
  });

  // Set field
  const handleChange = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // OPEN ADD MODAL
  const openAdd = () => {
    setIsEdit(false);
    setEditId(null);
    setErrors({});
    setForm({
      ID: null,
      Event_En: "",
      Event_Ar: "",
      Description_En: "",
      Description_Ar: "",
      EventDate: null,
      isDelete: false,
    });
    setModalOpen(true);
  };

  // OPEN EDIT MODAL
  const openEdit = (record: any) => {
    setIsEdit(true);
    setEditId(record.ID);

    setForm({
      ID: record.ID,
      Event_En: record?.Event_En,
      Event_Ar: record.Event_Ar,
      Description_En: record.Description_En,
      Description_Ar: record.Description_Ar,
      EventDate: new Date(record.EventDate),
      isDelete: record.isDelete || false,
    });

    setModalOpen(true);
  };

  // SAVE (ADD / UPDATE)
  const saveEvent = async () => {
    if (!validateForm()) return; // stop if validation fails

    setModalOpen(false);
    setLoading(true);
    try {
      if (isEdit && editId) {
        // Update
        await EventService.update(editId, form);

        setEvents((prev) =>
          prev.map((ev) => (ev.ID === form.ID ? { ...form, ID: editId } : ev)),
        );
        message.success("Event updated successfully!");
      } else {
        // Add
        const res = await EventService.add(form);
        setEvents((prev) => [...prev, { ...form, ID: res.data.ID }]);

        message.success("Event added successfully!");
      }
    } catch (err) {
      console.error("Validation error:", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  const EventSkeleton = () => {
    return (
      <div className={styles.contentSection}>
        {/* LEFT IMAGE */}
        <Skeleton.Avatar
          active
          shape="square"
          size={64}
          style={{
            flexShrink: 0,
          }}
        />

        {/* CENTER – TWO TEXT FIELDS */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Skeleton.Input
            active
            size="default"
            style={{
              width: " 60 %",
              height: "16px",
            }}
          />
          <Skeleton.Input
            active
            size="small"
            style={{
              width: "40%",
              height: "14px",
            }}
          />
        </div>

        {/* RIGHT IMAGE / ICON */}
        <Skeleton.Avatar
          active
          shape="circle"
          size={32}
          style={{
            flexShrink: 0,
          }}
        />
      </div>
    );
  };

  // DELETE
  const deleteEvent = async (id: number) => {
    Modal.confirm({
      title: "Delete Confirmation",
      content: "Are you sure you want to delete this event?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          setLoading(true);

          await EventService.delete(id);
          setEvents((prev) => prev.filter((ev) => ev.ID !== id));
          message.success("Event deleted successfully!");
        } catch (err) {
          console.error(err);
          message.error("Failed to delete the event.");
          setLoading(false);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const englishMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [errors, setErrors] = React.useState<{
    [key: string]: string;
  }>({});
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.Event_En?.trim())
      newErrors.Event_En = "Event English is required";
    if (!form.Event_Ar?.trim()) newErrors.Event_Ar = "Event Arabic is required";
    if (!form.Description_En?.trim())
      newErrors.Description_En = "Description English is required";
    if (!form.Description_Ar?.trim())
      newErrors.Description_Ar = "Description Arabic is required";
    if (!form.EventDate) newErrors.EventDate = "Event Date is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // true if no errors
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const data = await EventService.getAll();

      const upcoming = data
        ?.map((event: any) => ({
          ...event,
          EventDate: new Date(event.EventDate),
          dateObj: new Date(event.EventDate),
        }))
        .filter((event: any) => event.dateObj >= today)
        .sort((a: any, b: any) => a.dateObj.getTime() - b.dateObj.getTime())
        .slice(0, 2);
      setEvents(upcoming || []);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  // 🔥 Get upcoming events using React logic

  return (
    <div>
      <div className={` dds-card ${styles.container}`}>
        <h3 className={`dds-section-title ${styles.subcontainer}`}>
          {isAdmin && (
            <i
              className="fas fa-plus"
              onClick={openAdd}
              style={{ cursor: "pointer" }}
            />
          )}

          <i className={`fas fa-calendar-star `} />

          {isArabic ? "الفعاليات القادمة" : "Upcoming Events"}
        </h3>

        <div id="upcoming-events-list" className={styles.upcomingEvents}>
          {loading ? (
            EventSkeleton()
          ) : events.length === 0 ? (
            <p className={styles.errorMsg}>
              {isArabic
                ? "لا توجد فعاليات قادمة في الوقت الحالي."
                : "No upcoming events at the moment."}
            </p>
          ) : (
            events.map((event: any) => {
              const day = event?.EventDate?.getDate();
              const monthIndex = event?.EventDate?.getMonth();
              const monthName = isArabic
                ? arabicMonths[monthIndex]
                : englishMonths[monthIndex];

              return (
                <div className={styles.contentSection} key={event.ID}>
                  <div className={styles.eventBox}>
                    <span className={styles.eventmonth}>{monthName}</span>
                    <span className={styles.eventday}>
                      {String(day).padStart(2, "0")}
                    </span>
                  </div>

                  <div className={styles.eventContent}>
                    <h4 className={styles.eventtitle}>
                      {isArabic ? event?.Event_Ar : event?.Event_En}
                    </h4>
                    <p className={styles.eventdescription}>
                      {isArabic ? event?.Description_Ar : event?.Description_En}
                    </p>
                  </div>

                  <div className={styles.actionButtons}>
                    <i
                      className="fas fa-edit"
                      style={{ color: "#2563eb" }}
                      onClick={() => openEdit(event)}
                    />

                    <i
                      className="fas fa-trash"
                      style={{ color: "#dc2626" }}
                      onClick={() => deleteEvent(event.ID)}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className={`btn-container ${styles.viewAll}`}>
          <a href="departments/events.html" className="dds-btn dds-btn-outline">
            {isArabic ? "عرض كل الفعاليات" : "Show All Events"}
          </a>
        </div>
      </div>

      <CustomModal
        visible={modalOpen}
        title={isEdit ? "Edit Event" : "Add Event"}
        onOk={saveEvent}
        width={500}
        onCancel={() => {
          setErrors({});
          setModalOpen(false);
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* LEFT COLUMN – English */}
          <div>
            <ReInput
              label="Event (EN)"
              placeholder="Event"
              name="Event_En"
              value={form.Event_En}
              onChange={handleChange}
              required
              error={errors?.Event_En}
            />
            <ReTextArea
              label="Description (EN)"
              placeholder="Description"
              name="Description_En"
              value={form.Description_En}
              onChange={handleChange}
              required
              error={errors?.Description_En}
            />
          </div>

          {/* RIGHT COLUMN – Arabic */}
          <div>
            <ReInput
              label="Event (AR)"
              name="Event_Ar"
              placeholder="Event"
              value={form.Event_Ar}
              onChange={handleChange}
              required
              error={errors?.Event_Ar}
            />
            <ReTextArea
              label="Description (AR)"
              name="Description_Ar"
              placeholder="Description"
              value={form.Description_Ar}
              onChange={handleChange}
              required
              error={errors?.Description_Ar}
            />
          </div>

          {/* DATE FIELD FULL WIDTH */}
          <div style={{ gridColumn: "span 2" }}>
            <ReDatePicker
              label="Event Date"
              name="EventDate"
              value={form.EventDate}
              onChange={handleChange}
              required
              error={errors?.EventDate}
            />
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default React.memo(UpcomingEvents);
