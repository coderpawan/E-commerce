import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set JWT as an HTTP-Only Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 48,
    sameSite: "none",
    domain: ".vercel.app"
  });

  return token;
};

export default generateToken;
