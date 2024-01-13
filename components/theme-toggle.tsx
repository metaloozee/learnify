"use client"

import * as React from "react"
import { MonitorSmartphone, MoonStar, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export const ModeToggle = () => {
    const { setTheme, theme } = useTheme()

    return (
        <div className="w-full flex md:justify-start justify-center">
            <ToggleGroup
                size={"sm"}
                type="single"
                className="w-fit border rounded-full p-1"
                defaultValue={theme}
            >
                <ToggleGroupItem
                    className="rounded-full"
                    onClick={() => setTheme("system")}
                    value="system"
                    aria-label="Toggle system"
                >
                    <MonitorSmartphone className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                    className="rounded-full"
                    onClick={() => setTheme("light")}
                    value="light"
                    aria-label="Toggle light"
                >
                    <Sun className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                    className="rounded-full"
                    onClick={() => setTheme("dark")}
                    value="dark"
                    aria-label="Toggle dark"
                >
                    <MoonStar className="h-4 w-4" />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    )
}
