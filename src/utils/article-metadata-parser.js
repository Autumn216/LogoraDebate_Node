import { getMetadata } from 'page-metadata-parser';

export function getArticleMetadata() {
    const extractedSource = getMetadata(window.document, window.location, null, ['Article', 'NewsArticle']);
    const articleMetadata = {
        source_url: extractedSource.url,
        published_date: extractedSource.publishedDate || "",
        title: extractedSource.title,
        description: extractedSource.description,
        origin_image_url: extractedSource.image || "",
        publisher: extractedSource.provider,
        tag_objects: extractedSource.keywords ? [... new Set(extractedSource.keywords.map(name => name.toLowerCase()))].map(e => { return { name: e } }).slice(0, 10) : []
    }
    return articleMetadata;
}