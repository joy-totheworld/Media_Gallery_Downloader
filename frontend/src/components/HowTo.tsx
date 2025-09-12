import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

export default function HowTo() {
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
                                    Enter the URL of the course page below and click the button.
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
                                    Download the generated mp4 files.
                                </Typography>
                            </CardContent>
                        </Container>
                    </Card>
                </Container>
            </Stack>
        </Box>
    );
}