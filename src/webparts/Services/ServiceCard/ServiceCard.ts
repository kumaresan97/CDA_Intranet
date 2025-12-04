// IService.ts
export interface IService {
  id: number;
  title: string;
  description: string;
  type: string;
  category: string;
  isFavorite: boolean;
  icon: string;
  color?: string; // optional custom UI color
  url?: string; // optional redirect link
  views?: number;
  rating?: number;
}

// ServiceResource.ts
import { sp } from "@pnp/sp/presets/all";

const LIST_NAME = "CategoryService";

/** -----------------------------
 * MAP SP ITEM → UI FRIENDLY ITEM
 * ----------------------------- */
const mapService = (item: any): IService => ({
  id: item.Id,
  title: item.Title,
  description: item.Description_En,
  type: item.Type_En,
  category: item.Category_En,
  isFavorite: item.IsFavorite === true,
  icon: item.Icon,
  color: item.Color || "#0070a4", // default
  url: item.Url_En || "",
  views: item.Views || 0,
  rating: item.Rating || 0,
});

/** GET ALL SERVICES */
// export const getAllServices = async (): Promise<IService[]> => {
//   try {
//     const items = await sp.web.lists
//       .getByTitle(LIST_NAME)
//       .items.select("*")
//       .get();

//     return items.map(mapService);
//   } catch (err) {
//     console.error("❌ Error loading services", err);
//     return [];
//   }
// };

// import { sp } from "@pnp/sp/presets/all";
// import { ServiceItem } from "../ServiceCard/ServiceCard";

// export const getAllServices = async (): Promise<any[]> => {
//   const items = await sp.web.lists.getByTitle("CategoryService").items.getAll();

//   return items.map((item: any) => ({
//     id: item.Id,
//     Title: item.Title || "",
//     Title_Ar: item.Title_Ar || "",
//     Description_En: item.Description_En || "",
//     Description_Ar: item.Description_Ar || "",
//     URL_En: item.URL_En || "",
//     URL_Ar: item.URL_Ar || "",
//     Icon: item.Icon || "",
//     Color: item.Color || "",
//     Category_En: item.Category_En || "",
//     Category_Ar: item.Category_Ar || "",
//     Type_En: item.Type_En || "",
//     Type_Ar: item.Type_Ar || "",
//     Rating: item.Rating || 0,
//     IsFavorite: item.IsFavorite || false,
//     views: item.views || 0, // optional, if you have a views column
//   }));
// };

export const getAllServices = async (): Promise<any[]> => {
  // Get items and expand attachments
  const items = await sp.web.lists
    .getByTitle("CategoryService")
    .items.expand("AttachmentFiles")
    .getAll();
  console.log("items: ", items);

  // Map items and prepare Icon as File object
  const res = items.map((item: any) => {
    // If attachments exist, convert first attachment to File object
    const iconFile =
      item.AttachmentFiles && item.AttachmentFiles.length
        ? new File([], item.AttachmentFiles[0].FileName, { type: "image/*" })
        : null;

    return {
      id: item.Id,
      Title: item.Title || "",
      Title_Ar: item.Title_Ar || "",
      Description_En: item.Description_En || "",
      Description_Ar: item.Description_Ar || "",
      URL_En: item.URL_En || "",
      URL_Ar: item.URL_Ar || "",
      Icon: iconFile, // ready for drag-and-drop
      attachmentUrl:
        item.AttachmentFiles && item.AttachmentFiles.length
          ? item.AttachmentFiles[0].ServerRelativeUrl
          : "",
      Color: item.Color || "",
      Category_En: item.Category_En || "",
      Category_Ar: item.Category_Ar || "",
      Type_En: item.Type_En || "",
      Type_Ar: item.Type_Ar || "",
      Rating: item.Rating || 0,
      IsFavorite: item.IsFavorite || false,
      views: item.views || 0,
    };
  });
  console.log(res, "response");

  return res;
};

/** ADD SERVICE */
export const addService = async (data: Partial<IService>) => {
  try {
    const res = await sp.web.lists.getByTitle(LIST_NAME).items.add(data);
    return mapService({ Id: res.data.Id, ...data });
  } catch (err) {
    console.error("❌ Add service error", err);
    return null;
  }
};

/** UPDATE SERVICE */
export const updateService = async (id: number, data: Partial<IService>) => {
  try {
    await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).update(data);
    return { id, ...data }; // return merged changes
  } catch (err) {
    console.error("❌ Update service error", err);
    return null;
  }
};

/** DELETE SERVICE */
export const deleteService = async (id: number) => {
  try {
    await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).delete();
    return true;
  } catch (err) {
    console.error("❌ Delete service error", err);
    return false;
  }
};
