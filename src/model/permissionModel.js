import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema(
  {
    permission_name: {
      type: String,
      unique: true,
      required: true,
      index: true,
      trim : true,
    },
    permission_desc: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Permission", PermissionSchema);
