import express from "express";

interface User {
  username: string;
  email: string;
}
interface UserLogin extends User {
  password: string;
}
interface UserInfo extends User {
  id: number;
  token?: string;
}

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
