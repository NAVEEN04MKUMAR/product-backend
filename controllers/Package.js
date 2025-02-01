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



const PackageInsurance=async(req,res)=>{
    console.log("common");
    const { customername, locationname, address,policies  } = req.body;
    console.log("policies",policies);

    if (!customername || !locationname || !address ||!policies) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    try {
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

    // const insurancedata = {
    //     PolicyDetails: {
    //         SaveOrSubmit: "Submit",
    //         CustomerReferenceNo: customerreference,
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
    //     LocationList: [
    //         {
    //             LocationId: 1,
    //             LocationName: locationname,
    //             Address: address,
    //             SectionList: sectiondetails
    //         }
    //     ]
    // };

    for (const policy of policies) {
      const { PolicyId, amount } = policy;
     const policyQuery = `INSERT INTO BuildingInsuranceData (
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
        amount 
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    
    const policyValues = [
        customerreferenceno, 
        PolicyId , 
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
        1, 
        locationname,
        address, 
        amount
    ];

    console.log("Executing query:", policyQuery);
    console.log("With values:", policyValues);

    const [result] = await connection.query(policyQuery, policyValues);
  // const [result]= await connection.query(policyQuery, policyValues, (err, results) => {
  //       if (err) {
  //           console.error("Error inserting data:", err.message);
  //           return res.status(500).send({ message: "Failed to add insurance data", error: err.message });
  //       }
  //       console.log('Data inserted successfully:', results);
        console.log('Saving insurance data:',result);
}
        return res.status(201).send({ message: "Insurance data saved successfully",customerreferenceno: customerreferenceno  });
    } catch (error) {
        console.error("Error while adding product:", error); 
        return res.status(500).send({ message: "Failed to add product", error:error.message });
    }
};


const PackageGetInsurance= async (req, res) => {
    const { customerreferenceno } = req.params;
    console.log("Fetching data for CustomerReferenceNo:", customerreferenceno);

    try {

        const query = `SELECT customername,locationname, address, PolicyId, amount FROM BuildingInsuranceData WHERE CustomerReferenceNo = ?`;
        console.log("Executing query:", query, "with parameter:", customerreferenceno);

        const [results] = await connection.query(query, [customerreferenceno]);
            if (results.length === 0) {
                return res.status(404).send({ message: "No data found for the given reference." });
            }
            console.log("Query Results:", results);
        return res.status(200).send(results); 

       
        // connection.query(query, [customerreferenceno], (err, results) => {
        //     if (err) {
        //         console.error("Error fetching data:", err.message);
        //         return res.status(500).send({ message: "Failed to fetch data", error: err.message });
        //     }
        // });
        
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).send({ message: "Server error", error: error.message });
    }
};



const UpdatePackageInsurance= async (req, res) => {
  //, sectiondetails
    const { customerreferenceno, customername, locationname, address,policies } = req.body;
    console.log({ customerreferenceno, customername, locationname, address,policies });

  
   //|| !sectiondetails
    if (!customerreferenceno || !customername || !locationname || !address ||!policies ) {
      return res.status(400).json({ message: "All fields are required." });
    }
//          // sectiondetails = ?

    try {
      const query = `
        UPDATE BuildingInsuranceData

        SET 
          customername = ?,
          locationname = ?,
          address = ?
        
        WHERE 
           CustomerReferenceNo = ?
      `;
      let result;
  
      try {
        const [queryresult] = await connection.query(query, [
          customername,
          locationname,
          address,
          customerreferenceno,
        ]);
        result=queryresult;
        console.log("Query result:", result);
       

    for (const { PolicyId, amount } of policies) {
      const updatePolicyQuery = `
        UPDATE BuildingInsuranceData
        SET amount = ?
        WHERE CustomerReferenceNo = ? AND PolicyId = ?
      `;
      
      const [policyUpdateResult] = await connection.query(updatePolicyQuery, [
        amount,
        customerreferenceno,
        PolicyId,
      ]);

      if (policyUpdateResult.affectedRows === 0) {
        console.log(`No policy found with PolicyId ${PolicyId} for CustomerReferenceNo ${customerreferenceno}`);
      }
     
      return res.json({ message: "Insurance data updated successfully." });

    }
      } catch (error) {
        console.error("Error executing query:", error);
      }
      console.log("Result from query:", result);
      if (result.affectedRows > 0) {
        return res.json({ message: "Insurance data updated successfully." });
      } else {
        return res.status(404).json({ message: "No record found with the given customerreference." });
      }
      
    } catch (error) {
      console.error("Error updating data:", error);
      return res.status(500).json({ message: "Failed to update data.", error: error.message });
    }
  };
  



module.exports = {
    PackageInsurance,
    PackageGetInsurance,
    UpdatePackageInsurance,
};
