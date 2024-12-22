import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import MenuScript from "../model/menuScriptModel.js";
import User from "../model/userModel.js";

export const submitManuscript = async (req, res) => {
  try {
    const {
      author_first_name,
      author_last_name,
      author_email,
      author_alt_email,
      author_phone,
      author_region,
      menu_script_title,
      article_type,
      issued_type,
      special_issue_title,
      classification,
      suggest_classification,
      abstract,
      key_words,
      attachment,
    } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email: author_email });

    if (!user) {
      // Generate a secure password
      const password = crypto.randomBytes(8).toString("hex");
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      user = new User({
        user_name: `${author_first_name} ${author_last_name}`,
        email: author_email,
        password: hashedPassword,
      });

      await user.save();

      // Send email to the user
      const transporter = nodemailer.createTransport({
        service: "gmail", // Use your email service
        auth: {
          user: process.env.EMAIL, // Your email
          pass: process.env.EMAIL_PASSWORD, // Your email password
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: author_email,
        subject: "Account Created Successfully",
        text: `Your account has been created successfully. Your login credentials are:\n\nEmail: ${author_email}\nPassword: ${password}\n\nPlease change your password after logging in.`,
      };

      await transporter.sendMail(mailOptions);
    }

    // Create and save the manuscript
    const menuScript = new MenuScript({
      author_first_name,
      author_last_name,
      author_email,
      author_alt_email,
      author_phone,
      author_region,
      menu_script_title,
      article_type,
      issued_type,
      special_issue_title,
      classification,
      suggest_classification,
      abstract,
      key_words: key_words.split(",").map((kw) => kw.trim()), // Convert keywords to array
      attachment,
    });

    await menuScript.save();

    res.status(201).send({
      message: "Manuscript submitted successfully",
      menuScript,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error submitting manuscript" });
  }
};
