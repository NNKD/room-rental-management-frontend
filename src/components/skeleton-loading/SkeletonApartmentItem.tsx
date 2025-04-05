export default function SkeletonApartmentItem() {
    return (
        <div className="w-full mx-auto rounded shadow-[0_0_4px_2px_#ddd] hover:shadow-[0_0_6px_4px_#bbb] transition-all duration-300 ease-in-out flex flex-col h-full">
            <div className="overflow-hidden rounded-t aspect-[4/3] flex-shrink-0">
                <div className="bg-zinc-300 w-full h-full animate-pulse"></div>
            </div>
            <div className="p-4 flex-grow">
                <div className="bg-zinc-300 w-full h-6 rounded-full animate-pulse"></div>
                <div className="bg-zinc-300 w-full h-4 rounded-full my-3 animate-pulse"></div>
                <div className="bg-zinc-300 w-full h-4 rounded-full animate-pulse"></div>
            </div>
        </div>
    )
}