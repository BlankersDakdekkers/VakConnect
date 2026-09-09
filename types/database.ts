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
  | "loss_reason_recorded";
export type LeadUrgency = "normal" | "urgent";
export type LeadPreferredTiming = "asap" | "few_weeks" | "one_to_three_months" | "later" | "unknown";
export type LeadAssignmentStatus = "pending" | "viewed" | "accepted" | "rejected";
export type ServiceQuestionType = "text" | "textarea" | "select" | "multiselect" | "radio" | "boolean" | "number";
export type ContactSubmissionStatus = "new" | "read" | "handled" | "spam";

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
      contact_submissions: {
        Row: ContactSubmission;
        Insert: Partial<ContactSubmission> & Pick<ContactSubmission, "reason" | "name" | "email" | "message">;
        Update: Partial<ContactSubmission>;
      };
    };
  };
}
