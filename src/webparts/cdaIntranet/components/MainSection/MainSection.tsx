/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-empty-function   */
/* eslint-disable  @typescript-eslint/no-floating-promises  */
import { message, Modal, Skeleton } from "antd";
import * as React from "react";
import { useCallback, useMemo, useState } from "react";
import {
  addServiceItem,
  deleteAttachments,
  deleteServiceItem,
  replaceAttachment,
  toggleFavoriteService,
  updateServiceItem,
  updateViewCount,
} from "../../../Services/ServiceCard/ServiceCard";
import CustomDragandDrop from "../FormInputs/DargandDrop/CustomDragandDrop";
import CustomDropDown from "../FormInputs/Dropdown/CustomDropDown";
import ReInput from "../FormInputs/Input/CustomInput";
import Rating from "../FormInputs/Rating/CustomRating";
import ReTextArea from "../FormInputs/TextArea/CustomTextArea";
import CustomModal from "../modal/Custommodal";
import ServiceCard from "../reusableCard/ServiceCard";
import Search from "../Search/Search";
import { useLanguage } from "../useContext/useContext";
import styles from "./MainSection.module.scss";
import { ICategory } from "../Mainpage";

interface Props {
  serviceData: any[];
  setServicesData: React.Dispatch<React.SetStateAction<any[]>>;
  category: any;
  types: any;
  activeCategory: keyof ICategory;
  lang: string;
  loading?: boolean;
  setLoading: (loading: boolean) => void;
}
const ServicesResources: React.FC<Props> = ({
  serviceData,
  category,
  types,
  setServicesData,
  activeCategory,
  lang,
  loading,
  setLoading,
}) => {
  const { isAdmin } = useLanguage();
  message.config({
    top: 120,
    duration: 2,
    maxCount: 1,
  });
  const langs = lang.startsWith("ar");

  const [searchTerm, setSearchTerm] = useState("");
  const [ismodalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [form, setForm] = useState<any>({
    id: 0,
    Title: "",
    Title_Ar: "",
    Description_En: "",
    Description_Ar: "",
    URL_En: "",
    URL_Ar: "",
    Icon: null,
    Color: "",
    Category_En: "",
    Category_Ar: "",
    Type_En: "",
    Type_Ar: "",
    Rating: 0,
    IsFavorite: false,
    views: 0,
  });
  const [errors, setErrors] = useState<any>({});

  const favorites: any = useMemo(
    () => serviceData.filter((s) => s.IsFavorite).map((s) => s.id),
    [serviceData, searchTerm, activeCategory, langs],
  );

  const handleChange = (name: string, value: any): void => {
    setForm((prev: any) => {
      const updated = { ...prev, [name]: value };
      // Only proceed if category or types are available
      if (category.length > 0) {
        // CATEGORY EN selected → fill AR
        if (name === "Category_En") {
          const sel = category.find((c: any) => c.en === value);
          if (sel) updated.Category_Ar = sel.ar;
        }

        // CATEGORY AR selected → fill EN
        if (name === "Category_Ar") {
          const sel = category.find((c: any) => c.ar === value);
          if (sel) updated.Category_En = sel.en;
        }
      }

      if (types.length > 0) {
        // TYPE EN selected → fill AR
        if (name === "Type_En") {
          const sel = types.find((t: any) => t.en === value);
          if (sel) updated.Type_Ar = sel.ar;
        }

        // TYPE AR selected → fill EN
        if (name === "Type_Ar") {
          const sel = types.find((t: any) => t.ar === value);
          if (sel) updated.Type_En = sel.en;
        }
      }

      return updated;
    });
  };
  // Validate
  const validate = (): boolean => {
    const e: any = {};
    if (!form.Title) e.Title = "Title (EN) is required";
    if (!form.Title_Ar) e.Title_Ar = "Title (AR) is required";
    if (!form.Description_En) e.Description_En = "Description (EN) is required";
    if (!form.Description_Ar) e.Description_Ar = "Description (AR) is required";
    if (!form.Category_En) e.Category_En = "Category (EN) is required";
    if (!form.Category_Ar) e.Category_Ar = "Category (AR) is required";
    if (!form.Type_En) e.Type_En = "Type (EN) is required";
    if (!form.Type_Ar) e.Type_Ar = "Type (AR) is required";
    // if (!form.Icon && !form.iconUrl) {
    //   e.Icon = "Icon is required";
    // }
    // if (!form.Icon) e.Icon = "Icon is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;
    setIsModalOpen(false);

    const payload = {
      Title: form.Title,
      Title_Ar: form.Title_Ar,
      Description_En: form.Description_En,
      Description_Ar: form.Description_Ar,
      URL_En: form.URL_En,
      URL_Ar: form.URL_Ar,
      Color: form.Color,
      Category_En: form.Category_En,
      Category_Ar: form.Category_Ar,
      Type_En: form.Type_En,
      Type_Ar: form.Type_Ar,
      Rating: Number(form.Rating) || 0,
      IsFavorite: !!form.IsFavorite,
      isDelete: !!form.isDelete,
    };

    try {
      setLoading(true);
      let id = editingItem?.id;
      let attachmentUrl = editingItem?.attachmentUrl || "";
      let fileName = editingItem?.fileName || "";

      if (editingItem) {
        await updateServiceItem(id, payload);

        // 🗑 ICON DELETED
        if (!form?.iconUrl && !form?.Icon) {
          await deleteAttachments(id);
          attachmentUrl = "";
          fileName = "";
        }

        // 🔁 ICON REPLACED
        else if (form.Icon instanceof File) {
          const res = await replaceAttachment(id, form.Icon);
          attachmentUrl = res.url;
          fileName = res.fileName;
        }

        // 🟢 KEEP OLD ICON
        else {
          attachmentUrl = editingItem.attachmentUrl;
          fileName = editingItem.fileName;
        }
      } else {
        // ➕ ADD
        id = await addServiceItem(payload, form.Icon);

        if (form.Icon instanceof File) {
          attachmentUrl = `/sites/.../${form.Icon.name}`; // temp
          fileName = form.Icon.name;
        }
      }

      // ✅ Single state update
      setServicesData((prev) =>
        editingItem
          ? prev.map((s) =>
              s.id === id ? { ...s, ...payload, attachmentUrl, fileName } : s,
            )
          : [...prev, { ...payload, id, attachmentUrl, fileName }],
      );

      message.success(editingItem ? "Service updated" : "Service added");
      setEditingItem(null);
    } catch (err) {
      console.error(err);
      message.error("Error while saving service");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item: any): void => {
    Modal.confirm({
      title: "Delete Service?",
      onOk: async () => {
        try {
          setLoading(true);
          await deleteServiceItem(item.id);
          setServicesData((prev) => prev.filter((s) => s.id !== item.id));
        } catch {
          message.error("Failed to delete service");
        } finally {
          setLoading(false);
        }
      },
    });
  };
  // Edit
  const handleEdit = (item: any): void => {
    setEditingItem(item);
    setForm({
      ...item,
      Icon: null,
      iconUrl: item.attachmentUrl,
      fileName: item.fileName,
    });

    setIsModalOpen(true);
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);
  const handleFavoriteToggle = async (item: any): Promise<void> => {
    const newStatus = !item.IsFavorite;

    try {
      await toggleFavoriteService(item.id, newStatus);

      setServicesData((prev) =>
        prev.map((s) =>
          s.id === item.id ? { ...s, IsFavorite: newStatus } : s,
        ),
      );
    } catch {
      message.error("Failed to update favorite");
    }
  };
  const handleViewCount = async (item: any): Promise<void> => {
    const newCount = item.views + 1;

    try {
      await updateViewCount(item.id, newCount);
      // 2. Open URL
      const isExternal = item.URL_En?.startsWith("http");
      const target = isExternal ? "_blank" : "_self";

      window.open(
        item.URL_En,
        target,
        isExternal ? "noopener,noreferrer" : undefined,
      );
      setServicesData((prev) =>
        prev.map((s) => (s.id === item.id ? { ...s, views: newCount } : s)),
      );
    } catch {
      console.error("View update failed");
    }
  };
  const handleAdd = (): void => {
    setErrors({});
    setEditingItem(null);
    setForm({
      id: 0,
      Title: "",
      Title_Ar: "",
      Description_En: "",
      Description_Ar: "",
      URL_En: "",
      URL_Ar: "",
      Icon: null,
      Color: "",
      Category_En: "",
      Category_Ar: "",
      Type_En: "",
      Type_Ar: "",
      Rating: 0,
      IsFavorite: false,
      views: 0,
      isDelete: false,
    });
    setIsModalOpen(true);
  };
  // Skeleton wrapper for multiple cards in grid
  const ServiceSkeletonGrid = ({ count = 6 }): JSX.Element => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "16px",
        }}
      >
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx}>
            <div className="dds-card service-card">
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  height: "100%",
                }}
              >
                {/* Header: Icon + Title */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Skeleton.Avatar active size={34} shape="square" />
                  <Skeleton.Avatar active size={34} shape="square" />
                </div>

                {/* Description */}
                <div style={{ marginTop: 8 }}>
                  <Skeleton
                    active
                    title={false}
                    paragraph={{
                      rows: 2,
                      width: ["90%", "75%"],
                    }}
                  />
                </div>

                {/* Footer Action */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "auto",
                  }}
                >
                  <Skeleton.Input
                    active
                    size="small"
                    style={{ width: "35%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getCategoryLabel = (key?: keyof ICategory): string => {
    if (!key || key === "all" || key === "favorite") return "";

    const map: Record<string, { en: string }> = {
      communication: {
        en: "Communication Platform",
      },
      planning: {
        en: "Planning",
      },
      knowledge: {
        en: "Knowledge Portal",
      },
      policies: {
        en: "Policies",
      },
      innovation: {
        en: "Innovation",
      },
      gov: {
        en: "Government Applications",
      },
      internal: {
        en: "Internal Applications",
      },
      support: {
        en: "Technical Support",
      },
    };

    return map[key]?.en;
  };

  const getCategoryIcon = (key?: keyof ICategory): string => {
    if (!key || key === "all" || key === "favorite") return "";

    const map: Record<string, { icon: string }> = {
      communication: {
        icon: "fas fa-comments",
      },
      planning: {
        icon: "fas fa-tasks",
      },
      knowledge: {
        icon: "fas fa-brain",
      },
      policies: {
        icon: "fas fa-gavel",
      },
      innovation: {
        icon: "fas fa-lightbulb",
      },
      gov: {
        icon: "fas fa-building-columns",
      },
      internal: {
        icon: "fas fa-network-wired",
      },
      support: {
        icon: "fas fa-headset",
      },
    };

    return map[key]?.icon;
  };

  const filteredData = useMemo(() => {
    let filtered = serviceData;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((item) => {
        if (langs) {
          return (
            item.Title_Ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.Description_Ar?.toLowerCase().includes(
              searchTerm.toLowerCase(),
            )
          );
        } else {
          return (
            item.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.Description_En?.toLowerCase().includes(
              searchTerm.toLowerCase(),
            )
          );
        }
      });
    }

    // Category filter
    if (activeCategory === "favorite") {
      filtered = filtered.filter((item) => favorites.includes(item.id));
    } else if (activeCategory !== "all") {
      const label = getCategoryLabel(activeCategory);

      filtered = filtered.filter((item) => item.Category_En === label);
    }

    return filtered;
  }, [serviceData, searchTerm, activeCategory]);

  const renderCardsByType = useCallback(
    (type: string) =>
      filteredData
        .filter((item) => item.Type_En === type)
        .map((item) => (
          <ServiceCard
            key={item.Title}
            item={item}
            isFavorite={favorites.includes(item.id)}
            onFavoriteToggle={() => handleFavoriteToggle(item)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            handleViewCount={() => handleViewCount(item)}
            lang={langs}
            isAdmin={isAdmin}
          />
        )),
    [filteredData, handleFavoriteToggle],
  );
  return (
    <>
      <Search value={searchTerm} onChange={handleSearchChange} />
      {isAdmin && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <i
            onClick={() => {
              handleAdd();
            }}
            className="fas fa-plus"
            style={{
              cursor: "pointer",
              color: "var(--dds-white)",
              fontSize: "1.25rem",
              backgroundColor: "var(--dds-blue-700)",
              borderRadius: "50%",
              padding: "0.40rem",
              margin: "10px 0px",
            }}
          />
        </div>
      )}
      {loading ? (
        ServiceSkeletonGrid({ count: 3 })
      ) : (
        <>
          <section
            id="favorites-section"
            className={favorites?.length === 0 ? styles.hidden : undefined}
            style={{ marginBottom: "2rem" }}
          >
            <h3 className={`dds-section-title ${styles.sectionTitle}`}>
              <i className="fas fa-star text-dds-gold-500" />

              {/* خدماتك المفضلة */}
              {langs ? "خدماتك المفضلة" : "Your Favorite Services"}
            </h3>
            <div className={styles.gridLayout}>
              {favorites.length > 0 ? (
                serviceData
                  .filter((item) => favorites.includes(item.id)) // show only items in favorites
                  .map((item) => (
                    <ServiceCard
                      key={item.id}
                      item={item}
                      isFavorite={true} // always true for this section
                      onFavoriteToggle={() => handleFavoriteToggle(item)}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      handleViewCount={() => handleViewCount(item)}
                      lang={langs}
                      isAdmin={isAdmin}
                    />
                  ))
              ) : (
                <div className={styles.favoritesEmptyBox}>
                  <i className="far fa-star fa-2x" />
                  <p>
                    {langs
                      ? "لم تقم بإضافة أي خدمات للمفضلة بعد."
                      : "You haven't added any services to favorites yet."}
                  </p>
                </div>
              )}
            </div>
          </section>
          {activeCategory === "all" ? (
            <>
              {[
                {
                  type: "general",
                  name: "Communication Platform",
                  arabic: "منصة التواصل",
                  icon: "fas fa-bullhorn",
                  id: "general-section",
                },
                {
                  type: "program",
                  name: "Access to Programs",
                  arabic: "الوصول إلى البرامج",
                  icon: "fas fa-laptop-code",
                  id: "programs-section",
                },
                {
                  type: "library",
                  name: "Libraries & Resources",
                  arabic: "المكتبات والموارد",
                  icon: "fas fa-book-open",
                  id: "libraries-section",
                },
              ].map((value) => {
                return (
                  renderCardsByType(value.type).length > 0 && (
                    <section id="general-section" className={styles.mb8}>
                      <h3
                        className={` dds-section-title ${styles.sectionTitle}`}
                      >
                        <i className={value.icon} />
                        {langs ? value.arabic : value.name}
                      </h3>
                      <div className={styles.gridLayout}>
                        {renderCardsByType(value.type)}
                      </div>
                    </section>
                  )
                );
              })}
            </>
          ) : (
            activeCategory !== "favorite" && (
              <section id="general-section" className={styles.mb8}>
                <h3 className={` dds-section-title ${styles.sectionTitle}`}>
                  <i className={getCategoryIcon(activeCategory)} />
                  {getCategoryLabel(activeCategory)}{" "}
                </h3>
                <div className={styles.gridLayout}>
                  {filteredData
                    .filter(
                      (item) =>
                        item.Category_En === getCategoryLabel(activeCategory),
                    )
                    .map((item) => (
                      <ServiceCard
                        key={item.Title}
                        item={item}
                        isFavorite={favorites.includes(item.id)}
                        onFavoriteToggle={() => handleFavoriteToggle(item)}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        handleViewCount={() => handleViewCount(item)}
                        lang={langs}
                        isAdmin={isAdmin}
                      />
                    ))}
                </div>
              </section>
            )
          )}
        </>
      )}

      {filteredData.length === 0 && (
        <div className={styles.noResults} id="no-results">
          <i className="fas fa-search fa-3x" />
          <h4>{langs ? "لا توجد نتائج مطابقة" : "No Matching Results"}</h4>
          <p>
            {langs
              ? "يرجى المحاولة باستخدام كلمات بحث مختلفة."
              : "Please try again using different search terms."}
          </p>
        </div>
      )}
      {ismodalOpen && (
        <CustomModal
          title="Add Service"
          visible={ismodalOpen}
          onCancel={() => {
            setErrors({});
            setIsModalOpen(false);
          }}
          onOk={handleSubmit}
          width={800}
          bodyHeight="60vh"
        >
          {/* TWO COLUMN GRID */}
          <div className={styles.formGrid}>
            {/* LEFT SIDE – English */}
            <div className={styles.column}>
              <ReInput
                label="Title (EN)"
                name="Title"
                placeholder="Title"
                value={form.Title}
                onChange={handleChange}
                required
                error={errors?.Title}
              />

              <ReTextArea
                label="Description (EN)"
                placeholder="Description"
                name="Description_En"
                value={form.Description_En}
                onChange={handleChange}
                required
                error={errors?.Description_En}
              />

              <CustomDropDown
                label="Category (EN)"
                name="Category_En"
                value={form.Category_En}
                options={category.map((t: any) => ({
                  label: t.en,
                  value: t.en,
                }))}
                required
                placeholder="Select category"
                onChange={handleChange}
                error={errors?.Category_En}
              />

              <CustomDropDown
                label="Type (EN)"
                name="Type_En"
                value={form.Type_En}
                options={types.map((t: any) => ({ label: t.en, value: t.en }))}
                required
                placeholder="Select type"
                onChange={handleChange}
                error={errors?.Type_En}
              />

              <ReTextArea
                placeholder="Enter URL"
                label="URL"
                name="URL_En"
                value={form.URL_En}
                onChange={handleChange}
              />
            </div>

            {/* RIGHT SIDE – Arabic */}
            <div className={styles.column}>
              <ReInput
                label="Title (AR)"
                name="Title_Ar"
                placeholder="Title"
                value={form.Title_Ar}
                onChange={handleChange}
                required
                error={errors?.Title_Ar}
              />

              <ReTextArea
                label="Description (AR)"
                name="Description_Ar"
                placeholder="Description"
                value={form.Description_Ar}
                onChange={handleChange}
                required
                error={errors?.Description_Ar}
              />

              <CustomDropDown
                label="Category (AR)"
                name="Category_Ar"
                value={form.Category_Ar}
                options={category.map((t: any) => ({
                  label: t.ar,
                  value: t.ar,
                }))}
                required
                placeholder="Select category"
                onChange={handleChange}
                error={errors?.Category_Ar}
              />

              <CustomDropDown
                label="Type (AR)"
                name="Type_Ar"
                value={form.Type_Ar}
                options={types.map((t: any) => ({ label: t.ar, value: t.ar }))}
                required
                placeholder="Select type"
                onChange={handleChange}
                error={errors?.Type_Ar}
              />

              <Rating
                value={form?.Rating}
                name="Rating"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* FULL-WIDTH SECTION BELOW GRID */}
          <div className={styles.fullWidthRow}>
            <CustomDragandDrop
              file={form.Icon}
              iconUrl={form.iconUrl}
              fileName={form.fileName}
              accept="image/*"
              setFile={(file) =>
                setForm((prev: any) => ({
                  ...prev,
                  Icon: file,
                }))
              }
              setIconUrl={(url) =>
                setForm((prev: any) => ({
                  ...prev,
                  iconUrl: url,
                }))
              }
              setFileName={(name) =>
                setForm((prev: any) => ({
                  ...prev,
                  fileName: name,
                }))
              }
              error={errors?.Icon}
              label="Icon"
              required={false}
            />
          </div>
        </CustomModal>
      )}
    </>
  );
};

export default ServicesResources;
