import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    user_name: { type: String, index: true },
    email: { type: String, required: true, index: true },
    password: { type: String, required: true },
    role: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Role", default: "public" },
    ],
  },
  {
    timestamps: true, //adds createdat and updatedat
  }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export default mongoose.model("User", UserSchema);
