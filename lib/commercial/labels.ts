import type { LeadCommercialType, LeadSalesStatus, WalletTransactionType } from "@/types/database";

export function formatCredits(amount: number) {
  return `${amount} credits`;
}

export function getWalletTransactionLabel(type: WalletTransactionType) {
  return {
    credit_purchase: "Credit aankoop",
    lead_purchase: "Lead aankoop",
    refund: "Refund",
    admin_credit: "Admin credit",
    admin_debit: "Admin afboeking",
    promotional_credit: "Promotionele credit",
    correction: "Correctie",
  }[type];
}

export function getCommercialTypeLabel(type: LeadCommercialType) {
  return type === "exclusive" ? "Exclusief" : "Shared";
}

export function getSalesStatusLabel(status: LeadSalesStatus) {
  return {
    unavailable: "Niet beschikbaar",
    available: "Beschikbaar",
    partially_sold: "Deels verkocht",
    sold_out: "Uitverkocht",
    closed: "Gesloten",
  }[status];
}
