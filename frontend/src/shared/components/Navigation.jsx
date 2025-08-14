import * as React from 'react';
import {Link, useLocation} from 'react-router-dom';

import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    Divider,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import MailIcon from '@mui/icons-material/Mail';

import {useTheme} from '@mui/material/styles';

const LINKS = [
    { name: 'Activities', link: '/activities', icon: <MailIcon/> },
    { name: 'Categories', link: '/categories', icon: <MailIcon/> },
    { name: "Add Activity", link: "/activities/new", icon: <MailIcon /> },
    { name: "Add Category", link: "/categories/new", icon: <MailIcon /> },
];

export default function Navigation() {
    const [open, setOpen] = React.useState(false);
    const location = useLocation();
    const theme = useTheme();

    const current = React.useMemo(
        () => LINKS.find(l => l.link === location.pathname),
        [location.pathname]
    );
    const title = current ? current.name : 'Activity Tracker';

    const openDrawer = React.useCallback(() => setOpen(true), []);
    const closeDrawer = React.useCallback(() => setOpen(false), []);

    return (
        <>
            <AppBar position="sticky" sx={{borderRadius: theme.shape.borderRadius}}>
                <Toolbar  sx={{ px: 2 }}>
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        {title}
                    </Typography>
                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        onClick={openDrawer}
                    >
                        <MenuIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer open={open} onClose={closeDrawer}>
                <Box
                    sx={{width: 280}}
                    role="presentation"
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') closeDrawer();
                    }}
                >
                    <List>
                        {LINKS.map((l) => (
                            <ListItem key={l.link} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to={l.link}
                                    onClick={closeDrawer}
                                    selected={location.pathname === l.link}
                                >
                                    <ListItemIcon>{l.icon}</ListItemIcon>
                                    <ListItemText primary={l.name}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider/>
                </Box>
            </Drawer>
        </>
    );
}
