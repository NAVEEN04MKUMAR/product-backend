const kill = require('kill-port');

// Kill process running on port 3000
let port=5173;

kill(port)
  .then(() => {
    console.log(`Process killed on port 3000 ${port}`);
  })
  
  .catch((err) => {
    console.error('Error killing process:', err);
  });


