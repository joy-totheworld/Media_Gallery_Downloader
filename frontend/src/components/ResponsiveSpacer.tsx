import '@/app/App.css'
import Box from "@mui/material/Box";

interface Heights {
    smaller: string;
    larger: string;
};

export default function InputUrl({ smaller, larger }: Heights) {
    return (
        <Box
            sx={(theme) => ({
                [theme.breakpoints.up("xs")]: { height: smaller },
                [theme.breakpoints.up("sm")]: { height: smaller },
                [theme.breakpoints.up("md")]: { height: larger },
                [theme.breakpoints.up("lg")]: { height: larger },
                [theme.breakpoints.up("xl")]: { height: larger },
            })} />
    )
}

