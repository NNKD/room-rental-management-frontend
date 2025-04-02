export default function ApartmentItem() {
    return (
        <div className="w-fit mx-auto rounded shadow-[0_0_4px_2px_#ddd]">
            <img src="https://ipzhywqybsdvoshfxaij.supabase.co/storage/v1/object/public/images//test.webp" className="rounded-t" alt=""/>
            <div className="p-4">
                <h2 className="font-bold text-xl leading-[1]">Exclusive 5-room residence with a rooftop terrace</h2>
                <p className="text-base text-lightGreen font-bold my-2">495 000€</p>
                <p className="text-base">Barcelona I.</p>
            </div>
        </div>
    )
}