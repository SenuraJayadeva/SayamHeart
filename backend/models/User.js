const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  //@author Dilmi

  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
module.exports = User = mongoose.model("user", UserSchema);
