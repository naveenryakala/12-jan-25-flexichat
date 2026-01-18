import mongoose from "mongoose";

const clientSessionSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    loggedOutAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ClientSession", clientSessionSchema);
