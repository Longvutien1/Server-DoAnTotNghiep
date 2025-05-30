import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const bookingSchema = new mongoose.Schema(
    {
        date: { type: String, required: true },
        fieldName: { type: String, required: true },
        address: { type: String, required: true },
        field:
        {
            type: String,
        },
        footballField: {
            type: ObjectId,
            ref: "FootballField"
        },
        user:{
            type: ObjectId,
            ref: "User"
        },
        timeStart: { type: String, required: true },
        price: { type: Number, required: true },
        payment_method: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        status: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
