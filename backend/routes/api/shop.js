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

router.post("/", auth, upload.single("ItemImage"), async (req, res) => {
  // image configuration
  const ItemImage = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();

  const ItemName = req.body.ItemName;
  const ItemPrice = req.body.ItemPrice;
  const ItemDescription = req.body.ItemDescription;

  const newShop = new Shop({ ItemName, ItemPrice, ItemDescription, ItemImage });

  //Save Data into the mongo database

  newShop
    .save()
    .then(() => res.json("Item Added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//@route  DELETE api/shop
//@desc  Delete Item
//@access Private
//@author Senura

router.delete("/", auth, async (req, res) => {
  try {
    //Remove Workout
    await Shop.findOneAndRemove({ _id: req.body.id });

    res.json({ msg: "Item Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route         GET /shop
// @description   get Shop Items
// @access        Private
router.get("/", async (req, res) => {
  //convert image to base 64
  // const image = Buffer.from(req.user.avatar).toString("base64");
  // res.send({ user: req.user, avatar: image });
  //console.log(image);

  Shop.find()
    .then((items) => {
      res.json(items);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
