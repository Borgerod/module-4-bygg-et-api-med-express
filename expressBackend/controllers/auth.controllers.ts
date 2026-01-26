import express from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readJsonDB } from "../util";
import User from "../models/user.model";
import { config } from "../config/env.config";

async function login(email: string, password: string) {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  console.log(`Comparing password "${password}" with existing hash...`);
  const result = bcrypt.compareSync(password, user.password);
  console.log("Result:", result);

  if (!result) {
    res.status(401).json({ success: false, error: "Invalid credentials." });
    throw new Error("Invalid credentials.");
  }

  const accessToken = jwt.sign(
    {
      role: user.role,
      user: {
        id: user.id,
      },
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.accessExpiration,
    },
  ); // .env, miljøvarabeldefinisjonsfil

  const refreshToken = jwt.sign({}, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiration,
  }); // .env, miljøvarabeldefinisjonsfil

  return { success: true, accessToken, refreshToken };
}

function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

export { login, verifyToken };
