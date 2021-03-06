/* Goal is to have this model represent organizations */

const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  imgUrl: { type: String, required: true },
  geoLocation: { type: Object, required: true }
});

/* Date the organization was first on the platform*/
organizationSchema.set("timestamps", true);
organizationSchema.index({ name: 1, description: 1 }, { unique: true });
organizationSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, result) => {
    delete result.__v;
    delete result._id;
  }
});

module.exports = mongoose.model("Organization", organizationSchema);
