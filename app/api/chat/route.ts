import { env } from "@/env.mjs"
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai"
import { Pinecone } from "@pinecone-database/pinecone"
import { StreamingTextResponse, Message as VercelChatMessage } from "ai"
import { PromptTemplate } from "langchain/prompts"
import { BytesOutputParser } from "langchain/schema/output_parser"

import { createServerSupabaseClient } from "@/app/supabase-server"

export const runtime = "edge"

const openai = new ChatOpenAI({
    openAIApiKey: env.OPENAI_API_KEY,
})
const pinecone = new Pinecone({
    apiKey: env.PINECONE_API_KEY,
})

const formatMessage = (message: VercelChatMessage) => {
    return `${message.role}: ${message.content}`
}

const TEMPLATE = `
You are a Personal AI tutor and one of your student will be asking you questions or doubts.
Given the following sections from the notes, answer the question using only that information.
If you are unsure and the answer is not explicitly written in the notes, say "Sorry, I dont't know how to help with that."

Context Sections:
{contextSections}

Question: {input}
`

export async function POST(req: Request) {
    const supabase = await createServerSupabaseClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
        return new Response("UNAUTHORIZED")
    }

    const body = await req.json()
    const messages = body.messages ?? []
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage)
    const currentMessageContent = messages[messages.length - 1].content

    const questionEmbedding = await new OpenAIEmbeddings().embedQuery(
        currentMessageContent
    )
    const pineconeResults = await pinecone.Index("learnify").query({
        vector: questionEmbedding,
        topK: 5,
        includeMetadata: true,
        includeValues: false,
    })

    const contextSections = await pineconeResults.matches
        .map((m) => m.metadata?.text)
        .join()

    const prompt = PromptTemplate.fromTemplate(TEMPLATE)
    const outputParser = new BytesOutputParser()
    const chain = prompt.pipe(openai).pipe(outputParser)

    const stream = await chain.stream({
        contextSections: contextSections,
        input: currentMessageContent,
    })

    return new StreamingTextResponse(stream)
}
