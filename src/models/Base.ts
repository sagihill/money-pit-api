const BaseEntitySchema = {
  deleted: { type: Boolean, index: true, required: true },
  createdAt: { type: Date, index: true, required: true },
  updatedAt: { type: Date, index: true, required: true },
};

export default BaseEntitySchema;
