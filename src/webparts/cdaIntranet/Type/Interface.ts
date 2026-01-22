export interface IService {
  id: number;
  Title: string;
  Title_Ar: string;
  Description_En: string;
  Description_Ar: string;
  URL_En: string;
  URL_Ar: string;
  Icon: File | null;
  attachmentUrl: string;
  fileName?: string;
  Color: string;
  Category_En: string;
  Category_Ar: string;
  Type_En: string;
  Type_Ar: string;
  Rating: number;
  IsFavorite: boolean;
  views: number;
  isDelete: boolean;
}

export interface ILookup {
  id: number;
  en: string;
  ar: string;
}

export interface INews {
  en: string;
  ar: string;
}

export interface IServiceItem {
  id: number;
  title: string;
  titleAr: string;
  DeptType_En: string;
  DeptType_Ar: string;
  imageUrl?: string;
  fileName?: string;
}

export interface IServiceGroup {
  DeptType_En: string;
  DeptType_Ar: string;
  items: IServiceItem[];
}

export type ServiceState = Record<string, IServiceGroup>;

export interface IModalForm {
  id: number | any;
  title: string;
  title_Ar: string;
  DeptType_En: string;
  DeptType_Ar: string;
  Icon: File | null;
  iconUrl: string | null;
  fileName: string | null;
}

export interface IModalState {
  open: boolean;
  mode: "add" | "edit";
  form: IModalForm;
}

export interface IListName {
  CategoryService: string;
  Config_Category: string;
  Type_Config: string;
  Service_Task: string;
  News_Details: string;
}
