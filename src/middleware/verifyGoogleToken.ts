import { Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";
import type { GoogleLoginRequest } from "../types/googleAuth";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (
  req: GoogleLoginRequest,
  res: Response,
  next: NextFunction,
) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({
      alert: { title: "Error", message: "No Google token provided" },
    });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error("Invalid payload from Google");
    }

    req.googleProfile = {
      email: payload.email,
      name: payload.name || "User",
      googleId: payload.sub,
    };

    next();
  } catch (err) {
    console.error("Middleware Auth Error:", err);
    res.status(401).json({
      alert: { title: "Auth Failed", message: "Google verification failed" },
    });
  }
};
