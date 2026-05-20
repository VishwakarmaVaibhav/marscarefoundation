/**
 * JsonLd — Injects JSON-LD structured data into a page.
 * Usage: <JsonLd data={schema} />
 */
export default function JsonLd({ data }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
