/* eslint-disable @typescript-eslint/no-explicit-any */
import { sp } from "@pnp/sp/presets/all";

export const EventService = {
  getAll: async () => {
    try {
      const items = await sp.web.lists
        .getByTitle("UpcomingEvents")
        .items.filter("isDelete ne 1")
        .select(
          "Id",
          "Event_En",
          "Event_Ar",
          "Description_En",
          "Description_Ar",
          "EventDate",
          "isDelete",
        )
        .get();

      // 🔥 Format items
      const formatted = items?.map((item: any) => ({
        ID: item.Id,
        Event_En: item.Event_En || "",
        Event_Ar: item.Event_Ar || "",
        Description_En: item.Description_En || "",
        Description_Ar: item.Description_Ar || "",
        EventDate: item.EventDate,
        isDelete: item.isDelete || false,
      }));

      return formatted;
    } catch (err) {
      console.error("Error loading upcoming events:", err);
    }
  },

  add: async (data: any) => {
    return sp.web.lists.getByTitle("UpcomingEvents").items.add({
      Event_En: data.Event_En,
      Event_Ar: data.Event_Ar,
      Description_En: data.Description_En,
      Description_Ar: data.Description_Ar,
      EventDate: data.EventDate,
      isDelete: false,
    });
  },

  update: async (id: number, data: any) => {
    return sp.web.lists.getByTitle("UpcomingEvents").items.getById(id).update({
      Event_En: data.Event_En,
      Event_Ar: data.Event_Ar,
      Description_En: data.Description_En,
      Description_Ar: data.Description_Ar,
      EventDate: data.EventDate,
    });
  },

  delete: async (id: number) => {
    return sp.web.lists
      .getByTitle("UpcomingEvents")
      .items.getById(id)
      .update({ isDelete: true });
  },
};
