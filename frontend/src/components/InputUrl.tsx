import React from 'react'
import '@/app/App.css'
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useVideo } from "@/context/VideoContext"
import { extractCourseNumber } from "@/utils/helpers"
import { Snackbar, Alert } from '@mui/material';

export default function InputUrl() {

    // consts for text input
    const { updateFunction } = useVideo();
    const [currText, setCurrText] = React.useState("");
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrText(event.target.value)
    };
    const submitInput = () => {
        var courseNumberString = extractCourseNumber(currText)
        if (courseNumberString != null) {
            updateFunction(courseNumberString);
            updateFunction(true);
            console.log(courseNumberString)
        } else {
            setOpen(true);
        }
    };

    // consts for error snackbar
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const errorText = "Expected URL in the following format: https://canvas.oregonstate.edu/courses/{CourseNumber}."

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
            <TextField
                className="formInput"
                fullWidth
                id={"url_input"}
                label={"Canvas Course Page URL:"}
                margin="normal"
                onChange={handleInput}
            />
            <Button
                sx={{
                    width: "50%",
                    mr: "25%",
                    ml: "25%",
                    mb: "10px",
                }}
                variant="outlined"
                onClick={submitInput}
            >
                Get MP4 Files
            </Button>
            <Snackbar
                open={open}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={10000}
                onClose={handleClose}
            >
                <Alert severity="error" onClose={handleClose}>
                    {errorText}
                </Alert>
            </Snackbar>
        </Box>
    )
}

