import Box from "@mui/material/Box";
import { useVideo } from "@/context/VideoContext"

type PreviewGalleryProps = {
    reloadKey: Number;
};
export default function PreviewGallery({ reloadKey }: PreviewGalleryProps) {

    // consts for text input
    const { currCourseNumberLoaded, currCourseNumberString } = useVideo();


    if (currCourseNumberLoaded) {
        return (
            <Box
                id="preview-section"
            >
                <iframe
                    src={"https://kaltura.oregonstate.edu/channel/" + currCourseNumberString}
                    width="100%"
                    height="600"
                    title="Kaltura Channel"
                    key={reloadKey as React.Key}
                />

            </Box>
        )
    }
    else {
        return (
            <Box id="preview-section" />
        )
    }
}