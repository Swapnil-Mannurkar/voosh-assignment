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

export const checkArtistsMissingField = (name: string, grammy: string) => {
  return `Bad Request, Reason: Missing Field ${
    !name && !grammy ? "Name and Grammy" : name && !grammy ? "Grammy" : "Name"
  }`;
};

export const checkAlbumMissingField = (name: string, year: number) => {
  return `Bad Request, Reason: Missing Field ${
    !name && !year ? "Name and Year" : name && !year ? "Year" : "Name"
  }`;
};

export const checkTrackMissingField = (name: string, duration: number) => {
  return `Bad Request, Reason: Missing Field ${
    !name && !duration
      ? "Name and Duration"
      : name && !duration
        ? "Duration"
        : "Name"
  }`;
};
