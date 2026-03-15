import { Schema, model } from "mongoose";

const funspotSchema = new Schema(
    {
        _template_Id: String,
        _account_Id: String,
        name: String,
        cover: String,
        description: String,
    
        context: String,
        examples: Array,
    
        summary: String,
        characters: Array,
    
        ml_model: String,
      },
      {
        timestamps: true,
        toJSON: { virtuals: true },
        collection: "funspots",
      }
    );
export default model("Funspot", funspotSchema);
