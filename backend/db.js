const sql = require("mssql");

const dbconfig = {
  "user": "ncsdatabase",
  "password": "Nk43kOn?_wEV",
  "server": "den1.mssql4.gear.host",
  "database": "ncsdatabase",
  "pool": {
    "max": 10,
    "min": 0,
    "idleTimeoutMillis": 30000
  }
}

let _pool;

async function getPool() {
  try {
    if (_pool) {
      return _pool;
    }

    _pool = await sql.connect(dbconfig);
    return _pool;
  } catch (err) {
    console.log(err);
  }
}

sql.on("error", function(err) {
  console.log("sql encountered an error, more details: " + err);
});

module.exports = {
  getPool
}
