const mongoose = require("mongoose");
require("dotenv").config();

const connect = async () => {
    return mongoose.connect(process.env.MONGODBURL)
    .catch((e)=>{
        console.log(e)
    })
}
module.exports = connect




// try {
//     mongoose.connect(process.env.MONGODBURL, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//       }, () =>
//       console.log("connected"));
//   } catch (error) {
//     console.log("could not connect");
//   }

// module.exports = connect