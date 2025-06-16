import { useEffect, useRef } from "react";
import { envVar } from "../utils/EnvironmentVariables.ts";
import { useTranslation } from "react-i18next";

declare global {
    interface Window {
        cloudinary: {
            createUploadWidget: (
                object: object,
                callback: (err: unknown, result: { event: string; info: unknown }) => void
            ) => { open: () => void };
        };
    }
}

export default function UploadWidget({ onGetImgUrl }: { onGetImgUrl: (url: string) => void }) {
    const cloudinaryRef = useRef<typeof window.cloudinary | null>(null);
    const widgetRef = useRef<{ open: () => void } | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current?.createUploadWidget(
            {
                cloudName: envVar.CLOUD_NAME,
                uploadPreset: envVar.UPLOAD_PRESET,
                sources: ["local"],
                clientAllowedFormats: ["jpg", "png", "jpeg", "webp"],
                multiple: false,
                resourceType: "image",
            },
            function (err: unknown, result: { event: string; info: unknown }) {
                if (result.event === "success") {
                    const info = result.info as { secure_url: string };
                    let url = info.secure_url;
                    url = url.replace("/upload/", "/upload/f_webp/");
                    onGetImgUrl(url);
                } else {
                    console.log(err, result);
                }
            }
        );
    }, []);

    return (
        <button
            className="ml-auto bg-lightGreen w-fit px-10 py-2 rounded font-bold cursor-pointer shadow-[0_0_2px_1px_#ccc] hover:bg-lightGreenHover transition-all duration-300 ease-in-out"
            onClick={() => widgetRef.current?.open()}
        >
            {t("add_image")}
        </button>
    );
}