// var express  = require('express');
// var router   = express.Router();
// //var Middleware = require('../../middleware/auth');


// // UploadModel= require('../../controllers/Api/v1/SellerUploadController');
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//       cb(null, './upload/');
//     },
//     filename: function(req, file, cb) {
//       cb(null, new Date().toISOString() + file.originalname);
//     }
//   });
  
//   const fileFilter = (req, file, cb) => {
//     // reject a file
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   };
  
//   const upload = multer({
//     storage: storage,
//     limits: {
//       fileSize: 1024 * 1024 * 5
//     },
//     fileFilter: fileFilter
//   });

//   const UploadModel= require("../../models/UploadModel");
//   router.get("/getAllProduct", (req, res, next) => {
//     UploadModel.find()
//       .select("Product_Photo Defect_Photo Select_Device Select_Brand Select_Model Select_Varient")
//       .exec()
//       .then(docs => {
//         const response = {
//           count: docs.length,
//           products: docs.map(doc => {
//             return {
//               Product_Photo: doc.Product_Photo,
//               Defect_Photo: doc.Defect_Photo,
//               Select_Device: doc.Select_Device,
//               Select_Brand: doc.Select_Brand,
//               Select_Model: doc.Select_Model,
//               Select_Varient: doc.Select_Varient,
//               request: {
//                 type: "GET",
//                 url: "https://api.soum.greychaindesign.com" + doc._id
//               }
//             };
//           })
//         };
//  //   if (docs.length >= 0) {
//   res.status(200).json(response);
//   //   } else {
//   //       res.status(400).json({
//   //           message: 'No entries found'
//   //       });
//   //   }
// })
// .catch(err => {
//   console.log(err);
//   res.status(500).json({
//     error: err
//   });
// });
// });
// router.post("/add", upload.multer('productImage'), (req, res, next) => {
//   const upload = new upload({
//     _id: new mongoose.Types.ObjectId(),
//               Product_Photo: doc.Product_Photo,
//               Defect_Photo: doc.Defect_Photo,
//               Select_Device: doc.Select_Device,
//               Select_Brand: doc.Select_Brand,
//               Select_Model: doc.Select_Model,
//               Select_Varient: doc.Select_Varient, 
//   });
//   upload
//     .save()
//     .then(result => {
//       console.log(result);
//       res.status(201).json({
//         message: "Created product successfully",
//         createdupload: {
//           Product_Photo: result.Product_Photo,
//           Defect_Photo: result.Defect_Photo,
//           Select_Device: result.Select_Device,
//           Select_Brand: result.Select_Brand,
//           Select_Model: result.Select_Model,
//           Select_Varient: result.Select_Varient,
//             request: {
//                 type: 'GET',
//                 url: "https://api.soum.greychaindesign.com" + result._id
//             }
//         }
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });
// router.get("/GetAllProduct", (req, res, next) => {
//   const id = req.params.result;
//   upload.findById(id)
//     .select('Product_Photo Defect_Photo Select_Device Select_Brand Select_Model Select_Varient')
//     .exec()
//     .then(doc => {
//       console.log("From database", doc);
//       if (doc) {
//         res.status(200).json({
//             product: doc,
//             request: {
//                 type: 'GET',
//                 url: "https://api.soum.greychaindesign.com"
//             }
//         });
//       } else {
//         res
//           .status(404)
//           .json({ message: "No valid entry found for provided ID" });
//       }
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({ error: err });
//     });
// });

// router.patch("/", (req, res, next) => {
//   const id = req.params.result;
//   const updateOps = {};
//   for (const ops of req.body) {
//     updateOps[ops.propName] = ops.value;
//   }
//   Product.update({ _id: id }, { $set: updateOps })
//     .exec()
//     .then(result => {
//       res.status(200).json({
//           message: 'Product updated',
//           request: {
//               type: 'GET',
//               url: "https://api.soum.greychaindesign.com" + id
//           }
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

// router.delete("/", (req, res, next) => {
//   const id = req.params.result;
//   Product.remove({ _id: id })
//     .exec()
//     .then(result => {
//       res.status(200).json({
//           message: 'Product deleted',
//           request: {
//               type: 'POST',
//               url: "https://api.soum.greychaindesign.com",
//               body: { Choose_Photo: 'String',Select_Varient: 'Number' }
//           }
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

// module.exports = router



