"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"

import { Input } from "@/components/ui/input"

export const Search = ({ placeholder }: { placeholder: string }) => {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set("query", term)
        } else {
            params.delete("query")
        }
        replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="relative max-w-lg">
            <MagnifyingGlassIcon className="absolute left-3 top-1/4 w-5 h-5" />
            <Input
                type="notes"
                className="shadow-sm pl-10"
                placeholder={placeholder}
                onChange={(e) => {
                    handleSearch(e.target.value)
                }}
                defaultValue={searchParams.get("query")?.toString()}
            />
        </div>
    )
}
