export function extractCourseNumber(url: String) {
    const match = url.match(/\/courses\/(\d+)/);
    return match ? match[1] : null;
}