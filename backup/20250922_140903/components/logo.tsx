import * as React from "react"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-6 w-6", className)}
        >
            <path d="M4 4h16v16H4z" fill="hsl(var(--primary))" stroke="none" />
            <path d="M9 19V5l6 14V5" stroke="hsl(var(--primary-foreground))" />
        </svg>
    )
}
