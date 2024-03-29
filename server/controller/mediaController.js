
const db = require("../conn/conn");
exports.City = async(req,res,err) => {
  try{
      db.changeUser({ database: "gohoardi_goh" });
      db.query("SELECT * FROM goh_cities", (err, result) => {
        if (err) {
          console.log(err);
        } else {
          return res.send(result);
        }
      });
  }catch(err){
      return res.status(500).json({err:message})  
  }
}
exports.Company = async(req,res,err) => {
  try{
      db.changeUser({ database: "odoads_tblcompanies" });
db.query(
  "SELECT name FROM tblcompanies WHERE name IS NOT NULL",
  (err, result) => {
    if (err) throw err;
    return res.send(result);
  }
);
  }catch(err){
      return res.status(500).json({err:message})  
  }
}

exports.Invertor = async(req,res,next) => {
  db.changeUser({ database: "gohoardi_goh" });
  (code = req.body.code),
    (city = req.body.city_name),
    (location = req.body.location),
    (category = req.body.category_name),
    (subcategory = req.body.subcategory),
    (illumination = req.body.illumination),
    (company = req.body.company);
  var table_name = "";
    let where = [];
  if (city) {
    where.push(' city_name = "' + city + '"');
  }
  if (location) {
    where.push(' location = "' + location + '"');
  }
  if (category) {
    switch (category) {
      case "traditional-ooh-media":
        table_name = "goh_media";
        break;
      case "digital-media":
        table_name = "goh_media_digital";
        break;
      case "transit-media":
        table_name = "goh_media_transit";
        break;
      case "mall-media":
        table_name = "goh_media_mall";
        break;
      case "airport-media":
        table_name = "goh_media_airport";
        break;
      case "inflight_media":
        table_name = "goh_media_inflight";
        break;
      case "office-media":
        table_name = "goh_media_office";
        break;
    }
  }

  if (subcategory) {
    where.push(' subcategory = "' + subcategory + '"');
  }
  if (illumination) {
    where.push(' illumination = "' + illumination + '"');
  }

  var sql = "SELECT * FROM " + table_name + "";

  if (city || location || subcategory || illumination) {
    sql += " WHERE";
  }

  const conditionstring = "" + where + "";
  var allconditions = conditionstring.replace(/,/g, " AND");

  const sqlquery = "" + sql + allconditions + "LIMIT 10";

  if (code || company) {
    if (code) {
      where.push('code = "' + code + '"');
    }
    if (company) {
      where.push('mediaownercompanyname = "' + company + '"');
    }
    let alldata =
      "code, city_name, location, subcategory, illumination, mediaownercompanyname, email, phonenumber, thumb, category_name,price";

    const newquery =
      "SELECT " +
      alldata +
      " FROM goh_media  WHERE " +
      where +
      " UNION SELECT " +
      alldata +
      " FROM goh_media_digital WHERE " +
      where +
      " UNION SELECT " +
      alldata +
      " FROM goh_media_transit WHERE " +
      where +
      "  UNION SELECT " +
      alldata +
      " FROM goh_media_mall WHERE " +
      where +
      "  UNION SELECT " +
      alldata +
      " FROM goh_media_airport WHERE " +
      where +
      " UNION SELECT " +
      alldata +
      " FROM goh_media_inflight WHERE " +
      where +
      " UNION SELECT " +
      alldata +
      " FROM goh_media_office WHERE " +
      where +
      " LIMIT 10";
    db.query(newquery, async (err, result) => {
      if (err) throw err;
      return res.json({ status: "success1", res: result });
    });
  } else {
    if (
      !city == "" ||
      !location == "" ||
      !category == "" ||
      !subcategory == "" ||
      !illumination == ""
    ) {
      db.query(sqlquery, (err, result) => {
        if (err) {
          return res.send({ status: "sqlerror", error: err });
        } else if (result.length < 0) {
          return res.send({ status: "error", error: "Media Not Found" });
        } else {
          return res.send(result);
        }
      });
    } else {
      res.json({ status: "error", error: "Media Not Found" });
    }
  }    
}


exports.SearchData = async (req,res,next) => {
  try{
  const {category_name, city_name} = req.body
  const promises = []
  db.changeUser({ database: "gohoardi_goh" });
  switch (category_name) {
          case "traditional-ooh-media":
            table_name = "goh_media";
            break;
          case "digital-media":
            table_name = "goh_media_digital";
            break;
          case "transit-media":
            table_name = "goh_media_transit";
            break;
          case "mall-media":
            table_name = "goh_media_mall";
            break;
          case "airport-media":
            table_name = "goh_media_airport";
            break;
          case "inflight_media":
            table_name = "goh_media_inflight";
            break;
          case "office-media":
            table_name = "goh_media_office";
            break;
            default:
            table_name = "goh_media";
        }
        promises.push(new Promise((resolve, reject) => {
        db.query("SELECT * FROM "+table_name+" WHERE city_name='"+city_name+"'",async (err,result) => {
          if (err) {
            return res.send({err: reject(err),message :"Wrong Data"})
        } else if (resolve == []){
            return res.send({resolve: "Empty",message :"Media Not Found"})
        } else{
        resolve(result)
        }
      })
    
    }))
  
try {
  const result = await Promise.allSettled(promises)
  let test = [];
  result.forEach(element => {
    element.value.forEach(obj => {
      test.push(obj);
    });
  });
  return res.send(test);
} catch (err) {
  return (err)
}} catch (err){
  res.status(404).json({
    messsage:err.res
  })
}

}
  
exports.company = async(req,res)=>{
    db.changeUser({ database: "odoads_tblcompanies" });
    db.query(
      "SELECT name FROM tblcompanies WHERE name IS NOT NULL",
      (err, result) => {
        if (err) throw err;
        return res.send(result);
      }
    );
  }