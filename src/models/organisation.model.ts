import { Document, model, Schema } from "mongoose";
import { IOrganisation } from "../utils/types/admin";

type IOrganisationDoc = IOrganisation | Document;

const OrganisationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Organisation = model<IOrganisationDoc>(
  "Organisation",
  OrganisationSchema
);
export default Organisation;
