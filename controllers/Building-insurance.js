


const mysql = require('mysql2');

const connection = require('mysql2').createConnection({
    host: 'localhost',        
    user: 'root',             
    password: '@naveen04m',  
    database: 'insurance' 
}).promise();

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL database!');
});



const  BuildingInsurance=async(req,res)=>{

  const { action,CustomerReferenceNo,PolicyDetails, brokerdetails, LocationList } = req.body;
  // const insurancedata = req.body;
  // const allLocationsData = req.body;
  // console.log("sectiondetails:",customername, locationdata);
  console.log("action",action);

  console.log("Location Data:", JSON.stringify(LocationList, null, 2));
  // console.log("Location Data:", JSON.stringify(sections, null, 2));


  //   if (!action ||!customername || !locationname || !address ||!policies||!sectiondetails) {
  //     return res.status(400).json({ error: 'All fields are required.' });
  // }

   
    try {

if(action==='add-customer'){

  // async function insertData(insurancedata) {
    // const { PolicyDetails, brokerdetails, LocationList } = insurancedata;
const customername="naveen";
    const customerreferenceno = `AIC-CUST-${Math.floor(Math.random() * 10000)}`;
    for (const location of LocationList) {
        const { LocationId, LocationName, Address, SectionList } = location;
        
        // console.log("SectionList:", SectionList);
        // console.log("Location Data:", { LocationId, LocationName, Address });

        for (const section of SectionList) {
            const { sectionId, sectionname, policies } = section;  

        // console.log("sectionId in Backend:", sectionId);  
        // console.log("sectionname in Backend:", sectionname); 
        // console.log("policy in Backend:", policies); 


  for (const policy of policies) {
    const { PolicyId, amount, type } = policy;
    
    // console.log("PolicyId in Backend:",PolicyId);  
    // console.log("amount in Backend:", amount); 
    // console.log("type in Backend:",type );  
   
    if (type === 'common') {
      const { PolicyId, amount } = policy;
      // console.log("PolicyId in Backend:",PolicyId);  
      // console.log("amount in Backend:", amount); 
  
  
     const policyQuery = `INSERT IGNORE INTO CommonInsuranceData (
        CustomerReferenceNo, 
        PolicyId, 
        SaveOrSubmit, 
        PolicyStartDate, 
        PolicyEndDate, 
        CustomerName, 
        Currency, 
        ExchangeRate, 
        BuildingOwnerYn, 
        Createdby, 
        IndustryId, 
        InsuranceId, 
        ProductId, 
        BranchCode,
        BrokerName,
        BrokerContact,
        BrokerEmail,
        LocationName,
        Address,
        amount ,
        sectionId,
        sectionname
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE amount = VALUES(amount);
     `;
   
     const currentdate = new Date();
     const policystartdate = new Date(currentdate);
     policystartdate.setFullYear(currentdate.getFullYear() + 1);
     const policyenddate = new Date(policystartdate);
     policyenddate.setFullYear(policystartdate.getFullYear() + 1);
 let customername="naveen";
 

    const policyValues = [
      customerreferenceno, 
      PolicyId || null  , 
      'Submit', 
     policystartdate.toISOString().split('T')[0], 
    policyenddate.toISOString().split('T')[0], 
      customername, 
       'TZS', 
       1.0, 
       'N', 
        'brokerks', 
       '99999', 
        '100002', 
       '59', 
       '01',
        brokerdetails.BrokerName, 
        brokerdetails.BrokerContact,
        brokerdetails.BrokerEmail, 
        LocationName, 
        Address,
        amount,
        sectionId,
        sectionname
    ];
  
    // console.log("Executing query:", policyQuery);
    console.log("With values:", policyValues);
  
    const [result] = await connection.query(policyQuery, policyValues);
  console.log('result for the commoninsurancedata for location',result);
  
    } else if (policy.type === 'building') {

      const getLocationId = async (customerreferenceno,LocationName, Address) => {
        const query = `SELECT LocationId FROM CommonInsuranceData WHERE CustomerReferenceNo = ? AND LocationName = ? AND Address = ?`;
        console.log('Executing query:', query);
      console.log('With parameters:', [customerreferenceno, LocationName, Address]);
        const [rows] = await connection.query(query, [customerreferenceno,LocationName, Address]);
        console.log('Query result:', rows);
        return rows.length > 0 ? rows[0].LocationId : null;
      };
      const LocationId = await getLocationId(customerreferenceno, LocationName, Address);
      console.log('Inserting already existing locationid location for:', LocationId);
    
      
      const [amountResult] = await connection.query(`
        SELECT AmountId 
        FROM CommonInsuranceData 
        WHERE LocationId = ? AND SectionId = ? 
        ORDER BY CreatedAt DESC 
        LIMIT 1
      `, [LocationId , sectionId]);
      
      const amountId = amountResult.length > 0 ? amountResult[0].AmountId : null;
      console.log('Last inserted AmountId for LocationId and SectionId:', amountId);
    
      const policyQuery = `INSERT IGNORE INTO BuildingInsuranceData (
        CustomerReferenceNo, 
        PolicyId, 
        SaveOrSubmit, 
        PolicyStartDate, 
        PolicyEndDate, 
        CustomerName, 
        Currency, 
        ExchangeRate, 
        BuildingOwnerYn, 
        Createdby, 
        IndustryId, 
        InsuranceId, 
        ProductId, 
        BranchCode,
        BrokerName,
        BrokerContact,
        BrokerEmail,
        LocationId,
        LocationName,
        Address,
        amount ,
        sectionId,
        sectionname
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE amount = VALUES(amount);
     `;
      

     const currentdate = new Date();
     const policystartdate = new Date(currentdate);
     policystartdate.setFullYear(currentdate.getFullYear() + 1);
     const policyenddate = new Date(policystartdate);
     policyenddate.setFullYear(policystartdate.getFullYear() + 1);
 
    const policyValues = [
      customerreferenceno, 
      PolicyId|| null , 
      'Submit', 
     policystartdate.toISOString().split('T')[0], 
    policyenddate.toISOString().split('T')[0], 
      customername, 
       'TZS', 
       1.0, 
       'N', 
        'brokerks', 
       '99999', 
        '100002', 
       '59', 
       '01',
        brokerdetails.BrokerName, 
        brokerdetails.BrokerContact,
        brokerdetails.BrokerEmail, 
        LocationId,
        LocationName, 
        Address,
        amount,
        sectionId,
        sectionname
    ];
  
  
    // console.log("Executing query:", policyQuery);
    console.log("With values:", policyValues);
  
    const [result] = await connection.query(policyQuery, policyValues);
        console.log('Saving insurance data:',result);
        return res.status(201).send({ message: "Insurance data saved successfully",customerreferenceno: customerreferenceno,locationid:LocationId });

  } else {
      throw new Error(`Unknown policy type: ${policy.type}`);
  }

}//policy


        }//section
      }//location

    // }
  // await insertData(insurancedata)
  // .then(() => console.log("Data inserted successfully"))
  // .catch(err => console.error("Error inserting data:", err));

 }//add customer

else if(action==='add-location'){
  console.log('action');
 
  if (!CustomerReferenceNo) {
    return res.status(400).json({ error: 'CustomerReferenceNo is required for adding a location.' });
}

    for (const location of LocationList) {
        const { LocationId, LocationName, Address, SectionList } = location;
  
        // console.log("SectionList in backend:", SectionList);
        console.log("Location Data: in backend", { LocationId, LocationName, Address });

        for (const section of SectionList) {
        const { sectionId, sectionname, policies } = section;
  
       console.log("sectionId in Backend:", sectionId);  
      //   console.log("sectionname in Backend:", sectionname); 
        console.log("policy in Backend:", policies);  
 

           for (const policy of policies) {    
            const { PolicyId, amount, type } = policy;
         
          // console.log("PolicyId in Backend:",PolicyId);  
          // console.log("amount in Backend:", amount); 
          // console.log("type in Backend:",type );  
         
          if (type === 'common') {
        
           const policyQuery = `INSERT IGNORE INTO CommonInsuranceData (
              CustomerReferenceNo, 
              PolicyId, 
              SaveOrSubmit, 
              PolicyStartDate, 
              PolicyEndDate, 
              CustomerName, 
              Currency, 
              ExchangeRate, 
              BuildingOwnerYn, 
              Createdby, 
              IndustryId, 
              InsuranceId, 
              ProductId, 
              BranchCode,
              BrokerName,
              BrokerContact,
              BrokerEmail,
              LocationId, 
              LocationName,
              Address,
              amount ,
              sectionid,
              sectionname
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE amount = VALUES(amount);
           `;
         
           const currentdate = new Date();
           const policystartdate = new Date(currentdate);
           policystartdate.setFullYear(currentdate.getFullYear() + 1);
           const policyenddate = new Date(policystartdate);
           policyenddate.setFullYear(policystartdate.getFullYear() + 1);
       customername="naveen";
       
           
          const policyValues = [
            CustomerReferenceNo,
           PolicyId || null  , 
            'Submit', 
           policystartdate.toISOString().split('T')[0], 
          policyenddate.toISOString().split('T')[0], 
            customername, 
             'TZS', 
             1.0, 
             'N', 
              'brokerks', 
             '99999', 
              '100002', 
             '59', 
             '01',
              brokerdetails.BrokerName, 
              brokerdetails.BrokerContact,
              brokerdetails.BrokerEmail, 
              LocationId, 
              LocationName, 
              Address,
              amount,
              sectionId,
              sectionname
          ];
        
          // console.log("Executing query:", policyQuery);
          // console.log("With values:", policyValues);
        
          const [result] = await connection.query(policyQuery, policyValues);
        console.log('result for the commoninsurancedata for location',result);

//         const commonamountid = `
//         SELECT AmountId
//         FROM CommonInsuranceData 
//         WHERE LocationId = ? AND sectionId = ? 
//         ORDER BY CreatedAt DESC
//         LIMIT 1
//         ;
//         `;
//         const [commonamountidresult] = await connection.query(commonamountid, [LocationId, sectionId]);
//         const amountId = commonamountidresult.length > 0 ? commonamountidresult[0].AmountId : null;
// console.log('AmountId:', amountId); 
//   console.log('commonamountid',commonamountidresult);     
 
  // const newLocationId = async (CustomerReferenceNo,locationname, address) => {
  //   const query1 = `SELECT LocationId FROM CommonInsuranceData WHERE CustomerReferenceNo = ? AND LocationName = ? AND Address = ?`;
  //   console.log('Executing query:', query1);
  // console.log('With parameters:', [CustomerReferenceNo, locationname, address]);
  //   const [rows1] = await connection.query(query1, [CustomerReferenceNo,locationname, address]);
  //   console.log('Query result:', rows1);
  //   return rows1.length > 0 ? rows1[0].LocationId : null;
  // };
  // const newlocationid = await newLocationId(CustomerReferenceNo, LocationName, Address);
  // console.log('Inserting already existing locationid location for:', newlocationid);


  // const [result1] = await connection.query(sectionQuery, SectionValues);
        // console.log('Saving insurance data for location:',result1);        
          } else if (policy.type === 'building') {

            const newLocationId = async (CustomerReferenceNo,LocationName, Address) => {
              const query1 = `SELECT LocationId FROM CommonInsuranceData WHERE CustomerReferenceNo = ? AND LocationName = ? AND Address = ?`;
              console.log('Executing query:', query1);
            console.log('With parameters:', [CustomerReferenceNo, LocationName, Address]);
              const [rows1] = await connection.query(query1, [CustomerReferenceNo,LocationName, Address]);
              console.log('Query result:', rows1);
              return rows1.length > 0 ? rows1[0].LocationId : null;
            };
            const newlocationid = await newLocationId(CustomerReferenceNo, LocationName, Address);
            console.log('Inserting already existing locationid location for:', newlocationid);
          
            const policyQuery = `INSERT IGNORE INTO BuildingInsuranceData (
              CustomerReferenceNo, 
              PolicyId, 
              SaveOrSubmit, 
              PolicyStartDate, 
              PolicyEndDate, 
              CustomerName, 
              Currency, 
              ExchangeRate, 
              BuildingOwnerYn, 
              Createdby, 
              IndustryId, 
              InsuranceId, 
              ProductId, 
              BranchCode,
              BrokerName,
              BrokerContact,
              BrokerEmail,
              LocationId, 
              LocationName,
              Address,
              amount ,
              sectionid,
              sectionname
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE amount = VALUES(amount);
           `;

           const currentdate = new Date();
           const policystartdate = new Date(currentdate);
           policystartdate.setFullYear(currentdate.getFullYear() + 1);
           const policyenddate = new Date(policystartdate);
           policyenddate.setFullYear(policystartdate.getFullYear() + 1);
       customername="naveen";
       

           const policyValues = [
            CustomerReferenceNo,
                        PolicyId|| null , 
            'Submit', 
           policystartdate.toISOString().split('T')[0], 
          policyenddate.toISOString().split('T')[0], 
            customername, 
             'TZS', 
             1.0, 
             'N', 
              'brokerks', 
             '99999', 
              '100002', 
             '59', 
             '01',
              brokerdetails.BrokerName, 
              brokerdetails.BrokerContact,
              brokerdetails.BrokerEmail, 
              newlocationid,  
              LocationName,
              Address,
              amount,
              sectionId,
              sectionname
          ];
        
        
          // console.log("Executing query:", policyQuery);
          // console.log("With values:", policyValues);
        
          const [result] = await connection.query(policyQuery, policyValues);
              // console.log('Saving insurance data:',result);
 
        const buildingamountid = `
        SELECT AmountId
        FROM BuildingInsuranceData 
        WHERE LocationId = ? AND sectionId = ? 
        ORDER BY CreatedAt DESC
        LIMIT 1
        ;
        `;
        const [buildingamountidresult] = await connection.query(buildingamountid, [newlocationid, sectionId]);
        const buildingamountId = buildingamountidresult.length > 0 ? buildingamountidresult[0].AmountId : null;
console.log('AmountId:', buildingamountId); // Should print 25 or null if not found

  console.log('commonamountid',buildingamountidresult);     
  return res.status(201).send({ message: "Insurance data saved successfully for location",customerreferenceno: CustomerReferenceNo,locationid:newlocationid });
  
      }//else if building
        }//policy
      }//section
    }//location

     } //add location
  //    await insertData(insurancedata)
  // .then(() => console.log("Data inserted successfully"))
  // .catch(err => console.error("Error inserting data:", err));

//,locationId:LocationId  

  
// }
 
    } catch (error) {
        console.error("Error while adding product:", error); 
        return res.status(500).send({ message: "Failed to add product", error:error.message });
    }
  
       
   }
    
const  BuildingGetInsurance = async (req, res) => {
    const { customerreferenceno } = req.params;
    console.log("Fetching data for CustomerReferenceNo:", customerreferenceno);

    try {

        const query = `SELECT LocationId, customername,locationname, address, PolicyId, CustomerReferenceNo,amount,sectionId, CreatedAt, amountId, type ,risk_id
        FROM BuildingInsuranceData 
        WHERE CustomerReferenceNo = ?
        ORDER BY locationId DESC, sectionId DESC, amountId DESC  
        `;
        // console.log("Executing query:", query, "with parameter:", customerreferenceno);

        const [results] = await connection.query(query, [customerreferenceno]);
            if (results.length === 0) {
                return res.status(404).send({ message: "No data found for the given reference." });
            }

            const data = {};
    results.forEach(row => {

      if (!data[row.LocationId]) {
        data[row.LocationId] = {
          locationname:row.locationname,
          address: row.address,
          product: {},
        };
      }

      if (!data[row.LocationId].product[row.sectionId]) {
        data[row.LocationId].product[row.sectionId] = {
          policyId: row.PolicyId, 
          amounts: [],
        };
      }

      data[row.LocationId].product[row.sectionId]. amounts.push({
        amountId: row.amountId,
        amount: row.amount,
        createdAt: row.CreatedAt,
        riskid:row.risk_id
      });
    });
    console.log(JSON.stringify('for the building insurancedata',data, null, 2));

        const query1 = `SELECT LocationId,customername,locationname, address, PolicyId, CustomerReferenceNo,amount,sectionId, CreatedAt, amountId, type,risk_id
         FROM CommonInsuranceData
         WHERE CustomerReferenceNo = ?
                ORDER BY locationId DESC, sectionId DESC, amountId DESC  
`;
        // console.log("Executing query:", query1, "with parameter:", customerreferenceno);

        const [results1] = await connection.query(query1, [customerreferenceno]);
            if (results1.length === 0) {
                return res.status(404).send({ message: "No data found for the given reference." });
            }

            const data1 = {};
            results1.forEach(row => {
        
              if (!data1[row.LocationId]) {
                data1[row.LocationId] = {
                  locationname:row.locationname,
                  address: row.address,
                  product: {},
                };
              }
        
              if (!data1[row.LocationId].product[row.sectionId]) {
                data1[row.LocationId].product[row.sectionId] = {
                  policyId: row.PolicyId, 
                  amounts: [],
                };
              }
        
              data1[row.LocationId].product[row.sectionId]. amounts.push({
                amountId: row.amountId,
                amount: row.amount,
                createdAt: row.CreatedAt,
                riskid:row.risk_id
              });
            });
            console.log(JSON.stringify('for the common insurancedata',data1, null, 2));


              //  console.log('for the sectioninsurancedata',JSON.stringify(data2, null, 2));
        return res.status(200).send({a:results,b:results1}); 
           } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).send({ message: "Server error", error: error.message });
    }
};

const  UpdateBuildingInsurance= async (req, res) => {
    const { customerreferenceno, customername, locationname, address,policies, CommonInsuranceData,
    SectionInsuranceData,locationid,sectionId,CreatedAt,amountId,bamountId  } = req.body;
    // console.log('receiving at the update building',{ customerreferenceno, customername, locationname, address,policies, CommonInsuranceData,
    //   SectionInsuranceData,sectionId,CreatedAt,amountId,bamountId});

  
    if (!customerreferenceno || !customername || !locationname || !address ||!policies ) {
      return res.status(400).json({ message: "All fields are required." });
    }

console.log('locationid',locationid);
    try {

      const getLocationId = async (customerreferenceno) => {
        const query = `SELECT LocationId FROM BuildingInsuranceData WHERE CustomerReferenceNo = ? ORDER BY CreatedAt DESC LIMIT 1`;
        const [rows] = await connection.query(query, [customerreferenceno]);
        return rows.length > 0 ? rows[0].LocationId : null;
      };
      
 const Locationid = await getLocationId(customerreferenceno);
 if (!Locationid) {
   return res.status(404).json({ message: "LocationId not found for the given CustomerReferenceNo." });
 }
 console.log("LocationId:", Locationid);


      const query = `
        UPDATE BuildingInsuranceData

        SET 
          customername = ?,
          locationname = ?,
          address = ?

        
        WHERE 
           CustomerReferenceNo = ? AND LocationId = ?  AND locationname = ? AND address = ?
      `;
      let result;
      const [buildingqueryresult] = await connection.query(query, [
        customername,
        locationname,
        address,
        customerreferenceno,
        Locationid,
        locationname,
        address
      ]);
      result=buildingqueryresult;

      console.log("Query result:", result);

    if (buildingqueryresult.affectedRows === 0) {
      return res.status(404).json({ message: "No record found to update in buildingInsuranceData." });
    }

    console.log("Updated buildingInsuranceData");



    for (const { PolicyId, amount,sectionId, type} of policies) {
      if(type==='building'){
       
             const updatePolicyQuery = `
               UPDATE BuildingInsuranceData
               SET amount = ?
               WHERE CustomerReferenceNo = ?
               AND LocationId = ?  
               AND locationname = ? 
               AND address = ?
               AND sectionId = ?
              AND  amountId = ?

             `;
             
             const [policyUpdateResult] = await connection.query(updatePolicyQuery, [
               amount,
               customerreferenceno,
               Locationid,
               locationname,
               address, 
               sectionId,
               amountId,
             ]);
             if (policyUpdateResult.affectedRows === 0) {
               console.log(`No policy found with PolicyId ${PolicyId} for CustomerReferenceNo ${customerreferenceno}`);
             }


       
           }       
}
}    
catch (error) {
 console.error("Error updating data:", error);
 return res.status(500).json({ message: "Failed to update data.", error: error.message });
}

try{

  const getLocationId = async (customerreferenceno) => {
    const query1 = `SELECT LocationId FROM CommonInsuranceData WHERE CustomerReferenceNo = ? ORDER BY CreatedAt DESC LIMIT 1`;
    const [rows] = await connection.query(query1, [customerreferenceno]);
    return rows.length > 0 ? rows[0].LocationId : null;
  };
  
const Locationid = await getLocationId(customerreferenceno);
if (!Locationid) {
return res.status(404).json({ message: "LocationId not found for the given CustomerReferenceNo." });
}
console.log("LocationId:", Locationid);


const query1 = `
UPDATE CommonInsuranceData

SET 
  customername = ?,
  locationname = ?,
  address = ?


WHERE 
   CustomerReferenceNo = ? AND LocationId = ?  AND locationname = ? AND address = ?
`;
let result1;
const [commoningqueryresult] = await connection.query(query1, [
customername,
locationname,
address,
customerreferenceno,
Locationid,
locationname,
address
]);
result1=commoningqueryresult;

console.log("Query result:", result1);

if (commoningqueryresult.affectedRows === 0) {
return res.status(404).json({ message: "No record found to update in buildingInsuranceData." });
}

console.log("Updated buildingInsuranceData");


for (const { PolicyId, amount,sectionId, type} of policies) {
   if(type==='common'){
     
  const updatecommonQuery = `
    UPDATE CommonInsuranceData
    SET amount = ?
    WHERE CustomerReferenceNo = ? 
    AND LocationId = ? 
    AND locationname = ? 
   AND address = ?
   AND sectionId = ?
  AND amountId = ?
  `;
  const [commonUpdateResult] = await connection.query(updatecommonQuery, [
    amount,
    customerreferenceno,
    Locationid,
    locationname,
    address,
    sectionId,
    bamountId,
  ]);

  if (commonUpdateResult.affectedRows === 0) {
    console.log(`No policy found with PolicyId ${PolicyId} for CustomerReferenceNo ${customerreferenceno}`);
  }

return res.json({ message: "Insurance data updated successfully." });

  }
}
   }catch(error){
    console.error("Error common table updating data:", error);
   }


  };
  
module.exports = {
  BuildingInsurance,
  BuildingGetInsurance,
  UpdateBuildingInsurance,
};

//insert section
  //   const sectionQuery = `INSERT INTO SectionInsuranceData (
  //     CustomerReferenceNo, 
  //     PolicyId, 
  //     SaveOrSubmit, 
  //     PolicyStartDate, 
  //     PolicyEndDate, 
  //     CustomerName, 
  //     Currency, 
  //     ExchangeRate, 
  //     BuildingOwnerYn, 
  //     Createdby, 
  //     IndustryId, 
  //     InsuranceId, 
  //     ProductId, 
  //     BranchCode,
  //     BrokerName,
  //     BrokerContact,
  //     BrokerEmail,
  //      LocationId,
  //     LocationName,
  //     Address,
  //     amount ,
  //     sectionId,
  //     sectionname,
  //     AmountId
  // ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  //     ON DUPLICATE KEY UPDATE amount = VALUES(amount);
  // `;
  
  // const SectionValues = [
  //   CustomerReferenceNo,
  //       PolicyId || null, 
  //   'Submit', 
  //  policystartdate.toISOString().split('T')[0], 
  // policyenddate.toISOString().split('T')[0], 
  //   customername, 
  //    'TZS', 
  //    1.0, 
  //    'N', 
  //     'brokerks', 
  //    '99999', 
  //     '100002', 
  //    '59', 
  //    '01',
  //     brokerdetails.BrokerName, 
  //     brokerdetails.BrokerContact,
  //     brokerdetails.BrokerEmail, 
  //     newlocationid, 
  //     LocationName, 
  //     Address,
  //     amount,
  //     sectionId,
  //     null,
  //     amountId
  // ];

  
  // console.log("Executing query for section:", sectionQuery);
  // console.log("With values for the section:",SectionValues);
  


// const [existingCustomer] = await connection.query(
//     `SELECT CustomerReferenceNo FROM BuildingInsuranceData WHERE CustomerReferenceNo = ? LIMIT 1`,
//     [CustomerReferenceNo]
// );

// if (existingCustomer.length === 0) {
//     return res.status(404).json({ error: 'CustomerReferenceNo not found.' });
// }
  // const currentdate = new Date();
  // const policystartdate = new Date(currentdate);
  // policystartdate.setFullYear(currentdate.getFullYear() + 1);
  // const policyenddate = new Date(policystartdate);
  // policyenddate.setFullYear(policystartdate.getFullYear() + 1);

  // const brokerdetails = {
  //     BrokerName: 'Naveenkumar', 
  //     BrokerContact: '9159026638',
  //     BrokerEmail: 'naveenkumar2022cse@gmail.com',
  //   };

    // const lastLocation = async (CustomerReferenceNo) => {
    //   const query = `SELECT LocationId,LocationName,Address 
    //                  FROM CommonInsuranceData WHERE CustomerReferenceNo = ?
    //                  ORDER BY CreatedAt DESC 
    //                 LIMIT 1;`;
    //   console.log('Executing query:', query);
    // console.log('With parameters:', [CustomerReferenceNo]);
    //   const [rows] = await connection.query(query, [CustomerReferenceNo]);
    //   console.log('Query result:', rows);
    //   return rows.length > 0 ? rows[0]: null;
    // };
    // const Locationde = await lastLocation(CustomerReferenceNo);
    // console.log('Inserting already existing locationid location for:', Locationde);

    // const { LocationId, LocationName, Address } = Locationde;
    // console.log('LocationId:', LocationId); 
    // console.log('LocationName:', LocationName);
    
    // let currentLocation=[];

//     if(Locationde){
// const { LocationId, LocationName, Address } = Locationde;
// console.log('LocationId:', LocationId); 
// console.log('LocationName:', LocationName);
// console.log('Address:', Address);
    
// // const isExisting = currentLocation.some(
// //   (loc) =>
// //     loc.locationname === LocationName && loc.address === Address
// // );
// // if(!isExisting){
// //     currentLocation.push({
// //        Locationid: LocationId,
// //       locationname: LocationName,
// //       address: Address
// //     });
// //   }    
// }


// const newLocation = {
//   //  Locationid:LocationId|| null,
//   locationname:locationname,
//   address: address,
// };

// const isDuplicate = currentLocation.some(
//   (loc) =>
//     loc.locationname === newLocation.locationname &&
//     loc.address === newLocation.address
// );
// if (!isDuplicate) {
//   currentLocation.push({ ...newLocation }); // Add only if not a duplicate
// }


    // console.log('policies', policies);
    // console.log('Current Location:', currentLocation);
    // console.log("policy in Backend:", policies);  


  // const insurancedata = {
  //     PolicyDetails: {
  //         SaveOrSubmit: "Submit",
  //         CustomerReferenceNo: CustomerReferenceNo,
  //         PolicyStartDate: policystartdate.toISOString().split('T')[0],
  //         PolicyEndDate: policyenddate.toISOString().split('T')[0],
  //         CustomerName: customername,
  //         Currency: "TZS",
  //         ExchangeRate: "1.0",
  //         BuildingOwnerYn: "N",
  //         Createdby: "brokerks",
  //         IndustryId: "99999",
  //         InsuranceId: "100002",
  //         ProductId: "59",
  //         BranchCode: "01",
  //     },
  //     brokerdetails:brokerdetails,
  //     // LocationList: sectiondetailsWithPolicies,
  //     LocationList: [
  //         {
  //             LocationId: LocationId,
  //             LocationName: LocationName,
  //             Address: Address,
  //             SectionList:sections 
  //         }
  //     ]
  // };
  // console.log("Final insurancedata:", JSON.stringify(insurancedata, null, 2));

  // async function insertData(insurancedata) {
    // const { PolicyDetails, brokerdetails, LocationList } = insurancedata;


  //           const query2 = `SELECT LocationId,customername,locationname, address, PolicyId, CustomerReferenceNo,amount,sectionId, CreatedAt, amountId, type
  //           FROM CommonInsuranceData
  //           WHERE CustomerReferenceNo = ?
  //                  ORDER BY locationId DESC, sectionId DESC, amountId DESC  
  //  `;
  //         //  console.log("Executing query:", query2, "with parameter:", customerreferenceno);
   
  //          const [results2] = await connection.query(query2, [customerreferenceno]);
  //              if (results2.length === 0) {
  //                  return res.status(404).send({ message: "No data found for the given reference." });
  //              }
  //              // console.log("Query Results:", results1);
   
  //              const data2 = {};
  //              results2.forEach(row => {
           
  //                if (!data2[row.LocationId]) {
  //                  data2[row.LocationId] = {
  //                    locationname:row.locationname,
  //                    address: row.address,
  //                    product: {},
  //                  };
  //                }
           
  //                if (!data2[row.LocationId].product[row.sectionId]) {
  //                  data2[row.LocationId].product[row.sectionId] = {
  //                    policyId: row.PolicyId, 
  //                    amounts: [],
  //                  };
  //                }
           
  //                data2[row.LocationId].product[row.sectionId]. amounts.push({
  //                  amountId: row.amountId,
  //                  amount: row.amount,
  //                  createdAt: row.CreatedAt,
  //                });
  //              });



//for building
// const sectionQuery = `INSERT INTO SectionInsuranceData (
//   CustomerReferenceNo, 
//   PolicyId, 
//   SaveOrSubmit, 
//   PolicyStartDate, 
//   PolicyEndDate, 
//   CustomerName, 
//   Currency, 
//   ExchangeRate, 
//   BuildingOwnerYn, 
//   Createdby, 
//   IndustryId, 
//   InsuranceId, 
//   ProductId, 
//   BranchCode,
//   BrokerName,
//   BrokerContact,
//   BrokerEmail,
//    LocationId,
//   LocationName,
//   Address,
//   amount ,
//   sectionId,
//   sectionname,
//   AmountId
// ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   ON DUPLICATE KEY UPDATE amount = VALUES(amount);
// `;

// const SectionValues = [
// CustomerReferenceNo,
//     PolicyId || null, 
// 'Submit', 
// policystartdate.toISOString().split('T')[0], 
// policyenddate.toISOString().split('T')[0], 
// customername, 
//  'TZS', 
//  1.0, 
//  'N', 
//   'brokerks', 
//  '99999', 
//   '100002', 
//  '59', 
//  '01',
//   brokerdetails.BrokerName, 
//   brokerdetails.BrokerContact,
//   brokerdetails.BrokerEmail, 
//   newlocationid, 
//   LocationName, 
//   Address,
//   amount,
//   sectionId,
//   null,
//   buildingamountId
// ];

// // console.log("Executing query for section:", sectionQuery);
// // console.log("With values for the section:",SectionValues);

// const [result1] = await connection.query(sectionQuery, SectionValues);
//     // console.log('Saving insurance data for location:',result1);



//update building

    //          const updatesectionQuery = `
    //          UPDATE SectionInsuranceData
    //          SET amount = ?
    //          WHERE CustomerReferenceNo = ?
    //          AND LocationId = ?  
    //          AND locationname = ? 
    //          AND address = ?
    //          AND sectionId = ?
    //         AND  amountId = ?

    //        `;           
           
    //        const [policysectionResult] = await connection.query(updatesectionQuery, [
    //          amount,
    //          customerreferenceno,
    //          Locationid,
    //          locationname,
    //          address, 
    //          sectionId,
    //          amountId,
    //        ]);
    //  //
    //        if (policysectionResult.affectedRows === 0) {
    //          console.log(`No policy found with PolicyId ${PolicyId} for CustomerReferenceNo ${customerreferenceno}`);
    //        }

///   const updatesectionQuery = `
//   UPDATE SectionInsuranceData
//   SET amount = ?
//   WHERE CustomerReferenceNo = ?
//   AND LocationId = ?  
//   AND locationname = ? 
//   AND address = ?
//   AND sectionId = ?
//  AND  amountId = ?

// `;           

// const [policysectionResult] = await connection.query(updatesectionQuery, [
//   amount,
//   customerreferenceno,
//   Locationid,
//   locationname,
//   address, 
//   sectionId,
//   bamountId,
// ]);
// if (policysectionResult.affectedRows === 0) {
//   console.log(`No policy found with PolicyId ${PolicyId} for CustomerReferenceNo ${customerreferenceno}`);
// }
