export interface Publication {
    id: number,
    title: string,
    category: {name: string},
    description: string,
    tags: Array<string>,
    videos: Array<string>,
    documents: Array<string>,
    images: Array<string>,
    apprentice: {username: string},
    date: Date
}