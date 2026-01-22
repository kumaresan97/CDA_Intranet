import { sp } from "@pnp/sp/presets/all";
import { ListName } from "../../cdaIntranet/components/Config/Constant";
import { ServiceState } from "../../cdaIntranet/Type/Interface";
import SpServices from "../SPServices/SpServices";

type DropdownOption = { label: string; value: string };

export const getChoiceData = async (
  Field: string,
  Listname: string
): Promise<string[]> => {
  try {
    const res: any = await SpServices.SPGetChoices({
      Listname: Listname,
      FieldName: Field,
    });
    return res?.Choices || [];
  } catch (err) {
    console.error("Error fetching choice data:", err);
    return [];
  }
};
export async function getChoiceDropdownOptions(
  fields: string | string[],
  Listname: string
): Promise<DropdownOption[] | Record<string, DropdownOption[]>> {
  if (typeof fields === "string") {
    try {
      const choices = await getChoiceData(fields, Listname);
      return choices.map((item) => ({ label: item, value: item }));
    } catch (err) {
      console.error("Error in getChoiceDropdownOptions (single):", err);
      return [];
    }
  } else if (Array.isArray(fields)) {
    const result: Record<string, DropdownOption[]> = {};
    try {
      await Promise.all(
        fields.map(async (field) => {
          const choices = await getChoiceData(field, Listname);
          result[field] = choices.map((item) => ({ label: item, value: item }));
        })
      );
      return result;
    } catch (err) {
      console.error("Error in getChoiceDropdownOptions (multiple):", err);
      return {};
    }
  }

  // This return handles invalid inputs just in case
  return Array.isArray(fields) ? {} : [];
}

const LIST_NAME = ListName.Service_Task;

export const ServiceTaskService = {
  async getServices(deptId: number): Promise<ServiceState> {
    const items = await sp.web.lists
      .getByTitle(LIST_NAME)
      .items.filter(`DepartmentId eq ${deptId} and IsDelete ne 1`)
      .select(
        "Id",
        "Title",
        "Title_Ar",
        "DeptType_En",
        "DeptType_Ar",
        "AttachmentFiles"
      )
      .expand("AttachmentFiles")
      .orderBy("Id")();

    return items.reduce((acc: ServiceState, item: any) => {
      const type = item.DeptType_En;
      if (!type) return acc;

      if (!acc[type]) {
        acc[type] = {
          DeptType_En: type,
          DeptType_Ar: item.DeptType_Ar,
          items: [],
        };
      }

      const attachment = item.AttachmentFiles?.[0];

      acc[type].items.push({
        id: item.Id,
        title: item.Title,
        titleAr: item.Title_Ar,
        DeptType_En: type,
        DeptType_Ar: item.DeptType_Ar,
        imageUrl: attachment?.ServerRelativeUrl || "",
        fileName: attachment?.FileName || "",
      });

      return acc;
    }, {});
  },

  async addService(form: any, deptId: number) {
    const item = await sp.web.lists.getByTitle(LIST_NAME).items.add({
      Title: form.title,
      Title_Ar: form.title_Ar,
      DeptType_En: form.DeptType_En,
      DeptType_Ar: form.DeptType_Ar,
      DepartmentId: deptId,
    });

    if (form.Icon) {
      await item.item.attachmentFiles.add(form.Icon.name, form.Icon);
    }

    return item.data.Id;
  },

  async updateService(form: any) {
    const item = sp.web.lists.getByTitle(LIST_NAME).items.getById(form.id);

    await item.update({
      Title: form.title,
      Title_Ar: form.title_Ar,
      DeptType_En: form.DeptType_En,
      DeptType_Ar: form.DeptType_Ar,
    });

    if (form.Icon) {
      const files = await item.attachmentFiles();
      await Promise.all(
        files.map((f: any) =>
          item.attachmentFiles.getByName(f.FileName).delete()
        )
      );
      await item.attachmentFiles.add(form.Icon.name, form.Icon);
    }
  },

  async deleteService(id: number) {
    await sp.web.lists
      .getByTitle(LIST_NAME)
      .items.getById(id)
      .update({ IsDelete: true });
  },
};
