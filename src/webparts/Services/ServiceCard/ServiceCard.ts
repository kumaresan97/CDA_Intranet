/* eslint-disable @rushstack/no-new-null */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ListName } from "../../cdaIntranet/components/Config/Constant";
import { IService } from "../../cdaIntranet/Type/Interface";
import SpServices from "../SPServices/SpServices";
import { sp } from "@pnp/sp/presets/all";

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

  // Map items and prepare Icon as File object
  const res: IService[] = items.map((item: any) => {
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
  return items.map((item: any) => ({
    id: item.Id,
    en: item.Title_En,
    ar: item.Title_Ar,
  }));
};

export async function addServiceItem(
  payload: any,
  file?: File | null,
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
  } catch (error) {
    console.error("updateViewCount error:", error);
    throw error;
  }
};

export const replaceAttachment = async (
  id: number,
  file: File,
): Promise<{ url: string; fileName: string }> => {
  const item = sp.web.lists.getByTitle("CategoryService").items.getById(id);

  const attachments = await item.attachmentFiles();

  if (attachments.length) {
    await Promise.all(
      attachments.map((a) =>
        item.attachmentFiles.getByName(a.FileName).delete(),
      ),
    );
  }

  const result: any = await item.attachmentFiles.add(file.name, file);

  return {
    url: result.data.ServerRelativeUrl,
    fileName: file.name,
  };
};
