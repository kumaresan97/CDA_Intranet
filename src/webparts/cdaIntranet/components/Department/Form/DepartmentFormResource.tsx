/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable  @typescript-eslint/no-use-before-define */

import { sp } from '@pnp/sp/presets/all';
import { message, Modal, Skeleton } from 'antd';
import * as React from 'react'
import { useEffect } from 'react';
import CustomDragandDrop from '../../FormInputs/DargandDrop/CustomDragandDrop';
import ReInput from '../../FormInputs/Input/CustomInput';
import CustomModal from '../../modal/Custommodal';
import { useLanguage } from '../../useContext/useContext';
// import ThreeColumnSkeleton from '../../SkeletonLoader/SkeletonLoader';
import styles from "./DepartmentFormResource.module.scss"
export interface IResourceItem {
    Id: number | any;
    Title_En: string;
    Title_Ar: string;
    DepartmentId: any;
    FileRef: string;
    FileLeafRef: string;
}
const DepartmentFormResource = ({ deptId, lang }: any) => {
    const { isAdmin, context } = useLanguage()
    const siteUrl = context.pageContext?.web?.serverRelativeUrl;

    const emptyForm = {
        Id: null,
        Title_En: "",
        Title_Ar: "",
        Icon: null,
        iconUrl: null as string | null,
        fileName: null as string | null,
    };
    const [loading, setLoading] = React.useState<boolean>(false)

    const [modal, setModal] = React.useState({
        open: false,
        mode: "add", // add | edit
        form: emptyForm,
    });
    const isEditMode = !!modal.form.Id;
    const [errors, setErrors] = React.useState<any>({});
    const [resource, setResources] = React.useState<any[]>([])

    const openAddModal = () => {
        setErrors({});
        setModal({
            open: true,
            mode: "add",
            form: emptyForm,
        });
    };
    const getResources = async (deptId: number) => {
        setLoading(true)
        const items = await sp.web.lists
            .getByTitle("Form_Resources")
            .items
            .select(
                "Id",
                "Title_En",
                "Title_Ar",
                "FileRef",
                "FileLeafRef",
                "Department/Id",
                "IsDelete"
            )
            .expand("Department")
            .filter(`Department/Id eq ${deptId} and IsDelete ne 1`)();

        const mappedItems: IResourceItem[] = items.map((item: any) => ({
            Id: item.Id,
            Title_En: item.Title_En,
            Title_Ar: item.Title_Ar,
            FileRef: item.FileRef,
            FileLeafRef: item.FileLeafRef,
            DepartmentId: item.Department?.Id,
        }));

        setResources(mappedItems);
        setLoading(false)
    };

    const getFileIconClass = (fileName: string) => {
        const ext = fileName.split(".").pop()?.toLowerCase();

        switch (ext) {
            case "pdf":
                return "fa-solid fa-file-pdf file-pdf";
            case "doc":
            case "docx":
                return "fa-solid fa-file-word file-word";
            case "xls":
            case "xlsx":
                return "fa-solid fa-file-excel file-excel";
            default:
                return "fa-solid fa-file file-default";
        }
    };
    const handleAdd = async () => {
        try {
            const { Icon, Title_En, Title_Ar }: any = modal.form;
            if (!Icon) {
                message.error("File is required");
                return;
            }

            // const folderUrl = "/sites/CDAIntranet_Dev/Form_Resources";
            // const folderUrl = "/sites/CDAIntranetDevelopment/Form_Resources";
            const folderUrl = `${siteUrl}/Form_Resources`;

            // Upload file
            const result: any = await sp.web
                .getFolderByServerRelativeUrl(folderUrl)
                .files.addUsingPath(Icon.name, Icon, { Overwrite: true });

            const spFile = result.file;

            // Get full file properties
            const fileProps = await spFile.select("ServerRelativeUrl", "Name").get();

            // Update metadata on the List Item
            const item = await spFile.getItem();
            await item.update({
                Title_En,
                Title_Ar,
                // DepartmentId: deptId.id,
                DepartmentId: deptId,
                IsDelete: false,
            });


            // Update local state directly
            setResources(prev => [
                ...prev,
                {
                    Id: item.Id,
                    Title_En,
                    Title_Ar,
                    FileRef: fileProps.ServerRelativeUrl,
                    FileLeafRef: fileProps.Name,
                    // DepartmentId: deptId.id,
                    DepartmentId: deptId,
                },
            ]);

            message.success("Resource added successfully");
        } catch (err) {
            console.error(err);
            message.error("Failed to add resource");
            setLoading(false)
        }
    };

    const handleChange = (name: string, value: any) => {
        setModal((prev) => ({
            ...prev,
            form: {
                ...prev.form,
                [name]: value,
            },
        }));

        // clear error on change
        setErrors((prev: any) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validateForm = (form: any) => {
        const tempErrors: any = {};

        if (!form.Title_En?.trim()) tempErrors.Title_En = "Title (EN) is required";
        if (!form.Title_Ar?.trim()) tempErrors.Title_Ar = "Title (AR) is required";
        if (!form.Icon && !form.iconUrl) tempErrors.Icon = "File is required";

        return tempErrors;
    };

    const handleEdit = async () => {
        try {
            const { Icon, Title_En, Title_Ar, Id }: any = modal.form;
            if (!Id) return;

            const existing = resource.find(r => r.Id === Id);
            if (!existing) {
                message.error("Original file not found");
                return;
            }
            const { FileRef, FileLeafRef } = existing;
            const folderUrl = FileRef.substring(0, FileRef.lastIndexOf("/"));

            // 1️⃣ Delete existing file
            await sp.web.getFileByServerRelativePath(FileRef).delete();

            // 2️⃣ Upload new file (same name OR new name)
            const uploadResult: any = await sp.web
                .getFolderByServerRelativeUrl(folderUrl)
                .files.addUsingPath(
                    Icon ? Icon.name : FileLeafRef,
                    Icon,
                    { Overwrite: true }
                );

            const spFile = uploadResult.file;

            // 3️⃣ Update metadata
            const item = await spFile.getItem();
            await item.update({
                Title_En,
                Title_Ar,
                // DepartmentId: deptId.id
                DepartmentId: deptId
            });

            // 4️⃣ Get correct file info
            const fileProps: any = await spFile
                .select("ServerRelativeUrl", "Name")
                .get();

            // 5️⃣ Update local state
            setResources(prev =>
                prev.map(res =>
                    res.Id === Id
                        ? {
                            ...res,
                            Title_En,
                            Title_Ar,
                            FileRef: fileProps.ServerRelativeUrl,
                            FileLeafRef: fileProps.Name,
                        }
                        : res
                )
            );

            message.success("File updated successfully");
        } catch (err) {
            console.error(err);
            setLoading(false)

            message.error("Failed to update file");
        }
    };
    const handleSoftDelete = async (item: IResourceItem) => {
        let url: any = modal.form.iconUrl
        try {
            setLoading(true)

            const spFile = sp.web.getFileByServerRelativePath(url);
            const listItem = await spFile.getItem();

            await listItem.update({ IsDelete: true });

            // Local state update
            setResources(prev => prev.filter(r => r.Id !== modal.form.Id));
            setModal({ ...modal, open: false, mode: "add" })
            message.success("Resource removed");
            setLoading(false)

        } catch (err) {
            console.error(err);
            message.error("Delete failed");
            setLoading(false)

        }
    };

    const handleSave = async () => {
        // 1️⃣ Validate form first
        const tempErrors = validateForm(modal.form);
        if (Object.keys(tempErrors).length > 0) {
            setErrors(tempErrors);
            return;
        }

        // 2️⃣ Close modal immediately
        setModal(prev => ({ ...prev, open: false }));

        // 3️⃣ Show loader
        setLoading(true);

        try {
            if (modal.mode === "add") {
                await handleAdd();
            } else if (modal.mode === "edit") {
                await handleEdit();
            }
        } catch (err) {
            console.error(err);
            message.error("Operation failed");
        } finally {
            // 4️⃣ Hide loader
            setLoading(false);
        }
    };


    // const handleSave = async () => {
    //     const tempErrors = validateForm(modal.form);
    //     if (Object.keys(tempErrors).length > 0) {
    //         setErrors(tempErrors);
    //         return;
    //     }

    //     setLoading(true)

    //     if (modal.mode === "add") {
    //         await handleAdd()

    //     } else if (modal.mode === "edit") {
    //         await handleEdit()

    //     }
    //     setModal({ ...modal, open: false });
    //     setLoading(false)

    //     // getResources(deptId.id);
    // };
    const openEditModal = (item: IResourceItem) => {
        console.log("item: ", item);
        setErrors({});
        setModal({
            open: true,
            mode: "edit",
            form: {
                Id: item.Id,
                Title_En: item.Title_En,
                Title_Ar: item.Title_Ar,
                Icon: null,
                iconUrl: item.FileRef,
                fileName: item.FileLeafRef,
            },
        });
    };

    const handleDelete = () => {
        Modal.confirm({
            title: "Are you sure want to delete?",
            okType: "danger",
            onOk: handleSoftDelete

        });
    };
    const openPreview = (fileRef?: string) => {
        if (!fileRef) return;

        const safePath = fileRef.replace(/ /g, "%20");
        const fullUrl = `${window.location.origin}${safePath}?web=1`;

        window.open(fullUrl, "_blank", "noopener,noreferrer");
    };


    const renderResourceSkeleton = (rows: number = 3) => {
        return Array.from({ length: rows }).map((_, idx) => (
            <div key={idx} className={styles.resourceCard}>
                {/* Left Icon */}
                <Skeleton.Avatar active size={32} style={{ borderRadius: 4 }} />

                {/* Middle Text */}
                <div style={{ flex: 1, margin: "0 8px" }}>
                    <Skeleton.Input active size="small" style={{ width: "100%" }} />
                </div>

                {/* Right Download Icon */}
                <Skeleton.Avatar active size={24} shape="square" style={{ borderRadius: 4 }} />
            </div>
        ));
    };
    useEffect(() => {
        if (deptId) {
            // getResources(deptId.id);
            getResources(deptId);
        }
    }, [deptId]);


    return (
        <div>
            <section id="resources">
                <h2 className="dds-section-title text-2xl">
                    {isAdmin &&

                        <i className={`fas fa-plus `} onClick={openAddModal}></i>}
                    <i className="fas fa-book-open"></i>
                    {lang ? "النماذج والموارد" : "Forms and Resources"}
                </h2>
                {/* {true ? <ThreeColumnSkeleton></ThreeColumnSkeleton> : */}
                <div className={resource?.length === 0 ? "" : styles.resourceGrid}>
                    {/* {resource.map((item) => {
                        const fileUrl = item.FileRef;

                        return (
                            <a
                                key={item.Id}
                                href={!isAdmin ? fileUrl : undefined}
                                target={!isAdmin ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                className="form-link"
                                onClick={(e) => {
                                    if (isAdmin) {
                                        e.preventDefault();
                                        openEditModal(item);
                                    }
                                }}
                            >
                                <i
                                    className={` ${getFileIconClass(item.FileLeafRef)} ${styles.fileIconImg}`}
                                />

                                <span>
                                    {lang === "ar" ? item.Title_Ar : item.Title_En}
                                </span>

                                <i
                                    className={`fas fa-download ${styles.downloadIcon}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();

                                        const link = document.createElement("a");
                                        link.href = fileUrl;
                                        link.download = item.FileLeafRef;
                                        link.target = "_blank";
                                        link.rel = "noopener noreferrer";
                                        link.click();
                                    }}
                                />
                            </a>
                        );
                    })} */}


                    {loading ? (
                        // Skeleton loader
                        renderResourceSkeleton(3)
                    ) : resource.length === 0 ? (
                        // Empty message
                        <div className="no-data">
                            <i className="fas fa-inbox"></i>
                            <p>{lang ? "لا توجد موارد" : "No resources found"}</p>

                            {/* <p>{lang ? "لم يتم العثور على أي خدمات أو مهام" : "No Service and Tasks found"}</p> */}
                        </div>

                        // <div className={styles.noData}>
                        //     <i className="fas fa-inbox" style={{ fontSize: 24, marginBottom: 8 }}></i>
                        //     <span>{lang ? "لا توجد موارد" : "No resources found"}</span>
                        // </div>
                    ) : (
                        // Actual resource cards
                        resource.map((item) => {
                            const fileUrl = item.FileRef;
                            return (
                                <a
                                    key={item.Id}
                                    href={!isAdmin ? fileUrl : undefined}
                                    target={!isAdmin ? "_blank" : undefined}
                                    rel="noopener noreferrer"
                                    className="form-link"
                                    onClick={(e) => {
                                        if (isAdmin) {
                                            e.preventDefault();
                                            openEditModal(item);
                                        }
                                    }}
                                >
                                    <i className={` ${getFileIconClass(item.FileLeafRef)} ${styles.fileIconImg}`} />
                                    <span>{lang ? item.Title_Ar : item.Title_En}</span>
                                    <i
                                        className={`fas fa-download ${styles.downloadIcon}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            const link = document.createElement("a");
                                            link.href = fileUrl;
                                            link.download = item.FileLeafRef;
                                            link.target = "_blank";
                                            link.rel = "noopener noreferrer";
                                            link.click();
                                        }}
                                    />
                                </a>
                            );
                        })
                    )}

                </div>
                {/* } */}
            </section>
            {modal.open && (
                <CustomModal
                    visible={modal.open}
                    title={modal.mode === "add" ? "Add Resource" : "Edit Resource"}
                    onCancel={() => setModal({ ...modal, open: false })}
                    onDelete={modal.mode === "edit" ? handleDelete : undefined}
                    deleteText="Delete"
                    onOk={() => {
                        handleSave()
                    }}
                >
                    {isEditMode &&
                        <i
                            className="fas fa-external-link-alt linkIcon"
                            onClick={(e) => {
                                e.stopPropagation();
                                setModal({ ...modal, open: false })
                                openPreview(modal.form.iconUrl ?? "")
                            }}
                        />
                    }
                    <div>
                        <ReInput
                            label="Title (EN)"
                            name="Title_En"
                            placeholder='Title'
                            value={modal.form.Title_En}
                            onChange={handleChange}
                            required
                            error={errors?.Title_En}
                        />

                        <ReInput
                            label="Title (AR)"
                            name="Title_Ar"
                            placeholder='Title'
                            value={modal.form.Title_Ar}
                            onChange={handleChange}
                            required
                            error={errors?.Title_Ar}
                        />
                        <CustomDragandDrop
                            file={modal.form.Icon}
                            label="File"
                            required={true}
                            accept="*/*"
                            // accept=".pdf,.doc,.docx"
                            setFile={(f) =>
                                setModal((prev: any) => ({
                                    ...prev,
                                    form: {
                                        ...prev.form,
                                        Icon: f,
                                    },
                                }))
                            }
                            iconUrl={modal.form.iconUrl}
                            fileName={modal.form.fileName}
                            setIconUrl={(v: any) =>
                                setModal((prev) => ({
                                    ...prev,
                                    form: { ...prev.form, iconUrl: v },
                                }))
                            }
                            setFileName={(v: any) =>
                                setModal((prev) => ({
                                    ...prev,
                                    form: { ...prev.form, fileName: v },
                                }))
                            }
                            error={errors?.Icon}
                        />
                    </div>
                </CustomModal>
            )}
        </div>
    )
}

export default DepartmentFormResource
