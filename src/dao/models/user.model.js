import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2';

const cartsCollection = 'carts1'

const cartSchema = new mongoose.Schema({
    products: [
      new mongoose.Schema(
        {
          productId: { 
            type:mongoose.Schema.Types.ObjectId, 
            required: true,
            ref:"products1" 
          },
          quantity: { type: Number, required: true },
        },
        { _id: false } 
      ),
    ],
  });
  

export const cartModel = mongoose.model (cartsCollection,cartSchema)


const productsCollection = 'products1'

const productSchema = new mongoose.Schema ({
    code : {type:String, unique:true, required:true},
    title: {type:String, required:true },
    description : {type:String, required:true },
    price: {type:Number, required:true },
    stock: {type:Number, required:true },
    category: {type:String, required:true },
    thumbnail: [],
    status: {type:Boolean, required:true}    
})

productSchema.plugin(mongoosePaginate); 

export const productModel = mongoose.model (productsCollection, productSchema)


const chatsCollection = 'messages1'

const chatSchema = new mongoose.Schema ({
    user : String,
   message : String
})

export const chatModel = mongoose.model (chatsCollection,chatSchema)
