import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        cloudinary: {
            createUploadWidget: (
                options: object,
                callback: (err: unknown, result: unknown) => void
            ) => {
                open: () => void;
            };
        };
    }
}

export default function UploadWidget() {
    const cloudinaryRef = useRef<typeof window.cloudinary | null>(null);
    const widgetRef = useRef<{ open: () => void } | null>(null);

    useEffect(() => {
        cloudinaryRef.current = window.cloudinary
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: 'cloudinary',
            uploadPreset: 'cloudinary',
            sources: ['local', 'url', 'camera'],
            clientAllowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
            multiple: false,
            resourceType: 'image',
        }, function (err: unknown, result: unknown) {
            console.log(err, result);
        })
    }, []);

    return (
        <button className="ml-auto bg-lightGreen w-fit px-10 py-2 rounded font-bold cursor-pointer shadow-[0_0_2px_1px_#ccc] hover:bg-lightGreenHover transition-all duration-300 ease-in-out"
                onClick={() => widgetRef.current?.open()}>
            Thêm ảnh
        </button>
    );
};

