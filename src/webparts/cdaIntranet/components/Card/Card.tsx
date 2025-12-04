import * as React from "react";

export interface IServiceItem {
    title: string;
    description: string;
    category: string;
    type: "program" | "library" | "general" | string;
    icon?: string;
    color?: string;
    url?: string;
    views?: number;
    rating?: number;
}

interface IServiceCardProps {
    item: IServiceItem;
    isFavorite: boolean;
    onToggleFavorite: (title: string) => void;
}

const Card: React.FC<IServiceCardProps> = ({
    item,
    isFavorite,
    onToggleFavorite,
}) => {
    const rating = item.rating ?? 0;
    const full = Math.floor(rating);
    const empty = 5 - full;

    const isAnchor = Boolean(item.url && item.url !== "#");
    const isExternal = isAnchor && /^https?:\/\//i.test(item.url || "");

    const Wrapper: any = isAnchor ? "a" : "div";
    const wrapperProps: any = isAnchor
        ? {
            href: item.url,
            ...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {}),
        }
        : {};

    const bgColor =
        item.color && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(item.color)
            ? `${item.color}1A`
            : "transparent";

    return (
        <Wrapper
            {...wrapperProps}
            className="
        dds-card service-card flex flex-col p-4 
        bg-white rounded-xl shadow-sm hover:shadow-md 
        transition cursor-pointer
      "
            data-title={item.title.toLowerCase()}
        >
            {/* TOP ROW */}
            <div className="flex justify-between items-start mb-3">
                <div
                    className="w-12 h-12 flex items-center justify-center rounded-lg"
                    style={{ backgroundColor: bgColor }}
                >
                    {item.icon ? (
                        <i className={`${item.icon} text-2xl`} style={{ color: item.color }}></i>
                    ) : null}
                </div>

                {/* Favorite Button */}
                <button
                    className={`text-xl transition z-10 ${isFavorite ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"
                        }`}
                    aria-pressed={isFavorite}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onToggleFavorite(item.title);
                    }}
                >
                    <i className={isFavorite ? "fas fa-star" : "far fa-star"}></i>
                </button>
            </div>

            {/* BODY */}
            <div className="flex-grow text-center">
                <h4 className="font-bold text-md text-gray-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-500 mb-4">{item.description}</p>
            </div>

            {/* FOOTER */}
            <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                    {isAnchor ? (
                        <span className="text-sm font-bold text-blue-600 hover:underline">
                            فتح <i className="fas fa-arrow-left ml-1 text-xs"></i>
                        </span>
                    ) : (
                        <a
                            href={item.url || "#"}
                            className="text-sm font-bold text-blue-600 hover:underline"
                        >
                            فتح <i className="fas fa-arrow-left ml-1 text-xs"></i>
                        </a>
                    )}

                    <span className="text-xs text-gray-400 flex items-center gap-1">
                        <i className="fas fa-eye"></i> {(item.views ?? 0).toLocaleString()}
                    </span>

                    <div className="flex gap-2">
                        <i
                            className="fas fa-edit text-blue-600 cursor-pointer"
                            onClick={() => console.log("edit", item.title)}
                        />
                        <i
                            className="fas fa-trash text-red-600 cursor-pointer"
                            onClick={() => console.log("delete", item.title)}
                        />
                    </div>
                </div>

                {/* RATING */}
                {rating > 0 && (
                    <div className="flex items-center justify-center gap-1 mt-2 text-xs">
                        {Array.from({ length: full }).map((_, i) => (
                            <i key={`f${i}`} className="fas fa-star text-yellow-400"></i>
                        ))}
                        {Array.from({ length: empty }).map((_, i) => (
                            <i key={`e${i}`} className="far fa-star text-gray-300"></i>
                        ))}
                    </div>
                )}


            </div>
        </Wrapper>
    );
};

export default Card;
