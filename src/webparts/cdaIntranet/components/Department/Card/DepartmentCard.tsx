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
const DefaultImg: any = require("../../../assets/images/Policies.png")


import "./DepartmentCard.module.scss"
import { useLanguage } from "../../useContext/useContext";
interface PolicyItem {
    id: number | any;
    title: string;
    title_Ar: string;
    Url: string;
    Icon: File | null;
    iconUrl?: string;
    fileName?: string;
    isDelete?: boolean;
}
interface ResourceSectionProps {
    id: any,
    lang: any
}
// const ResourceSection: React.FC<ResourceSectionProps> = ({ sectionTitle, sectionIcon, resources }) => {
const ResourceSection: React.FC<ResourceSectionProps> = ({
    id, lang

}) => {
    const { isAdmin } = useLanguage()
    const [isopen, setisOpen] = useState(false)
    const [errors, setErrors] = useState<any>({});
    const [isloading, setLoading] = useState(false)
    const [policies, setPolicies] = useState<PolicyItem[]>([]);
    // const [editingItem, setEditingItem] = useState<PolicyItem | null>(null);
    const [form, setForm] = useState<PolicyItem>({
        id: null,
        title: "",
        title_Ar: "",
        Url: "",
        iconUrl: "",
        fileName: "",
        Icon: null as File | null
    })

    const isEditMode = !!form.id;

    const handleAdd = () => {
        // setEditingItem(null);
        setForm({
            id: null,
            title: "",
            title_Ar: "",
            Url: "",
            Icon: null
        });
        setErrors({})
        setisOpen(true);
    };
    const handleEdit = (item: PolicyItem) => {
        // setEditingItem(item);
        setForm({
            id: item.id,
            title: item.title,
            title_Ar: item.title_Ar,
            Url: item.Url,
            iconUrl: item.iconUrl,
            fileName: item.fileName,
            Icon: null // only change IF uploading new
        });
        setErrors({})

        setisOpen(true);
    };

    const handleCancel = () => {
        setisOpen(false)
        setErrors({})

        // setEditingItem(null);
    }

    const handleDelete = () => {
        Modal.confirm({
            title: "Are you sure want delete?",
            okType: "danger",
            onOk: async () => {
                await sp.web.lists
                    .getByTitle("Config_Policies_Guidelines")
                    .items.getById(form.id)
                    .update({ IsDelete: true });

                setPolicies(prev => prev.filter(p => p.id !== form.id));
                message.success("Policy deleted");
                handleCancel();
            }
        });
    };


    const addPolicy = async () => {
        const res = await sp.web.lists
            .getByTitle("Config_Policies_Guidelines")
            .items.add({
                Title: form.title,
                Title_Ar: form.title_Ar,
                Url: form.Url,
                // DepartmentId: id.id
                DepartmentId: id
            });

        let iconUrl = "";
        let fileName = "";

        if (form.Icon) {
            const file: any = await sp.web.lists
                .getByTitle("Config_Policies_Guidelines")
                .items.getById(res.data.Id)
                .attachmentFiles.add(form.Icon.name, form.Icon);

            iconUrl = file.data.ServerRelativeUrl;
            fileName = form.Icon.name;
        }

        setPolicies(prev => [
            ...prev,
            {
                id: res.data.Id,
                title: form.title,
                title_Ar: form.title_Ar,
                Url: form.Url,
                Icon: null,
                iconUrl,
                fileName
            }
        ]);

        // message.success("Policy added successfully");
    };

    const updatePolicy = async () => {
        await sp.web.lists
            .getByTitle("Config_Policies_Guidelines")
            .items.getById(form.id)
            .update({
                Title: form.title,
                Title_Ar: form.title_Ar,
                Url: form.Url
            });

        let iconUrl = form.iconUrl;
        let fileName = form.fileName;

        if (form.Icon) {
            const item = sp.web.lists
                .getByTitle("Config_Policies_Guidelines")
                .items.getById(form.id);

            const files = await item.attachmentFiles();
            if (files.length) {
                await item.attachmentFiles.getByName(files[0].FileName).delete();
            }

            const file: any = await item.attachmentFiles.add(form.Icon.name, form.Icon);
            iconUrl = file.data.ServerRelativeUrl;
            fileName = form.Icon.name;
        }

        setPolicies(prev =>
            prev.map(p =>
                p.id === form.id
                    ? { ...p, title: form.title, title_Ar: form.title_Ar, Url: form.Url, iconUrl, fileName }
                    : p
            )
        );

        // message.success("Policy updated successfully");
    };

    const handleOk = async () => {
        if (!validateForm()) return;

        // 1️⃣ Close modal immediately
        handleCancel();

        // 2️⃣ Show loader
        setLoading(true);

        try {
            if (form.id) {
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


    // const handleOk = async () => {
    //     if (!validateForm()) return;

    //     if (isEditMode) {
    //         await updatePolicy();
    //     } else {
    //         await addPolicy();
    //     }

    //     setisOpen(false);
    // };

    const validateForm = () => {
        const newErrors: any = {};

        if (!form.title?.trim()) {
            newErrors.title = "Title (EN) is required";
        }

        if (!form.title_Ar?.trim()) {
            newErrors.title_Ar = "Title (AR) is required";
        }

        if (!form.Url?.trim()) {
            newErrors.Url = "URL is required";
        }

        if (!form.iconUrl && !form.Icon) {
            newErrors.Icon = "Icon is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    const handleChange = (name: string, value: any) => {
        setForm((prev: any) => ({
            ...prev,
            [name]: value
        }));
    };

    const renderPolicySkeleton = () => {
        return (
            < >
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="resource-card"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "center",
                            padding: "1.25rem",
                            borderRadius: "0.5rem"
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
                        <Skeleton.Input
                            active
                            size="small"
                            style={{ width: "70%" }}
                        />
                    </div>
                ))}
            </>
        );
    };

    const renderEmptyState = () => (
        <div className="no-data">
            <i className="fas fa-inbox"></i>
            <p>{lang ? "لا توجد سياسات أو أدلة" : "No Policies or Guidelines found"}</p>
        </div>
    );


    const loadDeptData = async () => {
        setLoading(true)
        try {
            const polData = await sp.web.lists
                .getByTitle("Config_Policies_Guidelines")
                .items
                // .filter(`DepartmentId eq ${id.id} and IsDelete ne 1`)
                .filter(`DepartmentId eq ${id} and IsDelete ne 1`)
                .select("Id,Title,Title_Ar,Url,AttachmentFiles")
                .expand("AttachmentFiles")();

            const mappedPol: PolicyItem[] = polData.map((p: any) => ({
                id: p.Id,
                title: p.Title,
                title_Ar: p.Title_Ar,
                Url: p.Url || "",
                Icon: null,
                fileName: p.AttachmentFiles?.length > 0 ? p.AttachmentFiles[0].FileName : "",
                iconUrl:
                    p.AttachmentFiles?.length > 0
                        ? p.AttachmentFiles[0].ServerRelativeUrl
                        : "",

            }));

            setPolicies(mappedPol);
        }
        catch (err) {
            setLoading(false)
            console.log(err)
        }
        finally {
            setLoading(false)
        }
    }
    React.useEffect(() => {
        loadDeptData()

    }, [])
    return (
        <>
            {/* {isloading ?
                (
                    <section className="resource-section">
                        <div className="dds-section-title skeleton-header">
                            <div className="skeleton-btn" />
                            <div className="skeleton-title" />
                        </div>

                        <div className="resources-grid">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="resource-card skeleton-card">
                                    <div className="skeleton-icon" />
                                    <div className="skeleton-text" />
                                    <div className="skeleton-actions">
                                        <span />
                                        <span />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )
                :
                <section className="resource-section">
                    
                    <h2 className=" dds-section-title text-2xl" >
                        {isAdmin &&
                            <i className="fas fa-plus" onClick={handleAdd}></i>}
                        <i className="fas fa-gavel" style={{ margin: "0 10px" }}></i>
                        {lang ? "السياسات والأدلة" : "Policies and Guidelines"}

                    </h2>
                    <div className="resources-grid">
                        {policies.map((res: PolicyItem, index: number) => (
                            <a
                                key={index}
                                onClick={(e) => {
                                    if (isAdmin) {
                                        e.preventDefault();
                                        handleEdit(res);
                                    } else {
                                        if (res?.Url) {
                                            window.open(res.Url, "_blank", "noopener,noreferrer");
                                        }
                                    }
                                }}
                                rel="noopener noreferrer"
                                className="resource-card"
                                style={{
                                    display: "block",
                                    textAlign: "center",
                                    padding: "1.25rem",
                                    borderRadius: "0.5rem"
                                }}
                            >
                                <img src={res.iconUrl} alt="" className={`resource-icon`} />
                                <h3 className="resource-title">{res.title}</h3>
                            </a>
                        ))}
                    </div>
                </section>
            } */}
            <section className="resource-section">

                <h2 className=" dds-section-title text-2xl" >
                    {isAdmin &&
                        <i className="fas fa-plus" onClick={handleAdd}></i>}
                    <i className="fas fa-gavel"
                    // style={{ margin: "0 10px" }}
                    ></i>
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
                                    borderRadius: "0.5rem"
                                }}
                            >
                                <img src={res.iconUrl || DefaultImg} alt="" className="resource-icon" />
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
                    title="Add"
                    width={500}
                    onCancel={handleCancel}
                    onOk={handleOk}
                    onDelete={isEditMode ? handleDelete : undefined}
                    deleteText="Delete " >
                    <>
                        {/* <Button onClick={() => {

                            if (form?.Url) {
                                window.open(form.Url, "_blank", "noopener,noreferrer");
                            }
                        }
                        }>Click</Button> */}

                        {isEditMode &&

                            <i
                                className="fas fa-external-link-alt linkIcon"
                                onClick={(e) => {

                                    e.stopPropagation();
                                    handleCancel()

                                    if (form.Url) {
                                        window.open(form.Url, "_blank", "noopener,noreferrer");
                                    }
                                }}
                            />
                        }

                        <div className="form-flex-tiles">

                            <div className="form-row">
                                <ReInput
                                    label="Title (EN)"
                                    name="title"
                                    placeholder='Title'
                                    value={form.title}
                                    onChange={handleChange}

                                    required
                                    error={errors.title}
                                />

                                <ReInput
                                    label="Title (AR)"
                                    name="title_Ar"
                                    placeholder='Title'
                                    value={form.title_Ar}
                                    onChange={handleChange}
                                    required
                                    error={errors.title_Ar}
                                />
                            </div>
                            <ReTextArea
                                label="Url"
                                placeholder='Url'
                                name="Url"
                                value={form.Url}
                                onChange={handleChange}
                                required
                                error={errors.Url}
                            />
                            <CustomDragandDrop
                                file={form.Icon}
                                setFile={(file) => handleChange("Icon", file)}
                                // setFile={(file) => setForm({ ...form, Icon: file })}
                                iconUrl={form.iconUrl}
                                fileName={form.fileName}
                                error={errors.Icon}
                                label={"Icon"}
                                required

                                setIconUrl={(v: any) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        iconUrl: v,
                                    }))
                                }
                                setFileName={(v: any) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        fileName: v,
                                    }))
                                }
                            />
                        </div>
                    </>
                </CustomModal>
            )
            }
        </>
    );
};

export default ResourceSection;
