import { sp } from "@pnp/sp/presets/all";
import { ListName } from "../../cdaIntranet/components/Config/Constant";

export interface INewsImage {
  id?: number;
  Name: string;
  ServerRelativeUrl: string;
}

// GET all images from library
export const getNewsImages = async (): Promise<INewsImage[]> => {
  const files = await sp.web
    .getFolderByServerRelativeUrl("NewsCarousel")
    .files.get();
  return files.map((f) => ({
    Name: f.Name,
    ServerRelativeUrl: f.ServerRelativeUrl,
  }));
};

// UPLOAD new image
export const addNewsImage = async (file: File): Promise<void> => {
  await sp.web
    .getFolderByServerRelativeUrl("NewsCarousel")
    .files.add(file.name, file, true);
};

// DELETE image
export const deleteNewsImage = async (fileName: string): Promise<void> => {
  await sp.web
    .getFolderByServerRelativeUrl("NewsCarousel")
    .files.getByName(fileName)
    .recycle();
};

export const getNewsList = async (iscarousel = false) => {
  const items = await sp.web.lists
    .getByTitle(ListName.News_Details)
    .items.select(
      "ID",
      "Title",
      "Title_Ar",
      "Summary_EN",
      "Summary_AR",
      "Category_En",
      "Category_Ar",
      "ViewCount",
      "NewsDate",
      "IsDelete"
    )
    .filter("IsDelete ne 1")
    .expand("AttachmentFiles")
    .orderBy("Created", false)
    .get();

  return iscarousel
    ? items.map((item) => ({
        id: item.ID,
        Name:
          item.AttachmentFiles?.length > 0
            ? item.AttachmentFiles[0].FileName
            : "",
        ServerRelativeUrl:
          item.AttachmentFiles?.length > 0
            ? item.AttachmentFiles[0].ServerRelativeUrl
            : "",
      }))
    : items.map((item: any) => ({
        id: item.ID,
        Title: item.Title,
        Title_Ar: item.Title_Ar,
        Summary_EN: item.Summary_EN,
        Summary_AR: item.Summary_AR,
        Category_En: item.Category_En,
        Category_Ar: item.Category_Ar,
        ViewCount: item.ViewCount || 0,
        NewsDate: item.NewsDate,
        Image: null,
        imgUrl:
          item.AttachmentFiles?.length > 0
            ? item.AttachmentFiles[0].ServerRelativeUrl
            : null,
        FileName:
          item.AttachmentFiles?.length > 0
            ? item.AttachmentFiles[0].FileName
            : null,
      }));
};

export const getNewsById = async (id: number) => {
  const item = await sp.web.lists
    .getByTitle(ListName.News_Details)
    .items.getById(id)
    .select(
      "ID",
      "Title",
      "Title_Ar",
      "Summary_EN",
      "Summary_AR",
      "Category_En",
      "Category_Ar",
      "ViewCount",
      "NewsDate",
      "IsDelete"
    )
    .expand("AttachmentFiles")
    .get();
  console.log("item: ", item);
  debugger;

  return {
    id: item.ID,
    title: item.Title,
    titleAr: item.Title_Ar,
    summary: item.Summary_EN,
    summaryAr: item.Summary_AR,
    category: item.Category_En,
    categoryAr: item.Category_Ar,
    views: item.ViewCount || 0,
    date: item.NewsDate,
    image:
      item.AttachmentFiles?.length > 0
        ? item.AttachmentFiles[0].ServerRelativeUrl
        : null,
  };
};

export const incrementNewsView = async (id: number, currentViews: number) => {
  await sp.web.lists
    .getByTitle(ListName.News_Details)
    .items.getById(id)
    .update({
      ViewCount: currentViews + 1,
    });
};
