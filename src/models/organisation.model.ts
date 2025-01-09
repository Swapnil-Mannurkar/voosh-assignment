import { Document, model, Schema } from "mongoose";
import { IOrganisationModel } from "../utils/types/admin";

type IOrganisationDoc = Document | IOrganisationModel;

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
