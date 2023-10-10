import jwt from "jsonwebtoken";
export const generateAccessToken = (
  id: number,
  username: string,
  email: string
) => {
  return jwt.sign(
    { id, username, email },
    process.env.ACCESS_TOKEN_SECRETKEY as string,
    { expiresIn: "30m" }
  );
};
