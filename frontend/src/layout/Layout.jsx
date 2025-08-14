import React from "react";
import {Outlet} from "react-router-dom";
import Navigation from "../shared/components/Navigation";
import {Container, Box, Toolbar} from "@mui/material";

export default function Layout() {
    return (
        <Box sx={{minHeight: "100dvh", p: 2}}>
            <Navigation/>
            <Toolbar/>
            <Outlet/>
        </Box>
    );
}
