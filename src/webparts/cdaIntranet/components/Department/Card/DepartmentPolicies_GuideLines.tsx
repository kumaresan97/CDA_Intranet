/* eslint-disable @rushstack/no-new-null */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable  @typescript-eslint/no-use-before-define */
// ResourceSection.tsx
import { sp } from "@pnp/sp/presets/all";
import { Modal, Skeleton } from "antd";
import * as React from "react";
import { useState } from "react";
import CustomDragandDrop from "../../FormInputs/DargandDrop/CustomDragandDrop";
import ReInput from "../../FormInputs/Input/CustomInput";
import ReTextArea from "../../FormInputs/TextArea/CustomTextArea";
import CustomModal from "../../modal/Custommodal";
import { message } from "antd";
import "./DepartmentCard.module.scss";
import { useLanguage } from "../../useContext/useContext";

const DefaultImg: any = require("../../../assets/images/global.png");

interface PolicyItem {
  id: number | any;
  mode: "add" | "edit";
  title: string;
  title_Ar: string;
  Url: string;
  Icon: File | null;
  iconUrl?: string;
  fileName?: string;
  isDelete?: boolean;
}
interface ResourceSectionProps {
  id: any;
  lang: any;
}

const ResourceSection: React.FC<ResourceSectionProps> = ({ id, lang }) => {
  const { isAdmin } = useLanguage();
  const [isopen, setisOpen] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isloading, setLoading] = useState(false);
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [modal, setModal] = useState<PolicyItem>({
    id: null,
    mode: "add",
    title: "",
    title_Ar: "",
    Url: "",
    iconUrl: "",
    fileName: "",
    Icon: null as File | null,
  });

  const isEditMode = !!modal.id;

  const handleAdd = () => {
    setModal({
      id: null,
      mode: "add",
      title: "",
      title_Ar: "",
      Url: "",
      Icon: null,
    });
    setErrors({});
    setisOpen(true);
  };
  const handleEdit = (item: PolicyItem) => {
    setModal({
      id: item.id,
      mode: "edit",
      title: item.title,
      title_Ar: item.title_Ar,
      Url: item.Url,
      iconUrl: item.iconUrl,
      fileName: item.fileName,
      Icon: null, // only change IF uploading new
    });
    setErrors({});

    setisOpen(true);
  };

  const handleCancel = () => {
    setisOpen(false);
    setErrors({});
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Are you sure want delete?",
      okType: "danger",
      onOk: async () => {
        await sp.web.lists
          .getByTitle("Config_Policies_Guidelines")
          .items.getById(modal.id)
          .update({ IsDelete: true });

        setPolicies((prev) => prev.filter((p) => p.id !== modal.id));
        message.success("Policy deleted");
        handleCancel();
      },
    });
  };

  const addPolicy = async () => {
    const res = await sp.web.lists
      .getByTitle("Config_Policies_Guidelines")
      .items.add({
        Title: modal.title,
        Title_Ar: modal.title_Ar,
        Url: modal.Url,
        DepartmentId: id,
      });

    let iconUrl = "";
    let fileName = "";

    if (modal.Icon) {
      const file: any = await sp.web.lists
        .getByTitle("Config_Policies_Guidelines")
        .items.getById(res.data.Id)
        .attachmentFiles.add(modal.Icon.name, modal.Icon);

      iconUrl = file.data.ServerRelativeUrl;
      fileName = modal.Icon.name;
    }

    setPolicies((prev) => [
      ...prev,
      {
        id: res.data.Id,
        mode: "add",
        title: modal.title,
        title_Ar: modal.title_Ar,
        Url: modal.Url,
        Icon: null,
        iconUrl,
        fileName,
      },
    ]);
  };

  const updatePolicy = async () => {
    await sp.web.lists
      .getByTitle("Config_Policies_Guidelines")
      .items.getById(modal.id)
      .update({
        Title: modal.title,
        Title_Ar: modal.title_Ar,
        Url: modal.Url,
      });

    let iconUrl = modal.iconUrl;
    let fileName = modal.fileName;

    if (modal.Icon) {
      const item = sp.web.lists
        .getByTitle("Config_Policies_Guidelines")
        .items.getById(modal.id);

      const files = await item.attachmentFiles();
      if (files.length) {
        await item.attachmentFiles.getByName(files[0].FileName).delete();
      }

      const file: any = await item.attachmentFiles.add(
        modal.Icon.name,
        modal.Icon,
      );
      iconUrl = file.data.ServerRelativeUrl;
      fileName = modal.Icon.name;
    }

    if (!modal?.iconUrl && !modal?.Icon) {
      const item = sp.web.lists
        .getByTitle("Config_Policies_Guidelines")
        .items.getById(modal?.id);
      const attachments = await item.attachmentFiles();

      if (attachments.length > 0) {
        await Promise.all(
          attachments.map((a) =>
            item.attachmentFiles.getByName(a.FileName).delete(),
          ),
        );
      }
    }

    setPolicies((prev) =>
      prev.map((p) =>
        p.id === modal.id
          ? {
              ...p,
              title: modal.title,
              title_Ar: modal.title_Ar,
              Url: modal.Url,
              iconUrl,
              fileName,
            }
          : p,
      ),
    );
  };

  const handleOk = async () => {
    if (!validatemodal()) return;

    handleCancel();

    // 2️⃣ Show loader
    setLoading(true);

    try {
      if (modal.id) {
        await updatePolicy();
        message.success("Policy updated successfully");
      } else {
        await addPolicy();
        message.success("Policy added successfully");
      }
    } catch (err) {
      console.error(err);
      message.error("Operation failed");
    } finally {
      // 3️⃣ Stop loader
      setLoading(false);
    }
  };

  const validatemodal = () => {
    const newErrors: any = {};

    if (!modal.title?.trim()) {
      newErrors.title = "Title (EN) is required";
    }

    if (!modal.title_Ar?.trim()) {
      newErrors.title_Ar = "Title (AR) is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: string, value: any) => {
    setModal((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderPolicySkeleton = () => {
    return (
      <>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="resource-card"
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              padding: "1.25rem",
              borderRadius: "0.5rem",
            }}
          >
            {/* Icon */}
            <Skeleton.Avatar
              active
              size={36}
              shape="square"
              style={{ marginBottom: 12 }}
            />

            {/* Title */}
            <Skeleton.Input active size="small" style={{ width: "70%" }} />
          </div>
        ))}
      </>
    );
  };

  const renderEmptyState = () => (
    <div className="no-data">
      <i className="fas fa-inbox" />
      <p>
        {lang ? "لا توجد سياسات أو أدلة" : "No Policies or Guidelines found"}
      </p>
    </div>
  );

  const loadDeptData = async () => {
    setLoading(true);
    try {
      const polData = await sp.web.lists
        .getByTitle("Config_Policies_Guidelines")
        .items.filter(`DepartmentId eq ${id} and IsDelete ne 1`)
        .select("Id,Title,Title_Ar,Url,AttachmentFiles")
        .expand("AttachmentFiles")();

      const mappedPol: PolicyItem[] = polData.map((p: any) => ({
        id: p.Id,
        mode: "add",
        title: p.Title,
        title_Ar: p.Title_Ar,
        Url: p.Url || "",
        Icon: null,
        fileName:
          p.AttachmentFiles?.length > 0 ? p.AttachmentFiles[0].FileName : "",
        iconUrl:
          p.AttachmentFiles?.length > 0
            ? p.AttachmentFiles[0].ServerRelativeUrl
            : "",
      }));

      setPolicies(mappedPol);
    } catch (err) {
      setLoading(false);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    loadDeptData();
  }, []);
  return (
    <>
      <section className="resource-section">
        <h2 className=" dds-section-title text-2xl">
          {isAdmin && <i className="fas fa-plus" onClick={handleAdd} />}
          <i className="fas fa-gavel" />
          {lang ? "السياسات والأدلة" : "Policies and Guidelines"}
        </h2>

        <div className={policies?.length === 0 ? "" : "resources-grid"}>
          {isloading && renderPolicySkeleton()}

          {!isloading && policies.length === 0 && renderEmptyState()}

          {!isloading &&
            policies.length > 0 &&
            policies.map((res: PolicyItem, index: number) => (
              <a
                key={index}
                onClick={(e) => {
                  if (isAdmin) {
                    e.preventDefault();
                    handleEdit(res);
                  } else if (res?.Url) {
                    window.open(res.Url, "_blank", "noopener,noreferrer");
                  }
                }}
                className="resource-card"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "1.25rem",
                  borderRadius: "0.5rem",
                }}
              >
                <img
                  src={res.iconUrl || DefaultImg}
                  alt=""
                  className="resource-icon"
                />
                <h3 className="resource-title">
                  {lang ? res.title_Ar : res.title}
                </h3>
              </a>
            ))}
        </div>
      </section>

      {isopen && (
        <CustomModal
          visible={isopen}
          title={modal.mode === "add" ? "Add Policies" : "Edit Policies"}
          width={500}
          onCancel={handleCancel}
          onOk={handleOk}
          onDelete={isEditMode ? handleDelete : undefined}
          deleteText="Delete "
        >
          <>
            {isEditMode && modal.Url && (
              <i
                className="fas fa-external-link-alt linkIcon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();

                  window.open(modal.Url, "_blank", "noopener,noreferrer");
                }}
              />
            )}

            <div className="modal-flex-tiles">
              <div className="modal-row">
                <ReInput
                  label="Title (EN)"
                  name="title"
                  placeholder="Title"
                  value={modal.title}
                  onChange={handleChange}
                  required
                  error={errors.title}
                />

                <ReInput
                  label="Title (AR)"
                  name="title_Ar"
                  placeholder="Title"
                  value={modal.title_Ar}
                  onChange={handleChange}
                  required
                  error={errors.title_Ar}
                />
              </div>
              <ReTextArea
                label="Url"
                placeholder="Url"
                name="Url"
                value={modal.Url}
                onChange={handleChange}
                required={false}
                error={errors.Url}
              />
              <CustomDragandDrop
                file={modal.Icon}
                setFile={(file) => handleChange("Icon", file)}
                iconUrl={modal.iconUrl}
                fileName={modal.fileName}
                accept="image/*"
                error={errors.Icon}
                label={"Icon"}
                required={false}
                setIconUrl={(v: any) =>
                  setModal((prev) => ({
                    ...prev,
                    iconUrl: v,
                  }))
                }
                setFileName={(v: any) =>
                  setModal((prev) => ({
                    ...prev,
                    fileName: v,
                  }))
                }
              />
            </div>
          </>
        </CustomModal>
      )}
    </>
  );
};

export default ResourceSection;
