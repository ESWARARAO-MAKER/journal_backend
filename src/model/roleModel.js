import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    role_name: { type: String, required: true, unique: true, index: true, trim : true },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Role", RoleSchema);

// UserSchema.pre('find', function(){
//     this.populate('role', 'role_name')
// })