import mongoose from "mongoose"

const customerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ],

    cart: [
      {
        _id: false,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1
        }
      }
    ]
}, {timestamps: true})

const Customer = mongoose.model('Customer', customerSchema)

export default Customer