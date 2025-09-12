import React from 'react'
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

interface InputTextProp {
    buttonLabel: string;
    inputLabel: string;
    submitInput: (inputString: string) => void
};

export default function InputText({ buttonLabel, inputLabel, submitInput }: InputTextProp) {

    // consts for text input
    const [currText, setCurrText] = React.useState<string>("");
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrText(event.target.value)
    };

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
                label={inputLabel}
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
                onClick={() => submitInput(currText)}
            >
                {buttonLabel}
            </Button>
        </Box>
    )
}

