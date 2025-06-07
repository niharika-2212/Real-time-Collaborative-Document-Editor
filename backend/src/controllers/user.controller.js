import express from "express";
import User from "../models/user.model.js";

export const login = async (req, res) => {
  try {
    const { uid } = req.user;

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User found", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const signup = async (req, res) => {
  const { name } = req.body;
  const { uid, email } = req.user;
  try {
    let user = await User.findOne({ name });
    if (!user) {
      user = new User({ uid, email, name });
      await user.save();
    }
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
