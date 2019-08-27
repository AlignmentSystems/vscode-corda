import React, { Component } from "react";
import "../component-style/NodeExplorer.css";
import NodeInfoDisplay from "./NodeInfoDisplay";
import FlowInfoDisplay from "./FlowInfoDisplay";
import Grid from '@material-ui/core/Grid';
import { Circle, Text, Group, Label, Tag, Stage, Layer} from "react-konva";

export default class NodeExplorer extends React.Component {

    constructor(props) {
       super(props);
       this.state = {
         client: props.client,
         nodeDetails: {
          name: null,
          hostport: null,
          serial: null,
          platform: null
        },
        flowNames:[],
        flowParams: {}
       }
       this.toggleToNodeViewer = this.toggleToNodeViewer.bind(this);
       this.messageHandler = this.messageHandler.bind(this);
       this.startFlow = this.startFlow.bind(this);
       // set event handler for websocket
       this.state.client.onmessage = (event) => {
           this.messageHandler(event);
       }

       
       
   }

   messageHandler(event) {
   
       var evt = JSON.parse(event.data);
       var content = JSON.parse(evt.content);

       console.log("command received: " + evt.cmd);
       console.log("returned content: " + evt.content);

       if (evt.cmd == "getNodeInfo") {
           this.setState({
               nodeDetails : {name: content.legalIdentities,
                              hostport: content.addresses,
                              serial: content.serial,
                              platform: content.platformVersion }
           });
       }
       
       if(evt.cmd == "getRegisteredFlows"){
         this.setState({
            flowNames : content
         })
       }



       if(evt.cmd === "getStateNames"){
       }

       if(evt.cmd === "getRegisteredFlowParams"){
         this.setState({
           flowParams : content
         })
       }
       
   }

   componentDidMount(){
    this.state.client.send(JSON.stringify({"cmd":"getNodeInfo"}));
    this.state.client.send(JSON.stringify({"cmd": "getRegisteredFlows"}))
    //this.state.client.send(JSON.stringify({"cmd": "getStateNames"}))
    this.state.client.send(JSON.stringify({"cmd": "getRegisteredFlowParams"}))
   }

   toggleToNodeViewer(){
     const { toggleToNodeViewer } = this.props;
     toggleToNodeViewer();
   }

   startFlow(flowName, paramValues){
    console.log(flowName);
    console.log(paramValues);
    var content = {
      "flow" : flowName,
      "args" : paramValues
    }
    this.state.client.send(JSON.stringify({"cmd": "startFlow", "content":JSON.stringify(
                
      content
      
     )}));
  }

  render() {
    let DisplayNodeDetails = null
    if(this.state.nodeDetails){
      DisplayNodeDetails = <div>{this.state.nodeDetails.name}</div>
    }

  
   
    return (
      <div className="node-explorer-container">
        
         
        <Grid container spacing={4}>
          <Grid item xs={4}>
              <Stage width={200} height={100}><Layer>
                <Group
                  onClick={this.toggleToNodeViewer}
                >
                  <Circle 
                    class="nodeCircle" 
                    x={0} 
                    y={25}
                    radius={50} 
                    fill='#ec1d24'
                    shadowColor="black"
                    shadowBlur={10}
                    shadowOpacity={0.6}
                    
                          
                 />
                  <Label
                    x={0}
                    y={25}
                  >
                      <Tag 
                      fill= 'black'
                      pointerDirection= 'left'
                      pointerWidth= {20}
                      pointerHeight= {28}
                      lineJoin='round'
                      />
                      <Text text="Return to all nodes" x={0} fontFamily="FontAwesome" y={25} fill="white" padding ={5}  />
                      
                  </Label>
                </Group>
              </Layer></Stage>
          </Grid>
          <Grid item xs={4}>
            <NodeInfoDisplay content = {this.state.nodeDetails} /> 

          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FlowInfoDisplay flowNames = {this.state.flowNames} flowParams = {this.state.flowParams} startFlow = {this.startFlow} />
          </Grid>
        </Grid>
      </div>
    )
  }
}
