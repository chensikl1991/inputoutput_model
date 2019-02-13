import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import file from '../../assets/data.xlsx'
import { Header, Table, Input,Segment } from 'semantic-ui-react'
import * as XLSX from 'xlsx'

import styles from './Home.scss'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calculation:[],
            employment_projection: [],
            output_projection:[],
            multipliers: [],
            employment_shock:[],
            employment_base_m:[],
            output_base_m:[],
            employment_change_m:[],
            employment_change_total:'',
            output_change_m:[],
            output_change_total:'',
    

        }

        // this.handleChange = this.handleChange.bind(this);
        this.handleShockEmploymentChange = this.handleShockEmploymentChange.bind(this);
        this.handleShockOutputChange = this.handleShockOutputChange.bind(this);
        this.multiply_matrix = this.multiply_matrix.bind(this);
    }

    componentWillMount(){
        let employment_projection = file[0].data.slice(2,13);
        let output_projection = file[0].data.slice(20,32)
        console.log("test output_projection",output_projection)

        let employment_shock = []
        let output_stock = []
      
        employment_projection.map((item, i)=>{
            employment_shock.push(item[2])
        })

        output_projection.map((item, i)=>{
            output_stock.push(item[2])
        })

        let multiplier_m1 = file[1].data.slice(2,14)
        let multiplier_m2 = file[1].data.slice(2,13)
        let employment_base_m = []
        let output_base_m = []

        for (var i = 0; i < multiplier_m1.length; i++){
            output_base_m.push(multiplier_m1[i].slice(1,13))

        }
        for (var i = 0; i < multiplier_m2.length; i++){
            employment_base_m.push(multiplier_m2[i].slice(15,28))
        }
        
        console.log("employment_base_m",employment_base_m)
    
        this.setState({
            calculation:file[0].data,
            employment_projection: file[0].data.slice(2,13),
            output_projection:file[0].data.slice(20,32),
            multipliers: file[1].data,
            employment_shock:employment_shock,
            employment_base_m: employment_base_m,
            output_base_m: output_base_m,
            output_stock:output_stock
        }) 

        // this.multiply_matrix(output_base_m,output_stock,1)
        this.multiply_matrix(employment_base_m,employment_shock,1)
        this.multiply_matrix(output_base_m,output_stock,0)
        
          
    }

    multiply_matrix(mA,mB,idx){
        // console.log("mA",mA,mA.length)
        // console.log("mB", mB,mB.length)
        let result = new Array(mB.length).fill(0);
        let sum = 0;
        // console.log("result",result)
        // console.log(mA.length)
        // console.log(mB.length)

        for(let i = 0; i < mA.length;i++){
            for(let j = 0; j < mB.length; j++){
                result[i] += mA[i][j] * mB[j]
        
            }
            sum +=result[i]
            // console.log("sum",result[i],sum)
            result[i] = result[i].toFixed(2)
        }

        if(idx == 1){
            this.setState({
                employment_change_m:result,
                employment_change_total:sum
            })
        }else{
            this.setState({
                output_change_m:result,
                output_change_total:sum
            })
        }

    }


    handleShockEmploymentChange(index,e,{ value }){
        let newEmployment_shock = this.state.employment_shock;
            newEmployment_shock[index] = value

        // console.log(newEmployment_shock)
        this.setState({
            employment_shock:newEmployment_shock
        })
        this.multiply_matrix(this.state.employment_base_m,newEmployment_shock,1)
    }


    handleShockOutputChange(index,e,{ value }){
        let newOutput_shock = this.state.output_stock;
            newOutput_shock[index] = value

        // console.log(newEmployment_shock)
        this.setState({
            output_stock:newOutput_shock
        })
        this.multiply_matrix(this.state.output_base_m,newOutput_shock,0)

    }

    render() {
        const{calculation,
              employment_projection,
              output_projection,
              multipliers,
              employment_shock,
              output_stock,
              employment_change_m,
              employment_change_total,
              output_change_m,
              output_change_total} = this.state;

        console.log("output_stock: ", output_stock);
        // console.log("output_projection",output_projection)
        return(
            <div className="Home">
            <div className="Search">
            <h1 className="header" >Input/output multipler calculation</h1>
            </div>
                <div className="Table">
                    <Table color={'blue'} celled padded striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell colSpan='6' className="TableName">Future Employment Projection</Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.HeaderCell width={3} ></Table.HeaderCell>
                                <Table.HeaderCell width={3}>Current Full-time Employment <span className="special"> ** </span>in 2015</Table.HeaderCell>
                                <Table.HeaderCell width={1}>Shock<span className="special">*</span></Table.HeaderCell>
                                <Table.HeaderCell width={3}>Future Employment in 2040 in Baseline Model</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Change of Full-time Employment after Shock</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Future Full-time Employment in 2040 after Shock</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {employment_projection.map((item, i)=>
                                <Table.Row key={i}>
                                    <Table.Cell className="title">
                                        {item[0]}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {item[1].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Table.Cell>
                                    
                                    <Table.Cell className="cell">
                                        <Input  size='mini' type='number' className="inputchange" value={employment_shock[i]} onChange={this.handleShockEmploymentChange.bind(this,i)}/> 
                                    </Table.Cell>
                                    <Table.Cell className="change">
                                       {item[3].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Table.Cell>
                
                                    <Table.Cell className="change">
                                        {Number(employment_change_m[i]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Table.Cell>
                                    <Table.Cell className="change">
                                        {(Number(item[3])+ Number(employment_change_m[i])).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Table.Cell>
                                    </Table.Row> 
                            )}
                            <Table.Row>
                                <Table.Cell>
                                </Table.Cell>
                                <Table.Cell className="title">
                                    Total current employment
                                </Table.Cell>       
                                <Table.Cell> 
                                </Table.Cell>
                                <Table.Cell> 
                                    Total future employment(baseline)
                                </Table.Cell>
                                <Table.Cell className="title"> 
                                    Total change in employment
                                </Table.Cell>
                                <Table.Cell className="title"> 
                                    Total future employment
                                </Table.Cell>
                            </Table.Row>
                             <Table.Row>
                                <Table.Cell>
                                </Table.Cell>
                                <Table.Cell>
                                     126,919.15 
                                </Table.Cell>
                                <Table.Cell> 

                                </Table.Cell>
                                <Table.Cell>
                                     152,014.01 
                                </Table.Cell>
                                <Table.Cell> 
                                    {Number(employment_change_total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </Table.Cell>
                                <Table.Cell> 
                                    {(Number(employment_change_total)+ 152014.01 ).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                    <Segment>
                        <div>
                            <span className="special">*</span> Type in amount of investments(million dollars) in one or more sectors to build different scenarios. Now the example investment is 300 million dollars in  92 Government & non NAICs.
                        </div>
                        <div>
                            <span className="special">**</span>The full-time employment number=number of total hours of work divided by 40 hours, hence decimal numbers.             
                        </div>
                    </Segment>
                </div>
                <br/>
                <br/>
                <div className="Table">
                    <Table color={'blue'} celled padded striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell  colSpan='5' className="TableName">Future Output Projection</Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.HeaderCell  width={3} className="TableName"></Table.HeaderCell>
                                <Table.HeaderCell className="title" width={3}>Current Output($ million)</Table.HeaderCell>
                                <Table.HeaderCell className="title" width={2}>Shock<span className="special">*</span></Table.HeaderCell>
                                <Table.HeaderCell className="title" width={4}>Change of Output($ million) by Shock</Table.HeaderCell>
                                <Table.HeaderCell className="title" width={4}>Output after Shock($ million)</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {output_projection.map((item, i)=>
                                <Table.Row key={i}>
                                    <Table.Cell className="title">
                                        {item[0]}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {item[1]? item[1].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") :null}
                                    </Table.Cell>
                                    <Table.Cell className="cell">
                                        <Input size='mini' type='number' value={output_stock[i]} onChange={this.handleShockOutputChange.bind(this,i)}/> 
                                    </Table.Cell>

                                    <Table.Cell className="change">
                                        {Number(output_change_m[i]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Table.Cell>
                                    <Table.Cell className="change">
                                        {(Number(item[1])+ Number(output_change_m[i])).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Table.Cell>
                                </Table.Row> 
                            )}
                            <Table.Row>
                                <Table.Cell>
                                </Table.Cell>
                                <Table.Cell className="title">
                                    Total current output
                                </Table.Cell>
                                <Table.Cell> 
                                </Table.Cell>
                                <Table.Cell className="title"> 
                                    Total change in output
                                </Table.Cell>
                                <Table.Cell className="title"> 
                                    Total output after shock
                                </Table.Cell>
                            </Table.Row>
                             <Table.Row>
                                <Table.Cell>
                                </Table.Cell>
                                <Table.Cell>
                                     18,978.73 
                                </Table.Cell>
                                <Table.Cell> 
                                </Table.Cell>
                                <Table.Cell> 
                                    {Number(output_change_total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </Table.Cell>
                                <Table.Cell> 
                                    {(Number(output_change_total)+  18978.73  ).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                        
                        </Table>
                        <Segment>
                            <div>
                                <span className="special">*</span> Type in amount of investments(million dollars) in one or more sectors to build different scenarios. Now the example investment is 300 million dollars in  92 Government & non NAICs.
                            </div>
                        </Segment>
                </div>
            </div>
        )
    }
}

export default Home
