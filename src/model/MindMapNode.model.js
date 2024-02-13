const mongoose = require("mongoose");

const MindMapNodeschema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      require: true,
    },
    shape: {
      type: String,
      required: true,
    },
    leftChildren: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "MindMapNodes",
        required: true,
      },
    ],
    rightChildren: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "MindMapNodes",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

MindMapNodeschema.pre('find', function(next) {
  // if (this.options._recursed) {
  //   return next();
  // }
  this.populate({ path: 'leftChildren' });
  next();
});
MindMapNodeschema.pre('find', function(next) {
  // if (this.options._recursed) {
  //   return next();
  // }
  this.populate({ path: 'rightChildren' });
  next();
});

module.exports = mongoose.model("MindMapNodes", MindMapNodeschema);
