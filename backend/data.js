import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      name: "Paul",
      email: "admin@1cloudsilo.com",
      password: bcrypt.hashSync("1234", 8),
      isAdmin: true,
    },
    {
      name: "Jacques",
      email: "dev@1cloudsilo.com",
      password: bcrypt.hashSync("1234", 8),
      isAdmin: false,
    },
  ],

  products: [
    {
      //SupplierProductId: "",
      name: "GRAVITAK PROMO SERIES VINYL",
      //supplier: "Maizey",
      category: "SIGNAGE SOLUTIONS",
      //subCategory: "GRAFITACK SELF-ADHESIVE VINYLS",
      image: "/images/productImages/GRAVITAK_PROMO_SERIES_VINYL.jpg",
      price: 1500,
      countInStock: 10,
      brand: "GRAVITAK",
      rating: 2.5,
      numReviews: 34,
      description:
        "The Grafitack Promo series vinyl is a soft cadmium-free monomeric calendered PVC film.",
      //doc: "/docs/Grafitack-Promo-Series-Matt-self-adhesive-films.pdf",
    },
    {
      //SupplierProductId: "",
      name: "AVERY SIGN MASK LIGHT BLUE",
      //supplier: "Maizey",
      category: "SIGNAGE SOLUTIONS",
      //subCategory: "AVERY SELF-ADHESIVE VINYLS",
      image: "/images/productImages/AVERY_SIGN_MASK_LIGHT_BLUE.jpg",
      price: 1700,
      countInStock: 20,
      brand: "AVERY",
      rating: 4,
      numReviews: 12,
      description: "Avery SignMask Light Blue is a self-adhesive masking tape",
      //doc: "/docs/Avery-Dennison-SignMask-Light-Blue.pdf",
    },
    {
      //SupplierProductId: "",
      name: "POLI-FLEX 4015 – WHITE",
      //supplier: "Maizey",
      category: "SIGNAGE SOLUTIONS",
      //subCategory: "HEAT TRANSFER FILMS",
      image: "/images/productImages/POLIFLEX_4015_WHITE.jpg",
      price: 1050,
      countInStock: 0,
      brand: "POLI-FLEX",
      rating: 4.5,
      numReviews: 9,
      description:
        "Poli-Flex 4015 White is a matt printable heat transfer film with a self-adhesive liner. .",
      //doc: "/docs/PoliFlex-4015-100mic-white-matt-front-print.pdf",
    },
    {
      //SupplierProductId: "",
      name: "Frontlit PVC",
      //supplier: "Maizey",
      category: "DIGITAL PRINT MEDIA",
      //subCategory: "FRONTLIT PVC",
      image: "/images/productImages/Frontlit_PVC.jpg",
      price: 950,
      countInStock: 17,
      brand: "DIGITAL PRINT MEDIA",
      rating: 5,
      numReviews: 2,
      description:
        "A pure white, frontlit PVC banner with a 440gr matt face for indoor and outdoor signage.",
      //doc: "/docs/MBFLES440-Frontlit-pvc-banner.pdf",
    },
    {
      //SupplierProductId: "",
      name: "Graphiwrap Vehicle Wrapping System",
      // supplier: "Maizey",
      category: "DIGITAL PRINT MEDIA",
      //subCategory: "VEHICLE WRAPPING",
      image: "/images/productImages/Graphiwrap_Vehicle_Wrapping_System.jpg",
      price: 3500,
      countInStock: 11,
      brand: "DIGITAL PRINT MEDIA",
      rating: 2,
      numReviews: 32,
      description:
        "GrafiWrap Vehicle Wrapping System is a registered trade name for a combination of materials used in the “wrapping” of a vehicle. ",
      //doc: "",
    },
    {
      //SupplierProductId: "",
      name: "Backlit PVC",
      //supplier: "Falconsa",
      category: "PRINT MEDIA",
      //subCategory: "BACKLIT PVC",
      image: "/images/productImages/Digiflex_Backlit_Pvc.jpg",
      price: 850,
      countInStock: 44,
      brand: "Digiflex",
      rating: 3,
      numReviews: 0,
      description:
        "A pure Black, backlit PVC banner with a 440gr matt face for indoor and outdoor signage.",
      //doc: "/docs/MBBLLEG-backlit-OCT-2010.pdf",
    },
    {
      //SupplierProductId: "",
      name: "INTERCOAT Wrapping System",
      //supplier: "Falconsa",
      category: "PRINT MEDIA",
      //subCategory: "WRAPPING",
      image: "/images/productImages/intercoatWrappinSystem.jpg",
      price: 3200,
      countInStock: 44,
      brand: "INTERCOAT",
      rating: 3,
      numReviews: 0,
      description:
        "Wrapping System is a registered trade name for a combination of materials used in the “wrapping” of a vehicle.",
      //doc: "",
    },
  ],
};

export default data;
