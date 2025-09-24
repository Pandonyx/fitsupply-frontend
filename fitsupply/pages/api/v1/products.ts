import type { NextApiRequest, NextApiResponse } from "next";
import PRODUCTS from "@/constants/mockapi";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, q } = req.query;
  if (slug) {
    const p = PRODUCTS.find((p) => p.slug === slug);
    if (p) return res.status(200).json(p);
    return res.status(404).json({ message: "Product not found" });
  }
  // basic search/filter
  return res.status(200).json(PRODUCTS);
}
