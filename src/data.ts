/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem } from './types';

// Import newly generated high-quality local assets
import bbqChestPiece from './assets/images/bbq_chest_piece_1780764417340.png';
import bbqLegPiece from './assets/images/bbq_leg_piece_1780764456291.png';
import bbqChestPieceNew from './assets/images/kitchen_chest_piece_1780765351868.png';
import parathaRollNew from './assets/images/paratha_roll_1780765368268.png';
import nicePicnicPiece from './assets/images/nice_picnic_piece_1780765386364.png';
import chickenParathaRollNew from './assets/images/chicken_paratha_roll_1780765401756.png';
import zingerBurger from './assets/images/zinger_burger_1780764489847.png';
import andaShamiBurger from './assets/images/anda_shami_burger_1780764508183.png';
import shawarma from './assets/images/shawarma_1780764522917.png';
import tandooriNaan from './assets/images/tandoori_naan_1780764540132.png';

export const LOCAL_IMAGES = {
  bbqChestPiece,
  bbqLegPiece,
  bbqChestPieceNew,
  parathaRollNew,
  nicePicnicPiece,
  chickenParathaRollNew,
  zingerBurger,
  andaShamiBurger,
  shawarma,
  tandooriNaan
};

/**
 * Returns a high-quality local generated image based on the item's name.
 * Provides fallback in case of missing, broken, or blocked hosted image URLs.
 */
export function getLocalImageForDish(name: string): string {
  const norm = (name || '').toLowerCase();
  
  if (norm.includes('kitchen') || norm.includes('chest') || norm.includes('breast')) {
    return bbqChestPieceNew;
  }
  if (norm.includes('picnic')) {
    return nicePicnicPiece;
  }
  if (norm.includes('chicken paratha') || norm.includes('chicken roll') || (norm.includes('chicken') && norm.includes('roll'))) {
    return chickenParathaRollNew;
  }
  if (norm.includes('roll') || norm.includes('paratha')) {
    return parathaRollNew;
  }
  if (norm.includes('leg') || norm.includes('neck') || norm.includes('chicken') && norm.includes('piece')) {
    return bbqLegPiece;
  }
  if (norm.includes('zinger') && norm.includes('burger')) {
    return zingerBurger;
  }
  if (norm.includes('shami') || norm.includes('anda') || norm.includes('simple burger')) {
    return andaShamiBurger;
  }
  if (norm.includes('burger')) {
    return zingerBurger;
  }
  if (norm.includes('shawarma')) {
    return shawarma;
  }
  if (norm.includes('naan') || norm.includes('bread') || norm.includes('roti')) {
    return tandooriNaan;
  }

  // General catch-all BBQ fallbacks
  if (norm.includes('bbq') || norm.includes('grilled') || norm.includes('tikka') || norm.includes('boti')) {
    return bbqChestPieceNew;
  }
  
  return bbqChestPieceNew;
}

export const INITIAL_MENU_ITEMS: Omit<MenuItem, 'id'>[] = [
  // Chicken Items
  {
    name: 'Kitchen Chest Piece',
    category: 'chicken',
    price: 380,
    description: 'Juicy, traditional charcoal-grilled BBQ chicken chest piece marinated in spicy native herbs.',
    stock: 25,
    imageUrl: bbqChestPieceNew,
    isAvailable: true,
  },
  {
    name: 'Nice Picnic Piece',
    category: 'chicken',
    price: 350,
    description: 'Vividly beautiful, rustic oven-cooked BBQ chicken piece with authentic red tandoori spices, perfect for outdoors.',
    stock: 20,
    imageUrl: nicePicnicPiece,
    isAvailable: true,
  },
  {
    name: 'Leg Piece',
    category: 'chicken',
    price: 320,
    description: 'Crispy and succulent barbecued chicken leg piece roasted over charcoal with red hot pepper glaze.',
    stock: 30,
    imageUrl: bbqLegPiece,
    isAvailable: true,
  },
  {
    name: 'Neck Piece',
    category: 'chicken',
    price: 180,
    description: 'Deep-marinated grilled neck pieces cooked with signature aromatic spices and lemon seasoning.',
    stock: 15,
    imageUrl: bbqLegPiece,
    isAvailable: true,
  },

  // Rolls
  {
    name: 'Paratha Roll',
    category: 'rolls',
    price: 180,
    description: 'Traditional golden fried flour flatbread wrapped around smoky boti with refreshing mint chutney.',
    stock: 45,
    imageUrl: parathaRollNew,
    isAvailable: true,
  },
  {
    name: 'Zinger Paratha Roll',
    category: 'rolls',
    price: 280,
    description: 'Vibrant and crunchy golden-fried chicken strip wrapped in a hot flaky paratha with garlic mayo.',
    stock: 40,
    imageUrl: parathaRollNew,
    isAvailable: true,
  },
  {
    name: 'Chicken Paratha Roll',
    category: 'rolls',
    price: 240,
    description: 'Tender spiced chicken chunks skewered and rolled in flatbread with onions and savory dressing.',
    stock: 35,
    imageUrl: chickenParathaRollNew,
    isAvailable: true,
  },

  // Burgers
  {
    name: 'Zinger Burger',
    category: 'burgers',
    price: 350,
    description: 'Extra-crispy battered chicken breast filet piled high with shredded lettuce and creamy mayonnaise on a toasted bun.',
    stock: 50,
    imageUrl: zingerBurger,
    isAvailable: true,
  },
  {
    name: 'Anda Shami Burger',
    category: 'burgers',
    price: 150,
    description: 'The ultimate pakistani street classic. Lentil-beef kebab patty fried with an egg coat, topped with onions and tangy chutneys.',
    stock: 60,
    imageUrl: andaShamiBurger,
    isAvailable: true,
  },
  {
    name: 'Chicken Burger',
    category: 'burgers',
    price: 250,
    description: 'A savory grilled chicken patty topped with caramelized onions, cheddar cheese, and signature dressing.',
    stock: 35,
    imageUrl: zingerBurger,
    isAvailable: true,
  },
  {
    name: 'Simple Burger',
    category: 'burgers',
    price: 180,
    description: 'A humble but delicious potato or beef patty topped with cucumbers and mild tangy red sauce.',
    stock: 20,
    imageUrl: andaShamiBurger,
    isAvailable: true,
  },

  // Shawarma
  {
    name: 'Shawarma',
    category: 'shawarma',
    price: 160,
    description: 'Shaved chicken meat cooked on a vertical rotisserie, wrapped in pita bread with pickled vegetables and spicy tahini.',
    stock: 55,
    imageUrl: shawarma,
    isAvailable: true,
  },
  {
    name: 'Zinger Shawarma',
    category: 'shawarma',
    price: 220,
    description: 'Golden-fried crispy Zinger strips chopped and stuffed inside soft pita bread with local hot mayo sauces.',
    stock: 45,
    imageUrl: shawarma,
    isAvailable: true,
  },

  // Bread
  {
    name: 'Naan',
    category: 'bread',
    price: 40,
    description: 'Soft oven-baked leavened flatbread sprinkled with sesame seeds, brushed with warm melted butter.',
    stock: 120,
    imageUrl: tandooriNaan,
    isAvailable: true,
  }
];
