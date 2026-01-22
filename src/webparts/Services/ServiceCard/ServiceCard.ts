import { ListName } from "../../cdaIntranet/components/Config/Constant";
import { IService } from "../../cdaIntranet/Type/Interface";
import SpServices from "../SPServices/SpServices";

// // IService.ts
// export interface IService {
//   id: number;
//   title: string;
//   description: string;
//   type: string;
//   category: string;
//   isFavorite: boolean;
//   icon: string;
//   color?: string; // optional custom UI color
//   url?: string; // optional redirect link
//   views?: number;
//   rating?: number;
// }

export const getAllServices = async (): Promise<IService[]> => {
  // Get items and expand attachments
  const items = await SpServices.SPReadItems({
    Listname: ListName.CategoryService,
    Select: "*,AttachmentFiles",
    Expand: "AttachmentFiles",
    Filter: [
      {
        FilterKey: "isDelete",
        Operator: "ne",
        FilterValue: 1,
      },
    ],
    Topcount: 5000,
  });

  // await sp.web.lists
  //   .getByTitle("CategoryService")
  //   .items.filter("isDelete eq false")
  //   .expand("AttachmentFiles")
  //   .getAll();

  // Map items and prepare Icon as File object
  const res: IService[] = items.map((item: any) => {
    // If attachments exist, convert first attachment to File object
    // const iconFile =
    //   item.AttachmentFiles && item.AttachmentFiles.length
    //     ? new File([], item.AttachmentFiles[0].FileName, { type: "image/*" })
    //     : null;

    const attachment = item.AttachmentFiles?.[0];

    return {
      id: item.Id,
      Title: item.Title || "",
      Title_Ar: item.Title_Ar || "",
      Description_En: item.Description_En || "",
      Description_Ar: item.Description_Ar || "",
      URL_En: item.URL_En || "",
      URL_Ar: item.URL_Ar || "",
      Icon: null, // ready for drag-and-drop

      attachmentUrl: attachment?.ServerRelativeUrl || "",
      fileName: attachment?.FileName || "",
      // attachmentUrl:
      //   item.AttachmentFiles && item.AttachmentFiles.length
      //     ? item.AttachmentFiles[0].ServerRelativeUrl
      //     : "",
      Color: item.Color || "",
      Category_En: item.Category_En || "",
      Category_Ar: item.Category_Ar || "",
      Type_En: item.Type_En || "",
      Type_Ar: item.Type_Ar || "",
      Rating: item.Rating || 0,
      IsFavorite: item.IsFavorite || false,
      views: item.Views || 0,
      isDelete: item.isDelete || false,
    };
  });

  return res;
};

/** ADD SERVICE */

export const getCategories = async () => {
  const items = await SpServices.SPReadItems({
    Listname: ListName.Config_Category,
    Topcount: 5000,
  });
  // sp.web.lists.getByTitle("Config_Category").items.getAll();

  return items.map((item: any) => ({
    id: item.Id,
    en: item.Title_En,
    ar: item.Title_Ar,
  }));
};

export const getTypes = async () => {
  const items = await SpServices.SPReadItems({
    Listname: ListName.Type_Config,
    Topcount: 5000,
  });
  //  sp.web.lists.getByTitle("Type_Config").items.getAll();
  return items.map((item: any) => ({
    id: item.Id,
    en: item.Title_En,
    ar: item.Title_Ar,
  }));
};

import { sp } from "@pnp/sp/presets/all";

/* ===================== ADD ===================== */
// export const addServiceItem = async (payload: any): Promise<number> => {
//   try {
//     const res = await SpServices.SPAddItem({
//       Listname: ListName.CategoryService,
//       RequestJSON: payload,
//     });
//     // sp.web.lists
//     //   .getByTitle("CategoryService")
//     //   .items.add(payload);

//     return res.data.Id;
//   } catch (error) {
//     console.error("addServiceItem error:", error);
//     throw error;
//   }
// };

export async function addServiceItem(
  payload: any,
  file?: File | null
): Promise<number> {
  const res = await sp.web.lists
    .getByTitle(ListName.CategoryService)
    .items.add(payload);
  const id = res.data.Id;

  if (file) {
    await res.item.attachmentFiles.add(file.name, file);
  }

  return id;
}

/* ===================== UPDATE ===================== */
export const updateServiceItem = async (id: number, payload: any) => {
  try {
    await SpServices.SPUpdateItem({
      Listname: ListName.CategoryService,
      ID: id,
      RequestJSON: payload,
    });
    // sp.web.lists
    //   .getByTitle("CategoryService")
    //   .items.getById(id)
    //   .update(payload);
  } catch (error) {
    console.error("updateServiceItem error:", error);
    throw error;
  }
};

/* ===================== DELETE (Soft) ===================== */
export const deleteServiceItem = async (id: number) => {
  try {
    await SpServices.SPUpdateItem({
      Listname: ListName.CategoryService,
      ID: id,
      RequestJSON: {
        isDelete: true,
      },
    });
    // sp.web.lists
    //   .getByTitle("CategoryService")
    //   .items.getById(id)
    //   .update({ isDelete: true });
  } catch (error) {
    console.error("deleteServiceItem error:", error);
    throw error;
  }
};

/* ===================== FAVORITE ===================== */
export const toggleFavoriteService = async (id: number, value: boolean) => {
  try {
    await SpServices.SPUpdateItem({
      Listname: ListName.CategoryService,
      ID: id,
      RequestJSON: {
        IsFavorite: value,
      },
    });
    // sp.web.lists
    //   .getByTitle("CategoryService")
    //   .items.getById(id)
    //   .update({ IsFavorite: value });
  } catch (error) {
    console.error("toggleFavoriteService error:", error);
    throw error;
  }
};

/* ===================== VIEW COUNT ===================== */
export const updateViewCount = async (id: number, views: number) => {
  try {
    await SpServices.SPUpdateItem({
      Listname: ListName.CategoryService,
      ID: id,
      RequestJSON: {
        Views: views,
      },
    });
    // sp.web.lists
    //   .getByTitle("CategoryService")
    //   .items.getById(id)
    //   .update({ Views: views });
  } catch (error) {
    console.error("updateViewCount error:", error);
    throw error;
  }
};

/* ===================== ATTACHMENTS ===================== */
// export const replaceAttachment = async (id: number, file: File) => {
//   try {
//     const item = sp.web.lists.getByTitle("CategoryService").items.getById(id);

//     const attachments = await item.attachmentFiles();

//     if (attachments.length > 0) {
//       await item.attachmentFiles.getByName(attachments[0].FileName).delete();
//     }

//     await item.attachmentFiles.add(file.name, file);

//     const newAttachments = await item.attachmentFiles();
//     return newAttachments[0]?.ServerRelativeUrl || "";
//   } catch (error) {
//     console.error("replaceAttachment error:", error);
//     throw error;
//   }
// };

export const replaceAttachment = async (
  id: number,
  file: File
): Promise<{ url: string; fileName: string }> => {
  const item = sp.web.lists.getByTitle("CategoryService").items.getById(id);

  const attachments = await item.attachmentFiles();

  if (attachments.length) {
    await Promise.all(
      attachments.map((a) =>
        item.attachmentFiles.getByName(a.FileName).delete()
      )
    );
  }

  const result: any = await item.attachmentFiles.add(file.name, file);

  return {
    url: result.data.ServerRelativeUrl,
    fileName: file.name,
  };
};
