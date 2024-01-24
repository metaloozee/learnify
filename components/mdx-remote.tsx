import { MDXRemote } from "next-mdx-remote/rsc"

const components = {
    h1: (props: any) => (
        <h1 {...props} className="text-3xl font-bold mt-5">
            {props.children}
        </h1>
    ),
    h2: (props: any) => (
        <h2 {...props} className="text-2xl font-medium mt-5">
            {props.children}
        </h2>
    ),
    h3: (props: any) => (
        <h3 {...props} className="text-xl font-medium mt-4">
            {props.children}
        </h3>
    ),
    li: (props: any) => (
        <li {...props} className="ml-2 list-inside list-disc">
            {props.children}
        </li>
    ),
    p: (props: any) => (
        <p {...props} className="text-muted-foreground mt-2">
            {props.children}
        </p>
    ),
    strong: (props: any) => (
        <strong {...props} className="bg-primary text-background px-1">
            {props.children}
        </strong>
    ),
}
export function CustomMDX(props: any) {
    return (
        <MDXRemote
            {...props}
            components={{ ...components, ...(props.components || {}) }}
        />
    )
}
