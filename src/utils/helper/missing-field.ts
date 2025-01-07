export const checkUserMissingField = (email: string, password: string) => {
  return `Bad Request, Reason: Missing Field ${
    !email && !password
      ? "Email and Password"
      : email && !password
        ? "Password"
        : "Email"
  }`;
};

export const checkUserPasswordMissingField = (
  oldPassword: string,
  newPassword: string
) => {
  return `Bad Request, Reason: Missing Field ${
    !oldPassword && !newPassword
      ? "Old Password and New Password"
      : oldPassword && !newPassword
        ? "New Password"
        : "Old Password"
  }`;
};