export interface IOrganisation {
  name: string;
}

export interface IAdminSignup {
  email: string;
  password: string;
  organisation: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
}
