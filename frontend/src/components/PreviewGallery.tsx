import '@/app/App.css'
import Box from "@mui/material/Box";
import { useVideo } from "@/context/VideoContext"

export default function PreviewGallery() {

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