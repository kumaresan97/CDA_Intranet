import { sp } from "@pnp/sp/presets/all";

export const getSpeechPageData = async () => {
  const items = await sp.web.lists
    .getByTitle("HeroSection")
    .items.select(
      "Id",
      "Title",
      "Title_Ar",
      "Description_En",
      "Description",
      "Name_En",
      "Name_Ar",
      "Designation_En",
      "Designation_Ar",
      "About_En",
      "About_Ar",
      "AttachmentFiles"
    )
    .expand("AttachmentFiles")();

  if (items?.length > 0) {
    const item = items[0];
    const imageUrl =
      item.AttachmentFiles.length > 0
        ? item.AttachmentFiles[0].ServerRelativeUrl
        : null;

    let data = [
      {
        id: item.Id,
        title: item.Title,
        titleAr: item.Title_Ar,
        descEn: item.Description_En,
        descAr: item.Description,
        nameEn: item.Name_En,
        nameAr: item.Name_Ar,
        designationEn: item.Designation_En,
        designationAr: item.Designation_Ar,
        image: imageUrl,
        About_En: item?.About_En,
        About_Ar: item?.About_Ar,
      },
    ];
    return data;
  }
};
