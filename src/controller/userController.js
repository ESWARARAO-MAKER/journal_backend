import User from "../model/userModel.js";
import Role from "../model/roleModel.js";
import Permission from "../model/permissionModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { user_name, email, password, role_name = "PUBLIC" } = req.body;

  if (!user_name || !email || !password) {
    return res
      .status(400)
      .send({ message: "Missing fileds user_name, email or password" });
  }
  try {
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).send({ message: "User already present" });
    }

    let role = await Role.findOne({ role_name });

    if (!role) {
      role = new Role({
        role_name: role_name.toUpperCase(),
      });

      await role.save();
      console.log(`${role_name} role is created`);
    }

    const newUser = new User({
      user_name,
      email,
      password,
      role: role._id,
    });

    await newUser.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Missing fields: email or password" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({ message: "username or password wrong" });
    }

    const payload = {
      id: user._id,
      roles: user.role.map((role) => role.role_name),
    };

    const token = jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true }).send({ token });
  } catch (err) {
    console.log(err);
  }
};

export const createRole = async (req, res) => {
  const { role_name } = req.body;

  if (!role_name) {
    return res.status(400).send({ message: "Role name is required" });
  }

  try {
    const existedRole = await Role.findOne({ role_name });
    if (existedRole) {
      return res
        .status(400)
        .send({ message: `Role ${role_name} already exists` });
    }
    const newRole = new Role({
      role_name: role_name.toUpperCase(),
    });

    await newRole.save();
    res.status(201).send({ message: "Role created successfully" });
  } catch (err) {
    console.log(err);
  }
};

export const createPermission = async (req, res) => {
  const { permission_name, permission_desc } = req.body;

  if (!permission_desc || !permission_name) {
    return res
      .status(400)
      .send({ message: "Permission name and description are required" });
  }

  try {
    const existedPermission = await Permission.findOne({ permission_name });

    if (existedPermission) {
      return res.status(400).send({ message: "Permission already exists" });
    }

    const newPermission = new Permission({
      permission_desc,
      permission_name : permission_name.toUpperCase(),
    });

    await newPermission.save();
    res.status(201).send({ message: "Permission created successfully" });
  } catch (err) {
    console.log(err);
  }
};

export const assignPermissionToRole = async (req, res) => {
  const { role_name, permission_name } = req.body;

  if (!role_name || !permission_name) {
    return res
      .status(400)
      .send({ message: "Role and Permission are required" });
  }

  try {
    const role = await Role.findOne({ role_name: role_name.toUpperCase() });
    if (!role) {
      return res.status(404).send({ message: `Role ${role_name} not found` });
    }

    const permission = await Permission.findOne({ permission_name : permission_name.toUpperCase() });
    if (!permission) {
      return res
        .status(404)
        .send({ message: `Permission ${permission_name} not found` });
    }

    const permission_id = permission._id;

    // Ensure `permissions` is an array and does not include duplicates
    if (!Array.isArray(role.permissions)) {
      role.permissions = [];
    }

    if (!role.permissions.includes(permission_id)) {
      role.permissions.push(permission_id); // Add the permission ID
    }
    await role.save();
    res.status(200).send({
      message: `Permission ${permission_name} is assigned to the Role ${role_name} successfully`,
    });
  } catch (err) {
    console.log(err);
  }
};

export const assingRoleToUser = async (req, res) => {
  const { email, role_name } = req.body;

  if (!email || !role_name) {
    return res
      .status(400)
      .send({ message: "Email and Role name are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    const role = await Role.findOne({ role_name: role_name.toUpperCase() });
    if (!role) {
      return res.status(400).send({ message: "Role is not found" });
    }

    const role_id = role._id;
    // Ensure user.role is an array and does not contain duplicates
    if (!Array.isArray(user.role)) {
      user.role = []; // Initialize as an empty array if not already
    }

    if (!user.role.includes(role_id)) {
      user.role.push(role_id); // Add the new role ID
    }
    await user.save();
    res.status(200).send({ message: "Role is assigned to the user" });
  } catch (err) {
    console.log(err);
  }
};
