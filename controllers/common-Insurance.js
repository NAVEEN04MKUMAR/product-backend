const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

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



const common=async(req,res)=>{
    console.log("common");
    const {action,customerreferenceno, customername, locationname, address,policies,sectiondetails  } = req.body;
    console.log("sectiondetails:", sectiondetails);
    console.log("policies:", policies);

    console.log('saction name',sectiondetails.sectionname); // Assuming section name is part of the policy


// Log all sectiondetails
if (Array.isArray(sectiondetails)) {
  sectiondetails.forEach((section, index) => {
    console.log(`Section ${index + 1} Name:`, section.sectionname || "Undefined");
    console.log(`Section ${index + 1} ID:`, section.sectionId || "Undefined");
  });
} else if (sectiondetails && typeof sectiondetails === "object") {
  console.log("Section Name:", sectiondetails.SectionName || "Undefined");
  console.log("Section ID:", sectiondetails.SectionId || "Undefined");
} else {
  console.log("No valid sectiondetails provided.");
}

    if (!action ||!customername || !locationname || !address ||!policies||!sectiondetails) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    try {

if(action==='add-customer'){
  // const locationId = uuidv4();

  const customerreferenceno = `AIC-CUST-${Math.floor(Math.random() * 10000)}`;

  const currentdate = new Date();
  const policystartdate = new Date(currentdate);
  policystartdate.setFullYear(currentdate.getFullYear() + 1);
  const policyenddate = new Date(policystartdate);
  policyenddate.setFullYear(policystartdate.getFullYear() + 1);





  const brokerdetails = {
      BrokerName: 'Naveenkumar', 
      BrokerContact: '9159026638',
      BrokerEmail: 'naveenkumar2022cse@gmail.com',
    };

  
  
    const sectiondetailsWithPolicies = policies.map(policy => {
      // const relatedPolicies = policies.filter(policy => policy.SectionId === section.SectionId);
      // console.log("relatedPolicies",relatedPolicies);
      // console.log("section.SectionId:", section.sectionId);
// Now log each policy's sectionId within the relatedPolicies array

const sectionId = policy.sectionId;  // The sectionId is already embedded in the policy
console.log("Policy sectionId:", sectionId); 

//   relatedPolicies.forEach(policy => {
//     console.log("policy.sectionId:", policy.sectionId);
// });
      
  const sectionWithPolicies = {
    // ...section,
    // policies: relatedPolicies,
    
    sectionId, // Directly from the policy
    // policyId: policy.PolicyId,
    // sectionname: policy.sectionname, // Assuming section name is part of the policy
    // amount: policy.amount,
    policies: [policy],
};

console.log("sectionWithPolicies:", sectionWithPolicies); 

return sectionWithPolicies;
  });

  console.log("Final sectiondetailsWithPolicies:", sectiondetailsWithPolicies);




  const insurancedata = {
      PolicyDetails: {
          SaveOrSubmit: "Submit",
          CustomerReferenceNo: customerreferenceno,
          PolicyStartDate: policystartdate.toISOString().split('T')[0],
          PolicyEndDate: policyenddate.toISOString().split('T')[0],
          CustomerName: customername,
          Currency: "TZS",
          ExchangeRate: "1.0",
          BuildingOwnerYn: "N",
          Createdby: "brokerks",
          IndustryId: "99999",
          InsuranceId: "100002",
         ProductId: "59",
          BranchCode: "01",
      },
      brokerdetails:brokerdetails,
      LocationList: [
          {
              LocationId: null, 
              LocationName: locationname,
              Address: address,
              SectionList:sectiondetailsWithPolicies 
          }
      ]
  };
  console.log("insurancedata",insurancedata);

  async function insertData(insurancedata) {
    const { PolicyDetails, brokerdetails, LocationList } = insurancedata;

    for (const location of LocationList) {
        const { LocationId, LocationName, Address, SectionList } = location;
        console.log("SectionList:", SectionList);

        console.log("Location Data:", { LocationId, LocationName, Address });



        for (const section of SectionList) {
            const { sectionId, sectionname, policies } = section;  

        console.log("sectionId in Backend:", sectionId);  
        console.log("sectionname in Backend:", sectionname); 
        console.log("policy in Backend:", policies); 


  for (const policy of policies) {
    const { PolicyId, amount } = policy;
    console.log("PolicyId in Backend:",PolicyId);  
    console.log("amount in Backend:", amount); 
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
      LocationName, 
      Address,
      amount,
      sectionId,
      sectionname
  ];


  console.log("Executing query:", policyQuery);
  console.log("With values:", policyValues);

  const [result] = await connection.query(policyQuery, policyValues);
      console.log('Saving insurance data:',result);
}
        }
      }
    }
  await insertData(insurancedata)
  .then(() => console.log("Data inserted successfully"))
  .catch(err => console.error("Error inserting data:", err));

      return res.status(201).send({ message: "Insurance data saved successfully",customerreferenceno: customerreferenceno  });
}

else if(action==='add-location'){
 
  if (!customerreferenceno) {
    return res.status(400).json({ error: 'CustomerReferenceNo is required for adding a location.' });
}

const [existingCustomer] = await connection.query(
    `SELECT CustomerReferenceNo FROM CommonInsuranceData WHERE CustomerReferenceNo = ? LIMIT 1`,
    [customerreferenceno]
);

if (existingCustomer.length === 0) {
    return res.status(404).json({ error: 'CustomerReferenceNo not found.' });
}
  const currentdate = new Date();
  const policystartdate = new Date(currentdate);
  policystartdate.setFullYear(currentdate.getFullYear() + 1);
  const policyenddate = new Date(policystartdate);
  policyenddate.setFullYear(policystartdate.getFullYear() + 1);

  const brokerdetails = {
      BrokerName: 'Naveenkumar', 
      BrokerContact: '9159026638',
      BrokerEmail: 'naveenkumar2022cse@gmail.com',
    };

    const sectiondetailsWithPolicies = policies.map(policy => {

const sectionId = policy.sectionId;  
console.log("Policy sectionId:", sectionId); 


      
  const sectionWithPolicies = {
    
    sectionId, 
    // policyId: policy.PolicyId,
    // sectionname: policy.sectionname, 
    // amount: policy.amount,
    policies: [policy],
};

console.log("sectionWithPolicies:", sectionWithPolicies); 

return sectionWithPolicies;
  });

  console.log("Final sectiondetailsWithPolicies:", sectiondetailsWithPolicies);

  const getLocationId = async (customerreferenceno,locationname, address) => {
    const query = `SELECT LocationId FROM CommonInsuranceData WHERE CustomerReferenceNo = ? AND LocationName = ? AND Address = ?`;
    console.log('Executing query:', query);
  console.log('With parameters:', [customerreferenceno, locationname, address]);
    const [rows] = await connection.query(query, [customerreferenceno,locationname, address]);
    console.log('Query result:', rows);
    return rows.length > 0 ? rows[0].LocationId : null;
  };
  const Locationid = await getLocationId(customerreferenceno, locationname, address);
  console.log('Inserting already existing locationid location for:', Locationid);


  const insurancedata = {
      PolicyDetails: {
          SaveOrSubmit: "Submit",
          CustomerReferenceNo: customerreferenceno,
          PolicyStartDate: policystartdate.toISOString().split('T')[0],
          PolicyEndDate: policyenddate.toISOString().split('T')[0],
          CustomerName: customername,
          Currency: "TZS",
          ExchangeRate: "1.0",
          BuildingOwnerYn: "N",
          Createdby: "brokerks",
          IndustryId: "99999",
          InsuranceId: "100002",
          ProductId: "59",
          BranchCode: "01",
      },
      brokerdetails:brokerdetails,
      LocationList: [
          {
              LocationId: Locationid,
              LocationName: locationname,
              Address: address,
              SectionList:sectiondetailsWithPolicies 
          }
      ]
  };
  console.log("insurancedata",insurancedata);

  async function insertData(insurancedata) {
    const { PolicyDetails, brokerdetails, LocationList } = insurancedata;

    for (const location of LocationList) {
        const { LocationId, LocationName, Address, SectionList } = location;
        console.log("SectionList in backend:", SectionList);
        console.log("Location Data: in backend", { LocationId, LocationName, Address });

        for (const section of SectionList) {
        const { sectionId, sectionname, policies } = section;
        console.log("sectionId in Backend:", sectionId);  
        console.log("sectionname in Backend:", sectionname); 
        console.log("policy in Backend:", policies);  
 
        for (const policy of policies) {    
    const { PolicyId, amount } = policy;
    console.log("PolicyId in Backend:",PolicyId);  
    console.log("amount in Backend:", amount); 

     const checkQuery = `
     SELECT COUNT(*) AS count 
     FROM CommonInsuranceData 
     WHERE LocationId = ? AND sectionId = ? AND amount = ?;
 `;
 const [checkResult] = await connection.query(checkQuery, [LocationId, sectionId, amount]);
 const recordExists = checkResult[0].count > 0;

 if (recordExists) {
     console.log(`Duplicate record for LocationId: ${LocationId}, sectionId: ${sectionId}, amount: ${amount}. Skipping insertion.`);
     continue;
 }

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
      sectionId,
      sectionname
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   ON DUPLICATE KEY UPDATE amount = VALUES(amount);
   `;
 
  
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
      LocationId, 
      LocationName, 
      Address,
      amount,
      sectionId,
      sectionname
  ];

  console.log("Executing query:", policyQuery);
  console.log("With values:", policyValues);

  const [result] = await connection.query(policyQuery, policyValues);
console.log('result for the commoninsurancedata for location',result);

// const [resultlocationid] = await connection.query('SELECT LAST_INSERT_ID() AS amountId');
// const location= resultlocationid[0].amountId;
// console.log('Last inserted amountId:', location);

const [amountResult] = await connection.query(`
  SELECT AmountId 
  FROM CommonInsuranceData 
  WHERE LocationId = ? AND SectionId = ? 
  ORDER BY CreatedAt DESC 
  LIMIT 1
`, [Locationid , sectionId]);

const amountId = amountResult.length > 0 ? amountResult[0].AmountId : null;
console.log('Last inserted AmountId for LocationId and SectionId:', amountId);

const checksectionQuery = `
SELECT COUNT(*) AS count 
FROM SectionInsuranceData 
WHERE LocationId = ? AND sectionId = ? AND amount = ?;
`;
const [checksectionResult] = await connection.query(checksectionQuery, [LocationId, sectionId, amount]);
const recordsectionExists = checksectionResult[0].count > 0;

if (recordsectionExists) {
console.log(`Duplicate record for LocationId: ${LocationId}, sectionId: ${sectionId}, amount: ${amount}. Skipping insertion.`);
continue;
}



  const sectionQuery = `INSERT INTO SectionInsuranceData (
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
    sectionname,
    amountId
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE amount = VALUES(amount);
`;


//   

const SectionValues = [
  customerreferenceno, 
  PolicyId || null, 
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
    null,
    amountId
];
//    //

console.log("Executing query for section:", sectionQuery);
console.log("With values for the section:",SectionValues);

const [result1] = await connection.query(sectionQuery, SectionValues);
      console.log('Saving insurance data for location:',result1);
}
        }
      }
    }
  await insertData(insurancedata)
  .then(() => console.log("Data inserted successfully"))
  .catch(err => console.error("Error inserting data:", err));

      return res.status(201).send({ message: "Insurance data saved successfully for location",customerreferenceno: customerreferenceno,locationId:Locationid  });
 
}
else {
  return res.status(400).json({ error: 'Invalid action. Use "add-customer" or "add-location".' });
}


 
    } catch (error) {
        console.error("Error while adding product:", error); 
        return res.status(500).send({ message: "Failed to add product", error:error.message });
    }

     
  }

const getdata = async (req, res) => {
    const { customerreferenceno } = req.params;
    console.log("Fetching data for CustomerReferenceNo:", customerreferenceno);

    try {

        const query = `SELECT LocationId, customername,locationname, address, PolicyId, CustomerReferenceNo,amount,sectionId, CreatedAt, amountId 
        FROM CommonInsuranceData 
        WHERE CustomerReferenceNo = ?
        ORDER BY locationId DESC, sectionId DESC, amountId DESC  
        `;
        console.log("Executing query:", query, "with parameter:", customerreferenceno);

        const [results] = await connection.query(query, [customerreferenceno]);
            if (results.length === 0) {
                return res.status(404).send({ message: "No data found for the given reference." });
            }
            console.log("Query Results for the common:", results);

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
          policyId: row.PolicyId, // Assuming one policy per sectionId
          amounts: [],
        };
      }

      data[row.LocationId].product[row.sectionId]. amounts.push({
        amountId: row.amountId,
        amount: row.amount,
        createdAt: row.CreatedAt,
      });
    });
    console.log(JSON.stringify(data, null, 2));


        const query1 = `SELECT LocationId,customername,locationname, address, PolicyId, CustomerReferenceNo,amount,sectionId, CreatedAt, amountId
         FROM SectionInsuranceData
         WHERE CustomerReferenceNo = ?
                ORDER BY locationId DESC, sectionId DESC, amountId DESC  
`;
        console.log("Executing query:", query1, "with parameter:", customerreferenceno);

        const [results1] = await connection.query(query1, [customerreferenceno]);
            if (results.length === 0) {
                return res.status(404).send({ message: "No data found for the given reference." });
            }
            console.log("Query Results:", results1);

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
              });
            });
            console.log(JSON.stringify(data1, null, 2));
        
        
        
        return res.status(200).send(results); 
       
        // connection.query(query, [customerreferenceno], (err, results) => {
        //     if (err) {
        //         console.error("Error fetching data:", err.message);
        //         return res.status(500).send({ message: "Failed to fetch data", error: err.message });
        //     }
        //}
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).send({ message: "Server error", error: error.message });
    }
};



const updatecommon= async (req, res) => {
    const { customerreferenceno, customername, locationname, address,policies, CommonInsuranceData,
    SectionInsuranceData,locationid,sectionId,CreatedAt,amountId } = req.body;
    console.log('receiving at the update common',{ customerreferenceno, customername, locationname, address,policies, CommonInsuranceData,
      SectionInsuranceData,sectionId,CreatedAt,amountId});

  
    if (!customerreferenceno || !customername || !locationname || !address ||!policies ) {
      return res.status(400).json({ message: "All fields are required." });
    }

console.log('locationid',locationid);
    try {


      const getLocationId = async (customerreferenceno) => {
        const query = `SELECT LocationId FROM CommonInsuranceData WHERE CustomerReferenceNo = ? ORDER BY CreatedAt DESC LIMIT 1`;
        const [rows] = await connection.query(query, [customerreferenceno]);
        return rows.length > 0 ? rows[0].LocationId : null;
      };
      
 const Locationid = await getLocationId(customerreferenceno);
 if (!Locationid) {
   return res.status(404).json({ message: "LocationId not found for the given CustomerReferenceNo." });
 }
 console.log("LocationId:", Locationid);


      const query = `
        UPDATE CommonInsuranceData

        SET 
          customername = ?,
          locationname = ?,
          address = ?

        
        WHERE 
           CustomerReferenceNo = ? AND LocationId = ?  AND locationname = ? AND address = ?
      `;
      let result;
      const [commonqueryresult] = await connection.query(query, [
        customername,
        locationname,
        address,
        customerreferenceno,
        Locationid,
        locationname,
        address
      ]);
      result=commonqueryresult;

      console.log("Query result:", result);

    if (commonqueryresult.affectedRows === 0) {
      return res.status(404).json({ message: "No record found to update in CommonInsuranceData." });
    }

    console.log("Updated CommonInsuranceData");

    for (const { PolicyId, amount,sectionId } of policies) {

 const checkDuplicateQuery = `
 SELECT 1 FROM CommonInsuranceData
 WHERE  CustomerReferenceNo = ?
       AND LocationId = ?
       AND locationname = ? 
       AND address = ?
         AND PolicyId != ?
       AND amount = ?
        AND sectionId = ?
        AND CreatedAt = ?
        AND amountId = ?    
       LIMIT 1

`;

const [existingRecords] = await connection.query(checkDuplicateQuery, [
  customerreferenceno,
 Locationid,
 locationname,
 address,
 sectionId,
 amount,
 PolicyId,
 CreatedAt,
 amountId
]);
console.log('existing record',existingRecords);
if (existingRecords.length > 0) {
 console.log(
   `Duplicate record found for LocationId: ${Locationid}, sectionId: ${sectionId}, amount: ${amount}`
 );
 continue;
}

      const updatePolicyQuery = `
        UPDATE CommonInsuranceData
        SET amount = ?
        WHERE CustomerReferenceNo = ?
        AND LocationId = ?  
        AND locationname = ? 
        AND address = ?
        AND sectionId = ?
        AND amountId = ? 
      `;
//        AND CreatedAt = ?
      
      console.log("Updating policies with:", {
        amount,
        customerreferenceno,
        Locationid,
        locationname,
        address, 
        sectionId,
        CreatedAt,
        amountId 
      });
      
      const [policyUpdateResult] = await connection.query(updatePolicyQuery, [
        amount,
        customerreferenceno,
        Locationid,
        locationname,
        address, 
        sectionId,
        amountId 
      ]);
//
      if (policyUpdateResult.affectedRows === 0) {
        console.log(`No policy found with PolicyId ${PolicyId} for CustomerReferenceNo ${customerreferenceno}`);
      }

    }

    
    // Step 2: Update the policies and amounts
    for (const { PolicyId,amount,sectionId } of policies) {
      const updateSectionQuery = `
        UPDATE SectionInsuranceData
        SET amount = ?
        WHERE CustomerReferenceNo = ? 
        AND LocationId = ? 
        AND locationname = ? 
       AND address = ?
       AND sectionId = ?
       AND amountId = ? 
      `;
      
      const [SectionUpdateResult] = await connection.query(updateSectionQuery, [
        amount,
        customerreferenceno,
        Locationid,
        locationname,
        address, 
        sectionId,
        amountId 
      ]);

      if (SectionUpdateResult.affectedRows === 0) {
        console.log(`No policy found with PolicyId ${PolicyId} for CustomerReferenceNo ${customerreferenceno}`);
      }
    }
    return res.json({ message: "Insurance data updated successfully." });
    }    
     catch (error) {
      console.error("Error updating data:", error);
      return res.status(500).json({ message: "Failed to update data.", error: error.message });
    }
  };
  


console.log(typeof common); 

module.exports = {
    common,
    getdata,
    updatecommon,
};
