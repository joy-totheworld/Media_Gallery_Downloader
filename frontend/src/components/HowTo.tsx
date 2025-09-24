import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useVideo } from "@/context/VideoContext"

interface Step {
    stepNumber: number,
    instructions: string
};

export default function HowTo() {
    const { currCourseNumberString } = useVideo();
    const Steps: Step[] = [
        { stepNumber: 1, instructions: "Log in to Canvas and navigate to your course page. Copy the URL of the course page." },
        { stepNumber: 2, instructions: "On this page, open your browser's developer tools and navigate to the Network tab. Enter the URL of the course page below." },
        { stepNumber: 3, instructions: `As this page loads a preview of the course media gallery, a request with the name of the course number ${currCourseNumberString} will be sent to Kaltura. Copy the cookie from the Kaltura request headers and paste it below.` },
        { stepNumber: 4, instructions: "Wait for the mp4 files to be generated. Click the download button when it becomes availible." }
    ];

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
                {Steps.map((step, index) => (
                    <StepCard step={step} key={index} />
                ))}
            </Stack>
        </Box>
    );
}

function StepCard({ step }: { step: Step }) {
    return (
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
                            Step {step.stepNumber}:
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: "text.secondary", textAlign: "center" }}
                        >
                            {step.instructions}
                        </Typography>
                    </CardContent>
                </Container>
            </Card>
        </Container>
    );
}