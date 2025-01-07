export const checkUserMissingField = (email: string, password: string) => {
  return `Bad Request, Reason: Missing Field ${
    !email && !password
      ? "Email and Password"
      : email && !password
        ? "Password"
        : "Email"
  }`;
};
