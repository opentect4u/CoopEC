
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css'; // Or any other theme
// import 'primereact/resources/primereact.min.css';

const TestPage = () => {
  // const toast = useRef(null);
	const [useData, setSetData] = useState([{
		"transaction_date": "2024-12-03T18:30:00.000Z",
		"credit_amt": 5300,
		"group_code": 1202364549,
		"tot_emi": "5300.00",
		"created_code": "10228",
		"group_name": "MONDAY",
		"created_by": "BABAI DAS",
		"outstanding": 98050,
		"id": 1,
	  }, 
	  {
		"transaction_date": "2024-12-03T18:30:00.000Z",
		"credit_amt": 5300,
		"group_code": 12023649,
		"tot_emi": "5300.00",
		"created_code": "10228",
		"group_name": "MONDAY",
		"created_by": "BABAI DAS",
		"outstanding": 98050,
		"id": 2,
	  },
	  {
		"transaction_date": "2024-12-03T18:30:00.000Z",
		"credit_amt": 5300,
		"group_code": 1202374649,
		"tot_emi": "5300.00",
		"created_code": "10228",
		"group_name": "MONDAY",
		"created_by": "BABAI DAS",
		"outstanding": 98050,
		"id": 3,
	  },
	  {
		"transaction_date": "2024-12-03T18:30:00.000Z",
		"credit_amt": 5300,
		"group_code": 120236498,
		"tot_emi": "5300.00",
		"created_code": "10228",
		"group_name": "MONDAY",
		"created_by": "BABAI DAS",
		"outstanding": 98050,
		"id": 11,
	  }, 
	  {
		"transaction_date": "2024-12-03T18:30:00.000Z",
		"credit_amt": 5300,
		"group_code": 120236494,
		"tot_emi": "5300.00",
		"created_code": "1022886",
		"group_name": "MONDAY",
		"created_by": "BABAI DAS",
		"outstanding": 98050,
		"id": 22,
	  },
	  {
		"transaction_date": "2024-12-03T18:30:00.000Z",
		"credit_amt": 5300,
		"group_code": 120236497,
		"tot_emi": "5300.00",
		"created_code": "10228",
		"group_name": "MONDAY",
		"created_by": "BABAI DAS",
		"outstanding": 98050,
		"id": 33,
	  }])

    useEffect(() => {

    }, []);


    
   

    return (
        <div className="datatable-rowexpansion-demo" style={{marginTop: 150}}>
            {/* <Toast ref={toast} /> */}

            <div className="card">
            <DataTable value={useData} responsiveLayout="scroll">
                    <Column field="group_name" header="Name" sortable></Column>
                    <Column field="created_code" header="Designation" sortable></Column>
                    <Column field="created_by" header="Email" sortable></Column>
                    {/* <Column headerStyle={{ width: '4rem'}}></Column> */}
                </DataTable>
            </div>
        </div>
    );
}
  
export default TestPage