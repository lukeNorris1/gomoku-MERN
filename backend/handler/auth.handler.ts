import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import validateSchema from "../middlewares/validateSchema";
import { createUser, getUserByUsername } from "../service/auth.service";
import {
  LoginInput,
  RegisterInput,
  registerSchema,
} from "../schema/auth.schema";

const authHandler = express.Router();

authHandler.post(
  "/register",
  validateSchema(registerSchema),
  async (req: Request<{}, {}, RegisterInput["body"]>, res: Response) => {
    try {
      const { username, password } = req.body;

      // check if user already exist
      // Validate if user exist in our database
      const existingUser = await getUserByUsername(username);

      if (existingUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }

      //Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Create user in our database
      const newUser = await createUser({
        username,
        password: encryptedPassword,
      });

      // return new user with token
      res.status(200).json({ _id: newUser._id });

    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  }
);

authHandler.post(
  "/login",
  async (req: Request<{}, {}, LoginInput["body"]>, res: Response) => {
    try {
      // Get user input
      const { username, password } = req.body;

      // Validate if user exist in our database
      const user = await getUserByUsername(username);

      if (user && (await bcrypt.compare(password, user.password))) {
        return res.status(200).json({ _id: user._id});
      }
      return res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(`error: ${err}`);
      return res.status(500).send(err);
    }
  }
);

export default authHandler;
