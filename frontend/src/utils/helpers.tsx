export function extractCourseNumber(url: String) {
    const match = url.match(/\/courses\/(\d+)/);
    return match ? match[1] : null;
}

export function callBackendForCourseM3u8(courseNumberString: string, cookie: string): Promise<string> {
    return fetch('http://localhost:3001/scrapeLinks?url=https://kaltura.oregonstate.edu/channel/' + courseNumberString + '&cookie=' + cookie)
        .then(res => res.text())
        .then(data => {
            console.log(data);
            return data;
        });
}