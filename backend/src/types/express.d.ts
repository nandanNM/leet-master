declare global {
  namespace Express {
    interface Request {
      user?: any; // You can replace `any` with a specific type for the user object
    }
  }
}

export {};
