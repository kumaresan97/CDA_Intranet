/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable   @typescript-eslint/no-use-before-define */


import * as React from 'react'
import { useEffect } from 'react';
import { EventService } from '../../../Services/Upcoming/UpcomingService';
import ReDatePicker from '../Datepicker/CustomDatePicker';
import ReInput from '../Input/CustomInput';
import CustomModal from '../modal/Custommodal';
import styles from "./UpcomingEvents.module.scss"
import { Modal } from "antd";
import ReTextArea from '../TextArea/CustomTextArea';

// interface EventItem {
//     title: string;
//     description: string;
//     date: string;
// }

// interface Props {
//     eventsData: EventItem[];
// }

// const UpcomingEvents = ({ eventsData }: Props) => {
const UpcomingEvents = ({ eventsData }: any) => {
    console.log("eventsData: ", eventsData);


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
    console.log("events: ", events);

    // MODAL STATE
    const [modalOpen, setModalOpen] = React.useState(false);
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
    });

    // Set field
    const handleChange = (name: string, value: any) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // OPEN ADD MODAL
    const openAdd = () => {
        setIsEdit(false);
        setEditId(null);
        setErrors({})
        setForm({
            ID: null,
            Event_En: "",
            Event_Ar: "",
            Description_En: "",
            Description_Ar: "",
            EventDate: null
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


        });

        debugger;

        setModalOpen(true);
    };

    // SAVE (ADD / UPDATE)
    const saveEvent = async () => {

        if (!validateForm()) return; // stop if validation fails

        if (isEdit && editId) {
            // Update
            await EventService.update(editId, form);

            setEvents(prev =>
                prev.map(ev =>
                    ev.ID === form.ID ? { ...form, ID: editId } : ev
                )
            );


        } else {
            // Add
            const res = await EventService.add(form);
            setEvents(prev => [
                ...prev,
                { ...form, ID: res.data.ID }
            ]);
        }

        setModalOpen(false);
    };

    // DELETE
    const deleteEvent = async (id: number) => {
        // await EventService.delete(id);
        // setEvents(prev => prev.filter(ev => ev.ID !== id));
        Modal.confirm({
            title: "Delete Confirmation",
            content: "Are you sure you want to delete this event?",
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                await EventService.delete(id);
                setEvents(prev => prev.filter(ev => ev.ID !== id));
            }
        });



    };




    const [errors, setErrors] = React.useState<{
        [key: string]: string;
    }>({});
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!form.Event_En?.trim()) newErrors.Event_En = "Event English is required";
        if (!form.Event_Ar?.trim()) newErrors.Event_Ar = "Event Arabic is required";
        if (!form.Description_En?.trim()) newErrors.Description_En = "Description English is required";
        if (!form.Description_Ar?.trim()) newErrors.Description_Ar = "Description Arabic is required";
        if (!form.EventDate) newErrors.EventDate = "Event Date is required";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // true if no errors
    };


    useEffect(() => {

        const fetchEvents = async () => {
            const data = await EventService.getAll();
            console.log("data: ", data);

            const upcoming = data?.map((event: any) => ({ ...event, EventDate: new Date(event.EventDate), dateObj: new Date(event.EventDate) }))
                .filter((event: any) => event.dateObj >= today)
                .sort((a: any, b: any) => a.dateObj.getTime() - b.dateObj.getTime())
                .slice(0, 2);
            setEvents(upcoming || []);
        };
        fetchEvents();

    }, [])


    // 🔥 Get upcoming events using React logic

    return (
        <div>
            <div className={` dds-card ${styles.container}`}>
                <h3 className={`dds-section-title ${styles.subcontainer}`}>
                    <i className="fas fa-plus" onClick={openAdd} style={{ cursor: "pointer" }}></i>


                    <i className={`fas fa-calendar-star `}></i>الفعاليات القادمة
                </h3>

                {/* <div className={styles.headerRow}>
                    <h3 className={styles.title}>
                        <i className="fas fa-calendar-star"></i>
                        الفعاليات القادمة
                    </h3>

                    <div
                        className={styles.addBtn}
                    // onClick={() => openModal("add", null)}
                    >
                        <i className="fas fa-plus"></i>
                        إضافة
                    </div>
                </div> */}
                <div id="upcoming-events-list" className={styles.upcomingEvents}>

                    {events.map((event: any) => {
                        // const day = event.dateObj.getDate();
                        // const monthName = arabicMonths[event.dateObj.getMonth()];
                        const day = event?.EventDate?.getDate();
                        const monthName = arabicMonths[event?.EventDate?.getMonth()];

                        return (

                            <div className={styles.contentSection} key={event.ID}>
                                <div className={styles.eventBox}>
                                    <span className={styles.eventmonth}>{monthName}</span>
                                    <span className={styles.eventday}>
                                        {String(
                                            day
                                        ).padStart(2, "0")}
                                    </span>
                                </div>
                                <div className={styles.eventContent}>
                                    <h4 className={styles.eventtitle}>{
                                        event?.Event_En
                                    }</h4>
                                    <p className={styles.eventdescription}>{
                                        event?.Description_En

                                    }</p>
                                </div>

                                <div className={styles.actionButtons}>
                                    <i
                                        className="fas fa-edit"
                                        style={{ color: "#2563eb" }}
                                        onClick={() => openEdit(event)}
                                    // onClick={() => openModal("edit", event)}
                                    ></i>

                                    <i
                                        className="fas fa-trash"
                                        style={{ color: "#dc2626" }}
                                        onClick={() => deleteEvent(event.ID)}
                                    // onClick={() => deleteEvent(event.ID)}
                                    ></i>
                                </div>
                            </div>)
                    }
                    )}

                </div>
                <div className={`btn-container ${styles.viewAll}`} >
                    <a href="departments/events.html" className="dds-btn dds-btn-outline">
                        عرض كل الفعاليات
                    </a>
                </div>
            </div>

            <CustomModal
                visible={modalOpen}
                title={isEdit ? "تعديل الفعالية" : "إضافة فعالية"}
                onOk={saveEvent}
                onCancel={() => {
                    setErrors({})

                    setModalOpen(false)
                }
                }
            >
                <ReInput label="Event English" name="Event_En" value={form.Event_En} onChange={handleChange} required
                    error={errors?.Event_En}

                />
                <ReInput label="Event Arabic" name="Event_Ar" value={form.Event_Ar} onChange={handleChange} required
                    error={errors?.Event_Ar}
                />
                {/* <ReInput label="Description (English)" name="Description_En" value={form.Description_En} onChange={handleChange} required
                    error={errors?.Description_En}
                /> */}


                <ReTextArea label="Description (EN)" name="Description_En"
                    value={form.Description_En} onChange={handleChange}
                    required error={errors?.Description_En}
                />
                {/* <ReInput label="Description Arabic" name="Description_Ar" value={form.Description_Ar} onChange={handleChange} required
                    error={errors?.Description_Ar}
                /> */}

                <ReTextArea label="Description (AR)" name="Description_Ar"
                    value={form.Description_Ar} onChange={handleChange}
                    required error={errors?.Description_Ar}
                />
                <ReDatePicker label="Event Date" name="EventDate" value={form.EventDate} onChange={handleChange} required
                    error={errors?.EventDate}
                />
            </CustomModal>


        </div>
    )
}

export default UpcomingEvents
