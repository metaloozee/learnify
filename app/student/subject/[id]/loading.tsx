import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="mt-20 flex flex-col gap-10 w-full">
            <div className="flex flex-col gap-5 w-full">
                <Skeleton className="w-2/5 h-10" />
                <Skeleton className="w-1/2 h-5" />
                <Skeleton className="w-2/3 h-5" />
            </div>

            <div className="mt-10 flex flex-row gap-5 w-full flex-wrap">
                <Skeleton className="w-2/5 h-20" />
                <Skeleton className="w-2/5 h-20" />
                <Skeleton className="w-2/5 h-20" />
            </div>
        </div>
    )
}
