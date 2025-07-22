import { api } from "@/utils/auth/authorApi";

export async function getPaymentSummary() {
  try {
    const res = await api.get("/author/earnings/summary");
    console.log("getPaymentSummary:", res.data);
    return res.data;
  } catch (error) {
    console.log("getPaymentSummary error:", error);
    return null; 
  }
}

export async function getRecentSales() {
  try {
    const res = await api.get("/author/earnings/recent_sales");
    return res.data.recent_sales || [];
  } catch (error) {
    console.error("getRecentSales error:", error);
    return [];
  }
}
