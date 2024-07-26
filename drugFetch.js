const Pool = require('pg').Pool

const pool = new Pool({
  user: 'soragni',
  host: '10.47.35.47',
  database: 'sarcoma',
  password: 'J2DLrbroCf*6c%8q*@Gnr',
  port: 5432,
});

//get all drugs from our database
const getDrugs = async () => {
    try {
      return await new Promise(function (resolve, reject) {
        pool.query("SELECT DISTINCT figure_name FROM mapping_drug ORDER BY figure_name", (error, results) => {
          if (error) {
            reject(error);
          }
          if (results && results.rows) {
            resolve(results.rows);
          } else {
            reject(new Error("No results found"));
          }
        });
      });
    } catch (error_1) {
      console.error(error_1);
      throw new Error("Internal server error");
    }
  };

  module.exports = {
    getDrugs
  };