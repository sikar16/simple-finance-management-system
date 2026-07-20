export default function EditclientPage({ params }: { params: { id: string } }) {
    const { id } = params

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold" style={{ color: "#1C2541" }}>
                Edit Client - {id}
            </h1>
            <p className="text-sm text-gray-400">Edit client details.</p>
        </div>
    )
}