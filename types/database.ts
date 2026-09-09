export type AppRole = "admin" | "professional";
export type ProfessionalStatus = "pending" | "active" | "paused" | "suspended";
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
export type LeadUrgency = "normal" | "urgent";
export type LeadPreferredTiming = "asap" | "few_weeks" | "one_to_three_months" | "later" | "unknown";
export type LeadAssignmentStatus = "pending" | "viewed" | "accepted" | "rejected";
export type ServiceQuestionType = "text" | "textarea" | "select" | "multiselect" | "radio" | "boolean" | "number";

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
  status: ProfessionalStatus;
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
  assigned_at: string;
  viewed_at: string | null;
  accepted_at: string | null;
  rejected_at: string | null;
  created_at: string;
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
    };
  };
}
