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

export const callBackendForCourseLinks = async (courseNumberString: string, cookie: string): Promise<string | MediaGalleryData> => {
    try {
        const response = await fetch(buildBaseUrl() + 'scrapeLinks?url=https://kaltura.oregonstate.edu/channel/' + courseNumberString + '&cookie=' + cookie)

        const data = await response.json();
        if (!response.ok) {
            if (response.status == 404) {
                return data as string;
            }
            throw new Error(data.message || "Unexpected error occurred");
        }
        return { links: data.links, partnerId: data.partnerId, ks: data.ks } as MediaGalleryData;
    } catch (error) {
        throw error;
    }
}

function buildKalturaM3U8Url(url: string, partnerId: string, ks: string) {
    console.log(url)
    console.log(partnerId)
    console.log(ks)
    const entryId = url.split('/')[3];
    console.log(entryId)

    // return `https://cfvod.kaltura.com/hls/p/${partnerId}/sp/0/serveFlavor/entryId/${entryId}/v/1/ev/3/flavorId/1_c6ikfdzj/name/a.mp4/index.m3u8`;
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
        console.log("data.link: " + data.link)
        return data.links as string[];
    } catch (error) {
        throw error;
    }
}

export const callBackendForGenericCourseM3u8 = async (url: string, partnerId: string, ks: string, cookie: string): Promise<string> => {
    const m3u8Url = buildKalturaM3U8Url(url, partnerId, ks)
    try {
        const response = await fetch(buildBaseUrl() + 'scrapeGenericM3u8?url=' + m3u8Url + '&cookie=' + cookie)

        const data = await response.json();
        if (!response.ok) {
            if (response.status == 404) {
                return data as string;
            }
            throw new Error(data.message || "Unexpected error occurred");
        }
        console.log("data.link: " + data.link)
        return data.link as string;
    } catch (error) {
        throw error;
    }
}