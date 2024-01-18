import Tiptap from '../../../components/Tiptap'

export default function Home({ params }: { params: { id: number } }) {
    return (
        <>
            <h1 className="mb-8 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl">New Script</h1>
            <Tiptap id={params.id}/>
        </>
    )
}