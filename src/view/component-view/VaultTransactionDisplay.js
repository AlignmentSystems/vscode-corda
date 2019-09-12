import React from 'react';
import Moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Collapse from '@material-ui/core/Collapse';

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import TablePagination from '@material-ui/core/TablePagination';
import StateCard from './StateCard';
export default class VaultTransactionDisplay extends React.Component {
  

    constructor(props) {
        super(props);
        this.state = {
            transactionMap : props.transactionMap,
            page: 0,
            rowsPerPage: 5,
            asc:true
        }
        
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.sortTableHandler = this.sortTableHandler.bind(this);
        this.toggleDraw = this.toggleDraw.bind(this);
                
    }

    componentDidMount(){
      this.sortTableHandler(this.state.transactionMap, this.state.asc);
    }
    
    static getDerivedStateFromProps(props){ 
        return {
            transactionMap : props.transactionMap
        }
    }



    handleChangeRowsPerPage(e){
        this.setState({
          rowsPerPage: parseInt(e.target.value,10),
          page: 0 
        })
    }

    handleChangePage(e,num){
      this.setState({
        page: num
      })
    }

    toggleDraw(txHash){
        this.setState({
            [txHash] : !this.state[txHash]
        })
    }

    sortTable(array, asc){
      var sortedArray  = array.sort((a,b) => {
        return new Moment(a.timeStamp, 'DD-MM-YY HH:mm:ss').format('YYMMDDHHmmss') - new Moment(b.timeStamp, 'DD-MM-YY HH:mm:ss').format('YYMMDDHHmmss')}
       )
        if(!asc){
          sortedArray.reverse();
        }

        return sortedArray;
      
      /* this.setState({
         transactionMap: sortedArray,
         asc : !this.state.asc
       }) */
    } 

/*
    sortTable(){
      var sortedArray  = this.state.transactionMap.sort((a,b) => {
        return new Moment(a.timeStamp, 'DD-MM-YY HH:mm:ss').format('YYMMDDHHmmss') - new Moment(b.timeStamp, 'DD-MM-YY HH:mm:ss').format('YYMMDDHHmmss')}
       )
        if(this.state.asc){
          sortedArray.reverse();
        }
      
       this.setState({
         transactionMap: sortedArray,
         asc : !this.state.asc
       })
    } */
   
    sortTableHandler(array, direction){
      var sortedArray = this.sortTable(array,direction);
      this.setState({
        transactionMap: sortedArray,
        asc : !direction
      })
    }

    
    render() {
      this.selectProps = {
        MenuProps: {
            classes: {
                paper: "selection-box-dropdown"
            }
        },
        classes : {
          icon: "selection-box-icon"
        }
      };
        this.sortTable(this.state.transactionMap, this.state.asc);
        return(
            <div >
              
                <Table size="small" id="vault-info-display-table">
                  <TableHead>
                    <TableRow>
                      <TableCell> 
                      <TableSortLabel
                        active={true} // do some validation to decide where the icon will be displayed
                        direction={(this.state.asc) ? 'asc' : 'desc'} 
                        onClick={() =>  this.sortTableHandler(this.state.transactionMap, this.state.asc)}
                      >
                      TimeStamp
                    </TableSortLabel>

                      </TableCell>
                      <TableCell>TxHash</TableCell>
                      <TableCell>Num Of Outputs</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody id="vault-info-display-table-body">
                    {this.state.transactionMap.slice(this.state.rowsPerPage * this.state.page, this.state.rowsPerPage * this.state.page + this.state.rowsPerPage).map((row,index) => {
                        if(!this.state[row.txHash]){
                            this.state[row.txHash] = false
                        } 
                        return(   
                          <React.Fragment key={row.txHash}> 
                              <TableRow className="vault-info-display-table-row"
                                  onClick = {() => this.toggleDraw(row.txHash)}
                              >
                                <TableCell> {row.timeStamp} </TableCell>
                                  <TableCell >{row.txHash}</TableCell>
                                  <TableCell >{Object.keys(JSON.parse(row.states)).length}
                                              
                                  </TableCell>
                                  <TableCell>
                                      <TableSortLabel
                                        active={true} // do some validation to decide where the icon will be displayed
                                        direction={(this.state[row.txHash]) ? 'asc' : 'desc'} 
                                        IconComponent= {ExpandMoreIcon}
                                      >
                                    </TableSortLabel>
                                  </TableCell>
                                
                              </TableRow>
                              <TableCell colSpan={4}>
                                <Collapse in={this.state[row.txHash]}>
                                  
                                  {JSON.parse(row.states).map((stateRow,index) => {
                                     return (<StateCard key={row.txHash + "" + index} metaData = {stateRow.second} stateData={stateRow.first} />);
                                     
                                  })}
                              </Collapse>
                              </TableCell>
                            </ React.Fragment>
                            
                            
                        );
                        
                    })}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  className="table-pagination"
                  colSpan={3}
                  count={this.state.transactionMap.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  SelectProps={
                    {
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                    }
                }
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  SelectProps = {
                    this.selectProps
                  }
                  //ActionsComponent={TablePaginationActions}
              />      
          </div>
        );
    }
}