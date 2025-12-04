import { sp } from "@pnp/sp/presets/all";

export interface INewsImage {
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
    .delete();
};
