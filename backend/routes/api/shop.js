const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Shop = require("../../models/Shop");
const cors = require("cors");

//For Image Uploading
const multer = require("multer");
const sharp = require("sharp");

router.use(cors());

//@route  POST api/shop/
//@desc   Add Items into the database
//@access Private
//to protect auth add as the second parameter

router.post("/", auth, upload.single("ItemImage"), (req, res) => {
  //For Image Uploading(Getting image)
  const upload = multer({
    limits: {
      fileSize: 4000000,
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error("File is not supported"));
      }
      cb(undefined, true);
    },
  });

  const ItemName = req.body.ItemName;
  const ItemPrice = req.body.ItemPrice;
  const ItemDescription = req.body.ItemDescription;

  const newShop = new Shop({ ItemName, ItemPrice, ItemDescription });

  //Save Data into the mongo database

  newShop
    .save()
    .then(() => res.json("Item Added"))
    .catch((err) => res.