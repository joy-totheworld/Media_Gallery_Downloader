import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useVideo } from "@/context/VideoContext"

export default function HowTo() {
    const { currCourseNumberString } = useVideo();

    return (
        <Box
            id="how-section"
            sx={{ width: "100%" }}
        >
            <Stack
                direction={{
                    xs: "column",
                    sm: "column",
                    md: "column",
                    lg: "row",
                    xl: "row",
                }}
                spacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 3 }}
            >
                <Container>
                    <Card sx={{ width: "100%", height: "100%" }}>
                        <Container maxWidth="sm" sx={{ paddingTop: "5%" }}>
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{ textAlign: "center" }}
                                >
                                    Step 1:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary", textAlign: "center" }}
                                >
                                    Log in to Canvas and navigate to your course page. Copy the URL of the course page.
                                </Typography>
                            </CardContent>
                        </Container>
                    </Card>
                </Container>
                <Container>
                    <Card sx={{ width: "100%", height: "100%" }}>
                        <Container maxWidth="sm" sx={{ paddingTop: "5%" }}>
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{ textAlign: "center" }}
                                >
                                    Step 2:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary", textAlign: "center" }}
                                >
                                    On this page, open your browser's developer tools and navigate to the Network tab. Enter the URL of the course page below and click the button.
                                </Typography>
                            </CardContent>
                        </Container>
                    </Card>
                </Container>
                <Container>
                    <Card sx={{ width: "100%", height: "100%" }}>
                        <Container maxWidth="sm" sx={{ paddingTop: "5%" }}>
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{ textAlign: "center" }}
                                >
                                    Step 3:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary", textAlign: "center" }}
                                >
                                    As this page loads a preview of the course media gallery, a request with the name of the course number {currCourseNumberString}, will be sent to Kaltura. Copy the cookie from the Kaltura request headers, paste it in the input field, and click the button.
                                </Typography>
                            </CardContent>
                        </Container>
                    </Card>
                </Container>
            </Stack>
        </Box>
    );
}