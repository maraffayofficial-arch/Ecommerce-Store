import mongoose from "mongoose"
import dotenv from "dotenv"
import productModel from "./model/product.js"
import userModel from "./model/user.js"
import bcrypt from "bcryptjs"

dotenv.config()

const products = [
  {
    title: "Aam ka Achar",
    discription: "A classic Pakistani raw mango pickle bursting with bold spices — mustard seeds, fennel, nigella, and chili. Made the traditional way in pure mustard oil. Perfect with paratha or daal.",
    price: 350,
    weight: "500g",
    category: "achar",
    image: "https://images.unsplash.com/photo-1626203219-786e65af5f69?w=600&auto=format&fit=crop"
  },
  {
    title: "Mirch ka Achar",
    discription: "Whole green chili pickle stuffed with a tangy masala mix of cumin, dry coriander, and amchur. A fiery favourite for spice lovers. Aged in mustard oil for an intense flavour.",
    price: 280,
    weight: "400g",
    category: "achar",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop"
  },
  {
    title: "Mixed Vegetable Achar",
    discription: "A colourful medley of carrots, turnips, cauliflower, and green chilies pickled in a rich spiced oil. Full of crunch and flavour — a perfect companion for every meal.",
    price: 320,
    weight: "600g",
    category: "achar",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop"
  },
  {
    title: "Lemon Achar",
    discription: "Sun-dried lemon wedges preserved with salt, turmeric, and whole spices. Tangy, aromatic and preservative-free. Great for digestion and pairs beautifully with biryani.",
    price: 250,
    weight: "400g",
    category: "achar",
    image: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=600&auto=format&fit=crop"
  },
  {
    title: "Lahsun ka Achar",
    discription: "Whole garlic cloves marinated in a bold blend of spices and mustard oil. Rich, pungent and deeply flavoured. A staple on every Pakistani dining table.",
    price: 300,
    weight: "350g",
    category: "achar",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop"
  },
  {
    title: "Pudina Chatni",
    discription: "Fresh mint blended with green chili, yogurt, lemon juice and a hint of chaat masala. Light, cooling and absolutely irresistible as a dip or spread.",
    price: 180,
    weight: "250g",
    category: "chatni",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop"
  },
  {
    title: "Imli Chatni",
    discription: "A sweet and tangy tamarind chutney slow-cooked with jaggery, cumin and dried ginger. The perfect companion for samosas, pakoras and chaat.",
    price: 200,
    weight: "300g",
    category: "chatni",
    image: "https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=600&auto=format&fit=crop"
  },
  {
    title: "Garlic Chili Sauce",
    discription: "A bold, smoky hot sauce made with roasted red chilies, garlic and vinegar. Add it to anything — burgers, rolls, rice. Warning: highly addictive!",
    price: 220,
    weight: "300ml",
    category: "sauce",
    image: "https://images.unsplash.com/photo-1608500218890-c4f9cae0c9a9?w=600&auto=format&fit=crop"
  },
  {
    title: "Gajar Shalgam Achar",
    discription: "A winter favourite — juicy carrots and turnips pickled in mustard oil with a tangy masala. Crunchy, flavourful and absolutely addictive with any meal.",
    price: 290,
    weight: "600g",
    category: "achar",
    image: "https://images.unsplash.com/photo-1552189434-be4da2aa4c08?w=600&auto=format&fit=crop"
  },
  {
    title: "Keri Chatni",
    discription: "Raw mango blended with fresh coriander, green chili and spices. Tangy, spicy and absolutely fresh — perfect with fried snacks and BBQ.",
    price: 160,
    weight: "250g",
    category: "chatni",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop"
  },
  {
    title: "Adrak Lehsun Chatni",
    discription: "A warming blend of ginger and garlic with roasted spices. Deep, aromatic and perfect as a base for cooking or a dipping sauce for pakoras.",
    price: 190,
    weight: "300g",
    category: "chatni",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop"
  },
  {
    title: "Zeera Powder",
    discription: "Sun-dried cumin seeds slow-roasted and coarsely ground for maximum aroma. Sourced from the finest farms in Pakistan. Essential for every kitchen.",
    price: 150,
    weight: "200g",
    category: "spices",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop"
  },
  {
    title: "Garam Masala Blend",
    discription: "A rich, fragrant blend of over 12 whole spices including cloves, cardamom, cinnamon and black pepper. Hand-ground in small batches for the freshest flavour.",
    price: 200,
    weight: "150g",
    category: "spices",
    image: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=600&auto=format&fit=crop"
  },
  {
    title: "Dhaniya Powder",
    discription: "Freshly ground coriander seeds with a warm, citrusy aroma. Adds depth and earthiness to every dish. A staple of Pakistani cooking.",
    price: 130,
    weight: "200g",
    category: "spices",
    image: "https://images.unsplash.com/photo-1506368083636-6defb67639b0?w=600&auto=format&fit=crop"
  },
  {
    title: "Mango Murabba",
    discription: "Soft, syrup-soaked raw mango pieces cooked with sugar, cardamom and saffron. A traditional sweet preserve enjoyed as dessert or a breakfast treat.",
    price: 380,
    weight: "500g",
    category: "sweet",
    image: "https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=600&auto=format&fit=crop"
  },
  {
    title: "Amla Murabba",
    discription: "Indian gooseberry preserved in a spiced sugar syrup. Rich in Vitamin C, tangy-sweet in flavour, and a beloved health tonic in Pakistani households.",
    price: 350,
    weight: "500g",
    category: "sweet",
    image: "https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=600&auto=format&fit=crop"
  },
  {
    title: "Tomato Ketchup Desi Style",
    discription: "Slow-cooked tomatoes with desi spices, a hint of tamarind, and natural sweetness. Much bolder and more flavourful than store-bought ketchup.",
    price: 240,
    weight: "350ml",
    category: "sauce",
    image: "https://images.unsplash.com/photo-1608500218890-c4f9cae0c9a9?w=600&auto=format&fit=crop"
  }
]

const seedAdmin = {
  name: "Admin",
  email: "admin@urbanpickle.com",
  password: "admin123",
  role: "admin"
}

const seed = async () => {
  try {
    await mongoose.connect(process.env.DB_URI)
    console.log("Connected to DB")

    await productModel.deleteMany()
    await productModel.insertMany(products)
    console.log(`${products.length} products seeded`)

    const existing = await userModel.findOne({ email: seedAdmin.email })
    if (!existing) {
      const hashed = await bcrypt.hash(seedAdmin.password, 10)
      await userModel.create({ ...seedAdmin, password: hashed })
      console.log("Admin user created — email: admin@urbanpickle.com | password: admin123")
    } else {
      console.log("Admin already exists, skipping")
    }

    console.log("Seeding complete!")
    process.exit(0)
  } catch (err) {
    console.error("Seed error:", err)
    process.exit(1)
  }
}

seed()
