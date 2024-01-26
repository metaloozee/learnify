import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="w-full h-[648px] rounded-xl">
            <Skeleton className="h-full w-full" />
        </div>
    )
}
