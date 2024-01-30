import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Tailwind,
    Text,
} from "@react-email/components"

export default function NewNoteEmail({
    name = "John Doe",
    notetitle = "Routing Information Protocol",
    subjectname = "Computer Networks",
}: {
    name: string | null
    notetitle: string
    subjectname: string
}) {
    return (
        <Html>
            <Head />
            <Preview>New Note</Preview>
            <Tailwind>
                <Body className="mx-auto my-auto bg-white font-sans">
                    <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
                        <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
                            Hey there, knowledge seeker! 🧠
                        </Heading>
                        <Text className="text-sm leading-6 text-black">
                            Your brain buffet just got richer! 📚 {name} just
                            unleashed a brainwave titled {notetitle} for the
                            amazing subject {subjectname}. Swing by your
                            dashboard for a front-row seat to this academic
                            extravaganza! 🚀📖
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
