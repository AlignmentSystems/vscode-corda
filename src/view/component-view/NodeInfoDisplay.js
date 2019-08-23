import React from 'react';
//import WebSocket from 'react-websocket';
import '../component-style/NodeInfoDisplay.css';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export default class NodeInfoDisplay extends React.Component {

    constructor(props) {
        super(props);
        console.log(JSON.stringify(props.content))
        this.state = {
            name: null,
            hostport: null,
            serial: null,
            platform: null
        }
    }

    componentWillReceiveProps(props){
        this.setState({
            name: props.content.name,
            hostport: props.content.hostport,
            serial: props.content.serial,
            platform: props.content.platform
        });
    }
   

    render() {
        return(
            <Card className="node-info-display-card">
                <Typography color="textPrimary" gutterBottom>
                     <i className="fas fa-info-circle info-icon"></i>
                     Node Information
                </Typography>
                <CardContent className="node-info-display-card-content">
                    <Typography color="textSecondary">
                        Name: {this.state.name}
                    </Typography>
                    <Typography color="textSecondary">
                        Hostport: {this.state.hostport}
                    </Typography>
                    <Typography color="textSecondary">
                        Serial: {this.state.serial}
                    </Typography>
                    <Typography color="textSecondary">
                        Platform: {this.state.platform}
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}