import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

interface ButtonProp {
    buttonLabel: string;
    submitFunc: () => void
};

export default function StyledButton({ buttonLabel, submitFunc }: ButtonProp) {

    return (
        <Box
            id="input-section"
            component="form"
            sx={{
                width: {
                    xs: '100%',
                    sm: '100%',
                    md: '80%',
                    lg: '50%',
                    xl: '50%'
                },
                ml: {
                    xs: '0%',
                    sm: '0%',
                    md: '10%',
                    lg: '25%',
                    xl: '26%'
                },
                mr: {
                    xs: '0%',
                    sm: '0%',
                    md: '10%',
                    lg: '25%',
                    xl: '26%'
                }
            }}
            noValidate
            autoComplete="off"
        >
            <Button
                sx={{
                    width: "50%",
                    mr: "25%",
                    ml: "25%",
                    mb: "10px",
                }}
                variant="outlined"
                onClick={submitFunc}
            >
                {buttonLabel}
            </Button>
        </Box>
    )
}

