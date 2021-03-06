import React, { Component } from 'react';
import {
    List, 
    ListItem, 
    ListItemText, 
    ListSubheader, 
    ListItemSecondaryAction, 
    ListItemAvatar, 
    Avatar, 
    Paper, 
    IconButton, 
    withStyles, 
    Typography,
    Link,
    Tooltip
} from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import DomainIcon from '@material-ui/icons/Domain';
import ChatIcon from '@material-ui/icons/Chat';
import PersonIcon from '@material-ui/icons/Person';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';
import UpdateIcon from '@material-ui/icons/Update';
import InfoIcon from '@material-ui/icons/Info';
import NotesIcon from '@material-ui/icons/Notes';
import CodeIcon from '@material-ui/icons/Code';
import {styles} from './PageLayout.styles';
import {Instance} from '../types/Instance';
import {LinkableIconButton, LinkableAvatar} from '../interfaces/overrides';
import Mastodon from 'megalodon';
import { UAccount } from '../types/Account';
import { getConfig } from '../utilities/settings';
import { License } from '../types/Config';

interface IAboutPageState  {
    instance?: Instance | any;
    federated?: boolean;
    developer?: boolean;
    hyperspaceAdmin?: UAccount;
    hyperspaceAdminName?: string;
    versionNumber?: string;
    brandName?: string;
    license: License;
    repository?: string;
}

class AboutPage extends Component<any, IAboutPageState> {

    client: Mastodon;

    constructor(props: any) {
        super(props);

        this.client = new Mastodon(localStorage.getItem('access_token') as string, localStorage.getItem('baseurl') + "/api/v1");

        this.state = {
            license: {
                name: "Apache 2.0 License (inherited)",
                url: "https://www.apache.org/licenses/LICENSE-2.0"
            }
        }
    }

    componentWillMount() {
        this.client.get('/instance').then((resp: any) => {
            this.setState({
                instance: resp.data
            })
        })

        getConfig().then((config: any) => {
            this.client.get('/accounts/' + (config.admin? config.admin.account: "0")).then((resp: any) => {
                let account = resp.data;
                console.log(config);
                this.setState({
                    hyperspaceAdmin: account,
                    hyperspaceAdminName: config.admin.name,
                    federated: config.federated? config.federated === "true": false,
                    developer: config.developer? config.developer === "true": false,
                    versionNumber: config.version,
                    brandName: config.branding? config.branding.name: "Hyperspace",
                    license: {
                        name: config.license.name,
                        url: config.license.url
                    },
                    repository: config.repository
                })
            }).catch((err: Error) => {
                console.error(err.message);
            })
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.pageLayoutConstraints}>
                <ListSubheader>About your instance</ListSubheader>
                <Paper className={classes.pageListConstraints}>
                    <List>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <DomainIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Instance location (URL)" secondary={this.state.instance ? this.state.instance.uri: "Loading..."}/>
                            <ListItemSecondaryAction>
                                <Tooltip title="Open in browser">
                                    <IconButton href={localStorage.getItem("baseurl") as string} target="_blank" rel="noreferrer">
                                        <OpenInNewIcon/>
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <LinkableAvatar to={`/profile/${this.state.instance? this.state.instance.contact_account.id: 0}`} alt="Instance admin" src={this.state.instance? this.state.instance.contact_account.avatar_static: ""}/>
                            </ListItemAvatar>
                            <ListItemText primary="Instance admin" secondary={
                                this.state.instance ? `${this.state.instance.contact_account.display_name} (@${this.state.instance.contact_account.acct})`:
                                "Loading..."
                            }/>
                            <ListItemSecondaryAction>
                                <Tooltip title="Send a post or message">
                                    <LinkableIconButton to={`/compose?visibility=public&acct=${this.state.instance? this.state.instance.contact_account.acct: ""}`}>
                                        <ChatIcon/>
                                    </LinkableIconButton>
                                </Tooltip>
                                <Tooltip title="View profile">
                                    <LinkableIconButton to={`/profile/${this.state.instance? this.state.instance.contact_account.id: 0}`}>
                                        <AssignmentIndIcon/>
                                    </LinkableIconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </Paper>
                <br/>
                <ListSubheader>About this app</ListSubheader>
                <Paper className={classes.pageListConstraints}>
                    <List>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <InfoIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="App version" secondary={`${this.state? this.state.brandName: "Hyperspace"} v${this.state? this.state.versionNumber: "1.0.x"} ${this.state && this.state.brandName !== "Hyperspace"? "(Hyperspace-like)": ""}`}/>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <NotesIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="License" secondary={this.state.license.name}/>
                            <ListItemSecondaryAction>
                                <Tooltip title = "View license">
                                    <IconButton href={this.state.license.url} target="_blank" rel="noreferrer">
                                        <OpenInNewIcon/>
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                        {
                            this.state.repository?
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <CodeIcon/>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Source code repository" secondary={this.state.repository? 
                                    <span>
                                        <Typography className={classes.mobileOnly} color='textSecondary'>{this.state.repository.slice(0, 25) + "..."}</Typography>
                                        <Typography className={classes.desktopOnly} color='textSecondary'>{this.state.repository}</Typography>
                                    </span>: 
                                    "No repository in config"}/>
                                <ListItemSecondaryAction>
                                    <Tooltip title="View source code">
                                        <IconButton href={this.state.repository? this.state.repository: ""} target="_blank" rel="noreferrer">
                                            <OpenInNewIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </ListItemSecondaryAction>
                            </ListItem>: null
                        }
                    </List>
                </Paper>
                <br/>
                <ListSubheader>Advanced app info</ListSubheader>
                <Paper className={classes.pageListConstraints}>
                    <List>
                        <ListItem>
                            <ListItemAvatar>
                                <LinkableAvatar to={`/profile/${this.state.hyperspaceAdmin? this.state.hyperspaceAdmin.id: 0}`} src={this.state.hyperspaceAdmin? this.state.hyperspaceAdmin.avatar_static: ""}>
                                    <PersonIcon/>
                                </LinkableAvatar>
                            </ListItemAvatar>
                            <ListItemText primary="App provider" secondary={this.state.hyperspaceAdmin && this.state.hyperspaceAdminName? (this.state.hyperspaceAdminName || this.state.hyperspaceAdmin.display_name || "@" + this.state.hyperspaceAdmin.acct): "No provider set in config"}/>
                            <ListItemSecondaryAction>
                                <Tooltip title="Send a post or message">
                                    <LinkableIconButton to={`/compose?visibility=${this.state.federated? "public": "private"}&acct=${this.state.hyperspaceAdmin? this.state.hyperspaceAdmin.acct: ""}`}>
                                        <ChatIcon/>
                                    </LinkableIconButton>
                                </Tooltip>
                                <Tooltip title="View profile">
                                    <LinkableIconButton to={`/profile/${this.state.hyperspaceAdmin? this.state.hyperspaceAdmin.id: 0}`}>
                                        <AssignmentIndIcon/>
                                    </LinkableIconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <NetworkCheckIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Federation status" secondary={`This instance of ${this.state? this.state.brandName: "Hyperspace"} ${this.state? this.state.federated? "supports": "doesn't support": "might support"} federation.`}/>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <UpdateIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Release channel" secondary={
                                this.state?
                                    this.state.developer?
                                        "Developer":
                                        "Release":
                                "Loading..."
                            }/>
                        </ListItem>
                    </List>
                </Paper>
                <br/>
                <div className={classes.pageLayoutFooter}>
                    <Typography variant="caption">(C) {new Date().getFullYear()} {this.state? this.state.brandName: "Hyperspace"} developers. All rights reserved.</Typography>
                    <Typography variant="caption" paragraph>{this.state? this.state.brandName: "Hyperspace"} is made possible by the <Link href={"https://material-ui.com"} target="_blank" rel="noreferrer">Material UI</Link> project, <Link href={"https://www.npmjs.com/package/megalodon"} target="_blank" rel="noreferrer">Megalodon</Link> library, and other <Link href={"https://github.com/hyperspacedev/hyperspace/blob/master/package.json"} target="_blank" rel="noreferrer">open source software</Link>.</Typography>
                </div>
            </div>
        );
    }

}

export default withStyles(styles)(AboutPage);