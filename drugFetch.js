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
            const formattedData = results.rows.map((row, index) => {
              return row.figure_name
            });
            resolve(formattedData);
          } else {
            reject(new Error("No results found"));
          }
        });
      });
    } catch (error_1) {
      console.error(error_1);
      throw new Error("Error occurred while serving this request: " + error_1);
    }
  };

  // getting complete drug data along with corresponding activity data
  const getDrugData = async() => {
    try {
      return await new Promise(function (resolve, reject) {
        pool.query("select d.cid as cid, d.drug_name as drug_name, d.figure_name as figure_name, d.trial_status as trial_status, d.approved_by_fda as approved_by_fda,\
        d.mssr_name as mssr_name, d.trial_name as trial_name, d.drug_location as drug_location, a.activity_type as activity_type, a.activity_value, a.id as activity_id,\
        a.aid as aid, a.pubmed_id as pubmed_id, g.geneid as geneid, g.gene_name as gene_name, g.gene_symbol as gene_symbol\
        from mapping_drug d left join mapping_activity a on d.cid = a.cid_id left join mapping_gene g on a.target_geneid = g.geneid\
        where a.activity_type is not null and a.activity_value is not null and g.geneid is not null\
        order by d.cid;", (err, results) => {
          if (err) {
            reject(err);
          }
          if (results && results.rows) {
            resolve(results.rows);
          } else {
            reject(new Error("No results found!"));
          }
        });
      });
    } catch (error) {
      console.log(error);
      throw new Error("Error occurred while serving this request: " + error);
    }
  }

  // getting viability and mapping data
  const getViabilityAndMappingData = async() => {
    try {
      return await new Promise(function (resolve, reject) {
        pool.query("select * from mapping_viability v left join mapping_sample s on v.sample_id = s.id\
        left join mapping_map m on v.id = m.viability_id\
        left join mapping_patient p on s.patient_id = p.id\
        left join mapping_diagnosis d on p.diagnosis_id = d.id\
        order by v.creation_date desc;", (err, results) => {
          if (err) {
            reject(err);
          }
          if (results && results.rows) {
            const formattedData = results.rows.map((row, index) => {
              const well_viabilities = [];
              for (let i = 1; i <= 96; i++) {
                well_viabilities.push({ [`well_${i}`]: row[`well_${i}`] });
              }

              const well_errors = [];
              for (let i = 1; i <= 96; i++) {
                well_errors.push({ [`well_${i}`]: row[`well_${i}_error`] })
              }

              const well_drug_combos = [];
              for (let i = 1; i<= 96; i++) {
                well_drug_combos.push({
                  [`well_${i}_d1c`]: row[`well_${i}_drug_1_conc`],
                  [`well_${i}_d2c`]: row[`well_${i}_drug_2_conc`],
                  [`well_${i}_d3c`]: row[`well_${i}_drug_3_conc`],
                  [`well_${i}_d4c`]: row[`well_${i}_drug_4_conc`],
                  [`well_${i}_d1id`]: row[`well_${i}_drug_1_id`],
                  [`well_${i}_d2id`]: row[`well_${i}_drug_2_id`],
                  [`well_${i}_d3id`]: row[`well_${i}_drug_3_id`],
                  [`well_${i}_d4id`]: row[`well_${i}_drug_4_id`]
                })
              }
        
              return {
                local_record_id: index + 1,
                viability_id: row.viability_id,
                viability_name: row.viability_name,
                viability_creation_date: row.creation_date,
                sample_id: row.sample_id,
                collection_date: row.collection_date,
                experiment_date: row.experiment_date,
                experiment_type: row.experiment_type,
                tissue_type: row.tissue_type,
                tissue_of_origin: row.tissue_of_origin,
                procurement_type: row.procurement_type,
                preservation: row.preservation,
                location_information: row.location_information,
                specimen_lab_name: row.specimen_lab_name,
                collection_id: row.collection_id,
                patient_id: row.patient_id,
                screen: row.screen,
                note: row.note,
                map_name: row.map_name,
                age_at_diagnosis: row.age_at_diagnosis,
                metastatic_status: row.metastatic_status,
                has_Y_chromosome: row.has_Y_chromosome,
                diagnosis_id: row.diagnosis_id,
                diagnosis: row.diagnosis,
                icd_code: row.icd_code,
                well_viabilities: well_viabilities,
                well_errors: well_errors,
                well_drug_combos: well_drug_combos
              };
            });
            //console.log(JSON.stringify(formattedData));
            resolve(formattedData);
          } else {
            reject(new Error("No results found!"));
          }
        });
      });
    } catch (error) {
      console.log(error);
      throw new Error("Error occurred while serving this request: " + error);
    }
  }

  module.exports = {
    getDrugs,
    getDrugData,
    getViabilityAndMappingData
  };