/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable  @typescript-eslint/no-use-before-define */

import { message, Modal, Skeleton } from "antd";
import * as React from "react";
import {
  getChoiceDropdownOptions,
  ServiceTaskService,
} from "../../../../Services/Department/DepartmentService";
import { IModalState, ServiceState } from "../../../Type/Interface";
import CustomDragandDrop from "../../FormInputs/DargandDrop/CustomDragandDrop";
import CustomDropDown from "../../FormInputs/Dropdown/CustomDropDown";
import ReInput from "../../FormInputs/Input/CustomInput";
import CustomModal from "../../modal/Custommodal";
import { useLanguage } from "../../useContext/useContext";
import styles from "./DepartmentService.module.scss";
const defaultimg: any = require("../../../assets/images/global.png");

const DepartmentService = ({ deptId, lang }: any) => {
  const { isAdmin } = useLanguage();
  const [loading, setLoading] = React.useState<boolean>(false);

  // const [Service, setService] = React.useState<any[]>([])
  const [Service, setService] = React.useState<ServiceState>({});

  const [errors, setErrors] = React.useState<any>({});
  const [itemTypeMap, setItemTypeMap] = React.useState<
    { en: string; ar: string }[]
  >([]);

  const emptyForm = {
    id: null,
    title: "",
    title_Ar: "",
    DeptType_En: "",
    DeptType_Ar: "",
    Icon: null,
    iconUrl: null as string | null,
    fileName: null as string | null,
  };

  const [modal, setModal] = React.useState<IModalState>({
    open: false,
    mode: "add",
    form: emptyForm,
  });

  const openAddModal = () => {
    setModal({
      open: true,
      mode: "add",
      form: emptyForm,
    });
  };
  const openEditModal = (item: any) => {
    console.log("item: ", item);
    setModal({
      open: true,
      mode: "edit",
      form: {
        id: item.id,
        title: item.title,
        title_Ar: item.titleAr,
        DeptType_En: item.DeptType_En,
        DeptType_Ar: item.DeptType_Ar,
        iconUrl: item.imageUrl,
        fileName: item.fileName,
        Icon: null,
      },
    });
  };

  const closeModal = () => {
    setModal((prev) => ({
      ...prev,
      open: false,
    }));

    setErrors({});
    // setLoading(false)
  };
  const handleChange = (name: string, value: any) => {
    setModal((prev) => {
      const updatedForm = {
        ...prev.form,
        [name]: value,
      };

      // EN → AR sync
      if (name === "DeptType_En") {
        const match = itemTypeMap.find((m) => m.en === value);
        if (match) {
          updatedForm.DeptType_Ar = match.ar;
        }
      }

      // AR → EN sync
      if (name === "DeptType_Ar") {
        const match = itemTypeMap.find((m) => m.ar === value);
        if (match) {
          updatedForm.DeptType_En = match.en;
        }
      }

      return {
        ...prev,
        form: updatedForm,
      };
    });

    setErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Are you sure want delete?",
      content: "This action cannot be undone",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: deleteService,
    });
  };

  const deleteService = async () => {
    setLoading(true);

    try {
      await ServiceTaskService.deleteService(modal.form.id);

      setService((prev) => {
        const newState = { ...prev };
        const type: any = Object.keys(prev).find((t: any) =>
          prev[t].items.some((it: any) => it.id === modal.form.id),
        );

        if (type) {
          // Remove the item
          newState[type].items = newState[type].items.filter(
            (it: any) => it.id !== modal.form.id,
          );

          // If no items left, remove the category
          if (newState[type].items.length === 0) {
            delete newState[type];
          }
        }

        return newState;
      });

      message.success("Service deleted");
      closeModal();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete service");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const loadItemTypeChoices = async () => {
    const result = (await getChoiceDropdownOptions(
      ["DeptType_En", "DeptType_Ar"],
      "Service_Task",
    )) as Record<string, any[]>;
    console.log("result: ", result);

    const enOptions = result.DeptType_En || [];
    const arOptions = result.DeptType_Ar || [];

    if (enOptions.length !== arOptions.length) {
      console.error("ItemType EN/AR choice count mismatch");
    }

    const map = enOptions.map((en, index) => ({
      en: en.value,
      ar: arOptions[index]?.value || "",
    }));

    setItemTypeMap(map);
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!modal.form.title?.trim()) {
      newErrors.title = "Title (EN) is required";
    }

    if (!modal.form.title_Ar?.trim()) {
      newErrors.title_Ar = "Title (AR) is required";
    }

    if (!modal.form.DeptType_En) {
      newErrors.DeptType_En = "Item Type (EN) is required";
    }

    if (!modal.form.DeptType_Ar) {
      newErrors.DeptType_Ar = "Item Type (AR) is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    closeModal();

    try {
      setLoading(true);

      if (modal.mode === "add") {
        await ServiceTaskService.addService(modal.form, deptId);
      } else {
        await ServiceTaskService.updateService(modal.form);
      }

      await getServiedata();
      message.success(
        modal.mode === "add" ? "Service added" : "Service updated",
      );
    } catch {
      setLoading(false);

      message.error("Operation failed");
    }
  };

  const renderServices = () => {
    // 1. Skeleton
    if (loading) {
      return (
        <>
          {[1].map((i) => (
            <div key={i} className={styles.departmentSection}>
              <Skeleton.Input
                active
                size="small"
                style={{ width: 200, marginBottom: 12 }}
              />

              <div className={styles.serviceGrid}>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className={styles.serviceCard}>
                    <Skeleton.Avatar
                      active
                      shape="square"
                      size={32}
                      style={{ borderRadius: 4 }}
                    />
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 200, height: 18 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      );
    }

    // 2. No data found
    if (!Service || Object.keys(Service).length === 0) {
      return (
        <div className="no-data">
          <i className="fas fa-inbox" />
          <p>
            {lang
              ? "لم يتم العثور على أي خدمات أو مهام"
              : "No Service and Tasks found"}
          </p>
        </div>
      );
    }

    // 3. Normal render
    return Object.values(Service).map((group: any) => (
      <div key={group.DeptType_En} className={styles.departmentSection}>
        <h3
          style={{
            textAlign: lang ? "right" : "left",
          }}
        >
          {lang ? group.DeptType_Ar : group.DeptType_En}
        </h3>

        <div className={styles.serviceGrid}>
          {group.items.map((item: any) => (
            <div
              key={item.id}
              className={styles.serviceCard}
              onClick={() => isAdmin && openEditModal(item)}
            >
              <img
                src={item.imageUrl || defaultimg}
                alt={item.fileName}
                className={styles.serviceIcon}
              />
              <div className={styles.serviceTitleContainer}>
                <h4>{lang ? item.titleAr : item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  const getServiedata = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await ServiceTaskService.getServices(deptId);
      setService(data);
    } catch (err) {
      console.log("err: ", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [deptId]);

  React.useEffect(() => {
    getServiedata();
    loadItemTypeChoices();
  }, []);
  const itemTypeEnOptions = itemTypeMap.map((i) => ({
    label: i.en,
    value: i.en,
  }));

  const itemTypeArOptions = itemTypeMap.map((i) => ({
    label: i.ar,
    value: i.ar,
  }));
  return (
    <div>
      <section className={styles.servicesSection}>
        <h2 className={` dds-section-title ${styles.ddsSectionTitle}`}>
          {isAdmin && <i className="fas fa-plus" onClick={openAddModal} />}

          <i className="fas fa-concierge-bell" />
          {lang ? "الخدمات والمهام" : "Services and Tasks"}
        </h2>
        <div className={styles.servicesContainer}>{renderServices()}</div>
      </section>

      {modal.open && (
        <CustomModal
          visible={modal.open}
          title={modal.mode === "add" ? "Add Services" : "Edit Services"}
          onCancel={closeModal}
          onOk={handleSubmit}
          onDelete={modal.mode === "edit" ? handleDelete : undefined}
          deleteText="Delete"
          width={500}
        >
          <div className="form-flex-tiles ">
            <div className="form-row">
              <ReInput
                label="Title (EN)"
                name="title"
                placeholder="Title"
                value={modal.form.title}
                onChange={handleChange}
                required
                error={errors?.title}
              />
              <ReInput
                label="Title (AR)"
                name="title_Ar"
                placeholder="Title"
                value={modal.form.title_Ar}
                onChange={handleChange}
                required
                error={errors?.title_Ar}
              />
            </div>
            <div className="form-row ">
              <CustomDropDown
                label="DepartmentType (EN)"
                name="DeptType_En"
                value={modal.form.DeptType_En}
                options={itemTypeEnOptions}
                placeholder="Select department"
                required
                onChange={handleChange}
                error={errors?.DeptType_En}
              />

              <CustomDropDown
                label="DepartmentType (AR)"
                name="DeptType_Ar"
                value={
                  itemTypeMap.find((i) => i.en === modal.form.DeptType_En)
                    ?.ar ?? null
                }
                options={itemTypeArOptions}
                placeholder="اختر القسم"
                required
                onChange={handleChange}
                error={errors?.DeptType_Ar}
              />
            </div>
            <div className="form-row-full">
              <CustomDragandDrop
                file={modal.form.Icon}
                label="Icon"
                required={false}
                accept="image/*"
                setFile={(f) =>
                  setModal((prev) => ({
                    ...prev,
                    form: {
                      ...prev.form,
                      Icon: f,
                    },
                  }))
                }
                iconUrl={modal.form.iconUrl}
                fileName={modal.form.fileName}
                setIconUrl={(v) =>
                  setModal((prev) => ({
                    ...prev,
                    form: { ...prev.form, iconUrl: v },
                  }))
                }
                setFileName={(v) =>
                  setModal((prev) => ({
                    ...prev,
                    form: { ...prev.form, fileName: v },
                  }))
                }
                error={errors?.Icon}
              />
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default DepartmentService;
