export type AppRole = "admin" | "professional";
export type ProfessionalStatus = "pending" | "active" | "paused" | "suspended";
export type ProfessionalVerificationStatus = "unverified" | "pending" | "verified" | "rejected";
export type LeadStatus =
  | "new"
  | "qualified"
  | "matched"
  | "assigned"
  | "accepted"
  | "rejected"
  | "won"
  | "lost"
  | "closed";
export type LeadProgressStatus = "new" | "contacted" | "appointment_scheduled" | "quote_sent" | "won" | "lost";
export type LeadActivityType =
  | "lead_created"
  | "lead_score_calculated"
  | "lead_matches_refreshed"
  | "lead_assigned"
  | "assignment_viewed"
  | "assignment_accepted"
  | "assignment_rejected"
  | "progress_updated"
  | "loss_reason_recorded"
  | "distribution_started"
  | "candidate_offered"
  | "candidate_skipped"
  | "candidate_declined"
  | "candidate_expired"
  | "distribution_exhausted"
  | "distribution_admin_override";
export type LeadUrgency = "normal" | "urgent";
export type LeadPreferredTiming = "asap" | "few_weeks" | "one_to_three_months" | "later" | "unknown";
export type LeadAssignmentStatus = "pending" | "viewed" | "accepted" | "rejected";
export type LeadCommercialType = "shared" | "exclusive";
export type LeadSalesStatus = "unavailable" | "available" | "partially_sold" | "sold_out" | "closed";
export type LeadPurchaseStatus = "purchased" | "refunded" | "cancelled";
export type LeadDistributionRunStatus = "pending" | "active" | "completed" | "cancelled" | "exhausted";
export type LeadDistributionCandidateStatus = "queued" | "offered" | "viewed" | "declined" | "expired" | "purchased" | "skipped";
export type WalletTransactionType =
  | "credit_purchase"
  | "lead_purchase"
  | "refund"
  | "admin_credit"
  | "admin_debit"
  | "promotional_credit"
  | "correction";
export type ServiceQuestionType = "text" | "textarea" | "select" | "multiselect" | "radio" | "boolean" | "number";
export type ContactSubmissionStatus = "new" | "read" | "handled" | "spam";
export type SeoContentStatus = "draft" | "review" | "approved" | "published";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Professional {
  id: string;
  auth_user_id: string | null;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  kvk_number: string | null;
  website: string | null;
  description: string | null;
  status: ProfessionalStatus;
  verification_status: ProfessionalVerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  public_reference: string;
  service_id: string;
  subservice_slug: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  postal_code: string;
  house_number: string;
  house_number_addition: string | null;
  city: string | null;
  description: string;
  urgency: LeadUrgency;
  preferred_timing: LeadPreferredTiming | null;
  lead_score: number | null;
  score_reasons: Json | null;
  status: LeadStatus;
  commercial_type: LeadCommercialType;
  price_credits: number | null;
  max_buyers: number;
  buyers_count: number;
  sales_status: LeadSalesStatus;
  locked_at: string | null;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  landing_page: string | null;
  referrer: string | null;
  gclid: string | null;
  fbclid: string | null;
  first_touch_source: string | null;
  first_touch_timestamp: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceQuestion {
  id: string;
  service_id: string;
  question: string;
  slug: string;
  type: ServiceQuestionType;
  help_text: string | null;
  required: boolean;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceQuestionOption {
  id: string;
  question_id: string;
  label: string;
  value: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface LeadAnswer {
  id: string;
  lead_id: string;
  question_id: string;
  answer_text: string | null;
  answer_number: number | null;
  answer_boolean: boolean | null;
  answer_json: Json | null;
  created_at: string;
}

export interface LeadMatch {
  id: string;
  lead_id: string;
  professional_id: string;
  match_score: number;
  reasons: Json | null;
  created_at: string;
}

export interface LeadImage {
  id: string;
  lead_id: string;
  storage_path: string;
  mime_type: string | null;
  file_size: number | null;
  created_at: string;
}

export interface LeadAssignment {
  id: string;
  lead_id: string;
  professional_id: string;
  lead_purchase_id: string | null;
  status: LeadAssignmentStatus;
  progress_status: LeadProgressStatus;
  loss_reason: string | null;
  assigned_at: string;
  viewed_at: string | null;
  accepted_at: string | null;
  rejected_at: string | null;
  progress_updated_at: string | null;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_name: string;
  anonymous_session_id: string;
  lead_id: string | null;
  service_id: string | null;
  metadata: Json | null;
  created_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  professional_id: string | null;
  actor_user_id: string | null;
  activity_type: LeadActivityType;
  from_status: LeadProgressStatus | null;
  to_status: LeadProgressStatus | null;
  metadata: Json | null;
  created_at: string;
}

export interface ProfessionalWallet {
  id: string;
  professional_id: string;
  cached_balance: number;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  professional_id: string;
  type: WalletTransactionType;
  amount: number;
  balance_after: number;
  lead_id: string | null;
  lead_assignment_id: string | null;
  reference: string | null;
  description: string | null;
  metadata: Json;
  created_by_admin_id: string | null;
  created_at: string;
}

export interface LeadPricingRule {
  id: string;
  service_id: string | null;
  service_slug: string | null;
  subservice_slug: string | null;
  lead_type: LeadCommercialType;
  base_price_credits: number;
  exclusive_multiplier: number | null;
  shared_multiplier: number | null;
  min_score: number | null;
  max_score: number | null;
  active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface LeadPurchase {
  id: string;
  lead_id: string;
  professional_id: string;
  lead_assignment_id: string | null;
  price_credits: number;
  commercial_type: LeadCommercialType;
  wallet_transaction_id: string;
  refund_transaction_id: string | null;
  status: LeadPurchaseStatus;
  idempotency_key: string | null;
  purchased_at: string;
  refunded_at: string | null;
}

export interface CommercialAuditLog {
  id: string;
  actor_user_id: string | null;
  actor_professional_id: string | null;
  entity_type: "wallet" | "wallet_transaction" | "lead" | "lead_purchase" | "lead_pricing_rule";
  entity_id: string;
  action: "wallet_credit" | "wallet_debit" | "lead_purchase" | "refund" | "pricing_change" | "commercial_type_change";
  metadata: Json;
  created_at: string;
}

export interface LeadDistributionRun {
  id: string;
  lead_id: string;
  commercial_type: LeadCommercialType;
  status: LeadDistributionRunStatus;
  strategy_version: string;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface LeadDistributionCandidate {
  id: string;
  distribution_run_id: string;
  lead_id: string;
  professional_id: string;
  rank_position: number;
  ranking_score: number;
  score_breakdown: Json;
  eligibility_reason: Json;
  status: LeadDistributionCandidateStatus;
  offered_at: string | null;
  offer_expires_at: string | null;
  viewed_at: string | null;
  skipped_at: string | null;
  declined_at: string | null;
  purchased_at: string | null;
  decline_reason: string | null;
  created_at: string;
}

export interface ProfessionalDistributionSettings {
  professional_id: string;
  max_open_offers: number;
  max_active_assignments: number;
  paused: boolean;
  pause_until: string | null;
  preferred_lead_types: Json;
  auto_accept_enabled: boolean;
  created_at: string;
  updated_at: string;
}


export interface SeoLocation {
  id: string;
  slug: string;
  name: string;
  province: string;
  region_label: string | null;
  intro_facts: Json;
  local_characteristics: Json;
  nearby_city_slugs: Json;
  population_band: string | null;
  housing_notes: string | null;
  published: boolean;
  indexable: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface SeoLocalPage {
  id: string;
  service_slug: string;
  subservice_slug: string | null;
  location_id: string;
  canonical_path: string;
  local_intro: Json;
  local_sections: Json;
  faqs: Json;
  related_local_links: Json;
  related_service_links: Json;
  published: boolean;
  indexable: boolean;
  content_status: SeoContentStatus;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  reason: "consument" | "vakman" | "algemeen";
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: ContactSubmissionStatus;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      professionals: {
        Row: Professional;
        Insert: Partial<Professional> & Pick<Professional, "company_name" | "contact_name" | "email" | "phone">;
        Update: Partial<Professional>;
      };
      services: {
        Row: Service;
        Insert: Partial<Service> & Pick<Service, "name" | "slug" | "category">;
        Update: Partial<Service>;
      };
      service_questions: {
        Row: ServiceQuestion;
        Insert: Partial<ServiceQuestion> & Pick<ServiceQuestion, "service_id" | "question" | "slug" | "type">;
        Update: Partial<ServiceQuestion>;
      };
      service_question_options: {
        Row: ServiceQuestionOption;
        Insert: Partial<ServiceQuestionOption> & Pick<ServiceQuestionOption, "question_id" | "label" | "value">;
        Update: Partial<ServiceQuestionOption>;
      };
      professional_services: {
        Row: {
          id: string;
          professional_id: string;
          service_id: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          professional_id: string;
          service_id: string;
          active?: boolean;
        };
        Update: {
          active?: boolean;
        };
      };
      professional_service_areas: {
        Row: {
          id: string;
          professional_id: string;
          postal_code_prefix: string;
          created_at: string;
        };
        Insert: {
          professional_id: string;
          postal_code_prefix: string;
        };
        Update: never;
      };
      leads: {
        Row: Lead;
        Insert: Partial<Lead> &
          Pick<
            Lead,
            | "service_id"
            | "first_name"
            | "last_name"
            | "email"
            | "phone"
            | "postal_code"
            | "house_number"
            | "description"
            | "urgency"
          >;
        Update: Partial<Lead>;
      };
      lead_images: {
        Row: LeadImage;
        Insert: Omit<LeadImage, "id" | "created_at">;
        Update: never;
      };
      lead_answers: {
        Row: LeadAnswer;
        Insert: Partial<LeadAnswer> & Pick<LeadAnswer, "lead_id" | "question_id">;
        Update: never;
      };
      lead_assignments: {
        Row: LeadAssignment;
        Insert: Partial<LeadAssignment> & Pick<LeadAssignment, "lead_id" | "professional_id">;
        Update: Partial<LeadAssignment>;
      };
      lead_matches: {
        Row: LeadMatch;
        Insert: Partial<LeadMatch> & Pick<LeadMatch, "lead_id" | "professional_id" | "match_score">;
        Update: never;
      };
      analytics_events: {
        Row: AnalyticsEvent;
        Insert: Partial<AnalyticsEvent> & Pick<AnalyticsEvent, "event_name" | "anonymous_session_id">;
        Update: never;
      };
      lead_activity: {
        Row: LeadActivity;
        Insert: Partial<LeadActivity> & Pick<LeadActivity, "lead_id" | "activity_type">;
        Update: never;
      };
      professional_wallets: {
        Row: ProfessionalWallet;
        Insert: Partial<ProfessionalWallet> & Pick<ProfessionalWallet, "professional_id">;
        Update: Partial<ProfessionalWallet>;
      };
      wallet_transactions: {
        Row: WalletTransaction;
        Insert: Partial<WalletTransaction> & Pick<WalletTransaction, "wallet_id" | "professional_id" | "type" | "amount" | "balance_after">;
        Update: never;
      };
      lead_pricing_rules: {
        Row: LeadPricingRule;
        Insert: Partial<LeadPricingRule> & Pick<LeadPricingRule, "lead_type" | "base_price_credits">;
        Update: Partial<LeadPricingRule>;
      };
      lead_purchases: {
        Row: LeadPurchase;
        Insert: Partial<LeadPurchase> & Pick<LeadPurchase, "lead_id" | "professional_id" | "price_credits" | "commercial_type" | "wallet_transaction_id">;
        Update: Partial<LeadPurchase>;
      };
      commercial_audit_log: {
        Row: CommercialAuditLog;
        Insert: Partial<CommercialAuditLog> & Pick<CommercialAuditLog, "entity_type" | "entity_id" | "action">;
        Update: never;
      };
      lead_distribution_runs: {
        Row: LeadDistributionRun;
        Insert: Partial<LeadDistributionRun> & Pick<LeadDistributionRun, "lead_id" | "commercial_type">;
        Update: Partial<LeadDistributionRun>;
      };
      lead_distribution_candidates: {
        Row: LeadDistributionCandidate;
        Insert: Partial<LeadDistributionCandidate> & Pick<LeadDistributionCandidate, "distribution_run_id" | "lead_id" | "professional_id" | "rank_position" | "ranking_score">;
        Update: Partial<LeadDistributionCandidate>;
      };
      professional_distribution_settings: {
        Row: ProfessionalDistributionSettings;
        Insert: Partial<ProfessionalDistributionSettings> & Pick<ProfessionalDistributionSettings, "professional_id">;
        Update: Partial<ProfessionalDistributionSettings>;
      };
      contact_submissions: {
        Row: ContactSubmission;
        Insert: Partial<ContactSubmission> & Pick<ContactSubmission, "reason" | "name" | "email" | "message">;
        Update: Partial<ContactSubmission>;
      };
      seo_locations: {
        Row: SeoLocation;
        Insert: Partial<SeoLocation> & Pick<SeoLocation, "slug" | "name" | "province">;
        Update: Partial<SeoLocation>;
      };
      seo_local_pages: {
        Row: SeoLocalPage;
        Insert: Partial<SeoLocalPage> & Pick<SeoLocalPage, "service_slug" | "location_id" | "canonical_path">;
        Update: Partial<SeoLocalPage>;
      };
    };
  };
}
