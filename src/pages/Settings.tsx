import React, { Component } from 'react';
import {
    List, 
    ListItem, 
    ListItemText, 
    ListSubheader, 
    ListItemSecondaryAction, 
    Paper, 
    IconButton, 
    withStyles, 
    Button,
    Switch,
    Dialog,
    DialogTitle,
    DialogContent,
    RadioGroup,
    FormControlLabel,
    Radio,
    DialogActions,
    DialogContentText,
    Grid,
    Theme,
    Typography
} from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {styles} from './PageLayout.styles';
import {setUserDefaultBool, getUserDefaultBool, getUserDefaultTheme, setUserDefaultTheme, getUserDefaultVisibility, setUserDefaultVisibility} from '../utilities/settings';
import {canSendNotifications, browserSupportsNotificationRequests} from '../utilities/notifications';
import {themes, defaultTheme} from '../types/HyperspaceTheme';
import ThemePreview from '../components/ThemePreview';
import {setHyperspaceTheme, getHyperspaceTheme} from '../utilities/themes';
import { Visibility } from '../types/Visibility';

interface ISettingsState {
    darkModeEnabled: boolean;
    systemDecidesDarkMode: boolean;
    pushNotificationsEnabled: boolean;
    badgeDisplaysAllNotifs: boolean;
    selectThemeName: string;
    themeDialogOpen: boolean;
    visibilityDialogOpen: boolean;
    resetHyperspaceDialog: boolean;
    resetSettingsDialog: boolean;
    previewTheme: Theme;
    defaultVisibility: Visibility;
}

class SettingsPage extends Component<any, ISettingsState> {

    constructor(props: any) {
        super(props);

        this.state = {
            darkModeEnabled: getUserDefaultBool('darkModeEnabled'),
            systemDecidesDarkMode: getUserDefaultBool('systemDecidesDarkMode'),
            pushNotificationsEnabled: canSendNotifications(),
            badgeDisplaysAllNotifs: getUserDefaultBool('displayAllOnNotificationBadge'),
            selectThemeName: getUserDefaultTheme().key,
            themeDialogOpen: false,
            visibilityDialogOpen: false,
            resetHyperspaceDialog: false,
            resetSettingsDialog: false,
            previewTheme: setHyperspaceTheme(getUserDefaultTheme()) || setHyperspaceTheme(defaultTheme),
            defaultVisibility: getUserDefaultVisibility() || "public"
        }

        this.toggleDarkMode = this.toggleDarkMode.bind(this);
        this.toggleSystemDarkMode = this.toggleSystemDarkMode.bind(this);
        this.togglePushNotifications = this.togglePushNotifications.bind(this);
        this.toggleBadgeCount = this.toggleBadgeCount.bind(this);
        this.toggleThemeDialog = this.toggleThemeDialog.bind(this);
        this.toggleVisibilityDialog = this.toggleVisibilityDialog.bind(this);
        this.changeThemeName = this.changeThemeName.bind(this);
        this.changeTheme = this.changeTheme.bind(this);
        this.setVisibility = this.setVisibility.bind(this);
    }

    toggleDarkMode() {
        this.setState({ darkModeEnabled: !this.state.darkModeEnabled });
        setUserDefaultBool('darkModeEnabled', !this.state.darkModeEnabled);
        window.location.reload();
    }

    toggleSystemDarkMode() {
        this.setState({ systemDecidesDarkMode: !this.state.systemDecidesDarkMode });
        setUserDefaultBool('systemDecidesDarkMode', !this.state.systemDecidesDarkMode);
        window.location.reload();
    }

    togglePushNotifications() {
        this.setState({ pushNotificationsEnabled: !this.state.pushNotificationsEnabled });
        setUserDefaultBool('enablePushNotifications', !this.state.pushNotificationsEnabled);
    }

    toggleBadgeCount() {
        this.setState({ badgeDisplaysAllNotifs: !this.state.badgeDisplaysAllNotifs });
        setUserDefaultBool('displayAllOnNotificationBadge', !this.state.badgeDisplaysAllNotifs);
    }

    toggleThemeDialog() {
        this.setState({ themeDialogOpen: !this.state.themeDialogOpen });
    }

    toggleVisibilityDialog() {
        this.setState({ visibilityDialogOpen: !this.state.visibilityDialogOpen });
    }

    toggleResetDialog() {
        this.setState({ resetHyperspaceDialog: !this.state.resetHyperspaceDialog });
    }

    toggleResetSettingsDialog() {
        this.setState({ resetSettingsDialog: !this.state.resetSettingsDialog });
    }

    changeTheme() {
        setUserDefaultTheme(this.state.selectThemeName);
        window.location.reload();
    }

    changeThemeName(theme: string) {
        let previewTheme = setHyperspaceTheme(getHyperspaceTheme(theme));
        this.setState({ selectThemeName: theme, previewTheme });
    }

    changeVisibility(to: Visibility) {
        this.setState({ defaultVisibility: to });
    }

    setVisibility() {
        setUserDefaultVisibility(this.state.defaultVisibility);
        this.toggleVisibilityDialog();
    }

    reset() {
        localStorage.clear();
        window.location.reload();
    }

    refresh() {
        let settings = ['darkModeEnabled', 'enablePushNotifications', 'clearNotificationsOnRead', 'theme', 'displayAllOnNotificationBadge', 'defaultVisibility'];
        settings.forEach(setting => {
            localStorage.removeItem(setting);
        })
        window.location.reload();
    }

    showThemeDialog() {
        const {classes} = this.props;
        return (
            <Dialog
                open={this.state.themeDialogOpen}
                disableBackdropClick
                disableEscapeKeyDown
                maxWidth="md"
                fullWidth={true}
                aria-labelledby="confirmation-dialog-title"
            >
                <DialogTitle id="confirmation-dialog-title">Choose a theme</DialogTitle>
                <DialogContent>
                    <Grid container spacing={16}>
                        <Grid item xs={12} md={6}>
                            <RadioGroup
                                aria-label="Theme"
                                name="colorScheme"
                                value={this.state.selectThemeName}
                                onChange={(e, value) => this.changeThemeName(value)}
                            >
                                {themes.map(theme => (
                                    <FormControlLabel value={theme.key} key={theme.key} control={<Radio />} label={theme.name} />
                                ))}
                                ))}
                            </RadioGroup>
                        </Grid>
                        <Grid item xs={12} md={6} className={classes.desktopOnly}>
                            <Typography variant="h6" component="p">Theme preview</Typography>
                            <ThemePreview theme={this.state.previewTheme}/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.toggleThemeDialog} color="default">
                        Cancel
                    </Button>
                    <Button onClick={this.changeTheme} color="secondary">
                        Set theme
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    showVisibilityDialog() {
        return (
            <Dialog
                open={this.state.visibilityDialogOpen}
                disableBackdropClick
                disableEscapeKeyDown
                maxWidth="xs"
                fullWidth={true}
                aria-labelledby="confirmation-dialog-title"
            >
                <DialogTitle id="confirmation-dialog-title">Set your default visibility</DialogTitle>
                <DialogContent>
                    <RadioGroup
                        aria-label="Visibility"
                        name="visibility"
                        value={this.state.defaultVisibility}
                        onChange={(e, value) => this.changeVisibility(value as Visibility)}
                    >
                            <FormControlLabel value={"public"} key={"public"} control={<Radio />} label={"Public"} />
                            <FormControlLabel value={"unlisted"} key={"unlisted"} control={<Radio />} label={"Unlisted"} />
                            <FormControlLabel value={"private"} key={"private"} control={<Radio />} label={"Private (followers only)"} />
                            <FormControlLabel value={"direct"} key={"direct"} control={<Radio />} label={"Direct"} />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.toggleVisibilityDialog} color="default">
                        Cancel
                    </Button>
                    <Button onClick={this.setVisibility} color="secondary">
                        Set default
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    showResetSettingsDialog() {
        return (
            <Dialog
                open={this.state.resetSettingsDialog}
                onClose={() => this.toggleResetSettingsDialog()}
                >
                <DialogTitle id="alert-dialog-title">Are you sure you want to refresh settings?</DialogTitle>
                <DialogActions>
                <Button onClick={() => this.toggleResetSettingsDialog()} color="primary" autoFocus>
                    Cancel
                    </Button>
                    <Button onClick={() => {
                        this.refresh();
                    }} color="primary">
                    Refresh
                    </Button>
                </DialogActions>
                </Dialog>
        );
    }

    showResetDialog() {
        return (
            <Dialog
                open={this.state.resetHyperspaceDialog}
                onClose={() => this.toggleResetDialog()}
                >
                <DialogTitle id="alert-dialog-title">Reset Hyperspace?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to reset Hyperspace? You'll need to sign in again and grant Hyperspace access to use it again.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => this.toggleResetDialog()} color="primary" autoFocus>
                    Cancel
                    </Button>
                    <Button onClick={() => {
                        this.reset();
                    }} color="primary">
                    Reset
                    </Button>
                </DialogActions>
                </Dialog>
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.pageLayoutConstraints}>
                <ListSubheader>Appearance</ListSubheader>
                <Paper className={classes.pageListConstraints}>
                    <List>
                        <ListItem>
                            <ListItemText primary="Match system appearance" secondary="Obey light/dark theme from your system"/>
                            <ListItemSecondaryAction>
                                <Switch 
                                    checked={this.state.systemDecidesDarkMode} 
                                    onChange={this.toggleSystemDarkMode}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Dark mode" secondary="Toggles light or dark theme"/>
                            <ListItemSecondaryAction>
                                <Switch
                                    disabled={this.state.systemDecidesDarkMode}
                                    checked={this.state.darkModeEnabled} 
                                    onChange={this.toggleDarkMode}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Interface theme" secondary="The color palette used for the interface"/>
                            <ListItemSecondaryAction>
                                <Button onClick={this.toggleThemeDialog}>
                                    Set theme
                                </Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </Paper>
                <br/>
                <ListSubheader>Accounts</ListSubheader>
                <Paper className={classes.pageListConstraints}>
                    <List>
                        <ListItem>
                            <ListItemText primary="Configure on Mastodon"/>
                            <ListItemSecondaryAction>
                                <IconButton href={(localStorage.getItem("baseurl") as string) + "/settings/preferences"} target="_blank" rel="noreferrer">
                                    <OpenInNewIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </Paper>
                <br/>
                <ListSubheader>Composer</ListSubheader>
                <Paper className={classes.pageListConstraints}>
                    <List>
                        <ListItem>
                            <ListItemText primary="Default visibility" secondary="New posts in composer will use this visiblity"/>
                            <ListItemSecondaryAction>
                                <Button onClick={this.toggleVisibilityDialog}>
                                    Change
                                </Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </Paper>
                <br/>
                <ListSubheader>Notifications</ListSubheader>
                <Paper className={classes.pageListConstraints}>
                    <List>
                        <ListItem>
                            <ListItemText 
                                primary="Enable push notifications"
                                secondary={
                                    getUserDefaultBool('userDeniedNotification')?
                                        "Check your browser's notification permissions.":
                                            browserSupportsNotificationRequests()?
                                                "Send a push notification when not focused.":
                                                "Notifications aren't supported."
                                }
                            />
                            <ListItemSecondaryAction>
                                <Switch 
                                    checked={this.state.pushNotificationsEnabled} 
                                    onChange={this.togglePushNotifications}
                                    disabled={!browserSupportsNotificationRequests() || getUserDefaultBool('userDeniedNotification')}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                            <ListItemText 
                                primary="Notification badge counts all notifications"
                                secondary={
                                    "Counts all notifications, read or unread."
                                }
                            />
                            <ListItemSecondaryAction>
                                <Switch 
                                    checked={this.state.badgeDisplaysAllNotifs} 
                                    onChange={this.toggleBadgeCount}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </Paper>
                <br/>
                <ListSubheader>Advanced</ListSubheader>
                <Paper className={classes.pageListConstraints}>
                    <List>
                        <ListItem>
                            <ListItemText primary="Refresh settings" secondary="Reset the settings to defaults."/>
                            <ListItemSecondaryAction>
                                <Button onClick={() => this.toggleResetSettingsDialog()}>
                                    Refresh
                                </Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Reset Hyperspace" secondary="Deletes all data and resets the app"/>
                            <ListItemSecondaryAction>
                                <Button onClick={() => this.toggleResetDialog()}>
                                    Reset
                                </Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </Paper>
                {this.showThemeDialog()}
                {this.showVisibilityDialog()}
                {this.showResetDialog()}
                {this.showResetSettingsDialog()}
            </div>
        );
    }

}

export default withStyles(styles)(SettingsPage);