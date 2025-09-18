import type { VideoLink } from "@/context/VideoContext"
import { buildBaseUrl } from "@/utils/base";

export function extractCourseNumber(url: String) {
    const match = url.match(/\/courses\/(\d+)/);
    return match ? match[1] : null;
}

export interface MediaGalleryData {
    links: VideoLink[];
    partnerId: string;
    ks: string;
}

export const callBackendForCourseLinks = async (
    courseNumberString: string,
    cookie: string,
    updateTotal: (newTotal: number) => void
): Promise<string | MediaGalleryData> => {
    try {
        const courseNumberLinks = await callBackendForNumCourseLinks(courseNumberString, cookie);
        updateTotal(Number(courseNumberLinks))

        const url = buildBaseUrl() +
            'scrapeLinks?url=https://kaltura.oregonstate.edu/channel/' +
            courseNumberString +
            '//sort/recent/sortBy/recent/pageSize/' +
            courseNumberLinks +
            '&cookie=' +
            cookie;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 404) {
                return data as string;
            }
            throw new Error(data.message || "Unexpected error occurred");
        }

        return {
            links: data.links,
            partnerId: data.partnerId,
            ks: data.ks
        } as MediaGalleryData;
    } catch (error) {
        throw error;
    }
};


export const callBackendForNumCourseLinks = async (courseNumberString: string, cookie: string): Promise<string> => {
    try {
        const response = await fetch(buildBaseUrl() + 'scrapeNumber?url=https://kaltura.oregonstate.edu/channel/' + courseNumberString + '&cookie=' + cookie)

        const data = await response.json();
        if (!response.ok) {
            if (response.status == 404) {
                return data as string;
            }
            throw new Error(data.message || "Unexpected error occurred");
        }
        return data.mediaCount as string;
    } catch (error) {
        throw error;
    }
}

function buildKalturaM3U8Url(entryId: string, partnerId: string, ks: string) {
    return `https://www.kaltura.com/p/${partnerId}/sp/0/playManifest/entryId/${entryId}/format/applehttp/protocol/http/ks/${ks}/video.m3u8`;

}

export const callBackendForFlavoredCourseM3u8 = async (url: string, cookie: string): Promise<string[] | string> => {
    try {
        const response = await fetch(buildBaseUrl() + 'scrapeFlavoredM3u8?url=' + url + '&cookie=' + cookie)

        const data = await response.json();
        if (!response.ok) {
            if (response.status == 404) {
                return data as string;
            }
            throw new Error(data.message || "Unexpected error occurred");
        }
        return data.links as string[];
    } catch (error) {
        throw error;
    }
}

export const callBackendForGenericCourseM3u8 = async (entryId: string, partnerId: string, ks: string, cookie: string): Promise<string> => {
    const m3u8Url = buildKalturaM3U8Url(entryId, partnerId, ks)
    try {
        const response = await fetch(buildBaseUrl() + 'scrapeGenericM3u8?url=' + m3u8Url + '&cookie=' + cookie)

        const data = await response.json();
        if (!response.ok) {
            if (response.status == 404) {
                return data as string;
            }
            throw new Error(data.message || "Unexpected error occurred");
        }
        return data.link as string;
    } catch (error) {
        throw error;
    }
}

export const callBackendForMp4 = async (
    segLinks: string[],
    label: string,
    entryId: string
): Promise<string> => {
    try {
        const response = await fetch(buildBaseUrl() + 'segLinksToMp4', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ segLinks, label, entryId })
        });

        const data = await response.json();
        if (!response.ok) {
            if (response.status === 404) {
                return data as string;
            }
            throw new Error(data.message || 'Unexpected error occurred');
        }

        // Construct real URL to the saved file
        const videoUrl = buildBaseUrl() + data.url;
        return videoUrl;
    } catch (error) {
        throw error;
    }
};

export const callBackendForMp4SequentialBatch = async (batch: VideoLink[], updateCounter: (newCount: number) => void) => {
    const results: VideoLink[] = [];
    var count: number = 0;

    for (const currVideoLink of batch) {
        try {
            const response = await callBackendForMp4(currVideoLink.segLinks, currVideoLink.label, currVideoLink.entryId)
            results.push({
                ...currVideoLink,
                mp4Url: response
            });
            count++
            updateCounter(count)
        } catch (error) {
            console.error('Error fetching:', currVideoLink.label, error);
        }
    }

    return results;
};

export const downloadAllFromBackend = (videoLinks: string[]) => {
    videoLinks.forEach((url, index) => {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `video_${index + 1}.mp4`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    });
};
