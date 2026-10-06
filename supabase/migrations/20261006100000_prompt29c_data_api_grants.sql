-- Data API table privileges are independent of RLS, including for BYPASSRLS.
-- Explicit object lists also remove legacy automatic exposure without granting
-- privileges on future tables. See docs/SUPABASE_BOOTSTRAP_AND_GRANTS.md.
grant usage on schema public to anon, authenticated, service_role;

revoke all on table
  public.services, public.service_questions, public.service_question_options,
  public.professionals, public.professional_services, public.professional_service_areas,
  public.leads, public.lead_answers, public.lead_images, public.lead_matches,
  public.lead_assignments, public.lead_activity, public.analytics_events,
  public.contact_submissions, public.seo_locations, public.seo_local_pages,
  public.seo_audit_log, public.professional_wallets, public.wallet_transactions,
  public.lead_purchases, public.lead_pricing_rules, public.commercial_audit_log,
  public.lead_distribution_runs, public.lead_distribution_candidates,
  public.professional_distribution_settings, public.professional_documents,
  public.professional_document_requirements, public.professional_review_feedback,
  public.professional_audit_log, public.professional_notification_events,
  public.professional_notification_preferences, public.operational_settings,
  public.operational_worker_runs, public.experiments, public.experiment_variants,
  public.experiment_assignments, public.experiment_audit_log,
  public.lead_quality_reviews, public.lead_quality_review_events, public.admin_role_audit
from public, anon, authenticated, service_role;

-- Notification read state is the only existing column-level grant.
revoke update (read_at) on public.professional_notification_events
  from public, anon, authenticated, service_role;

-- Public intake reads only. Submission, contact and analytics use the server.
grant select on public.services, public.service_questions, public.service_question_options
  to anon, authenticated;

-- Session clients: own-professional reads and INVOKER/RLS dependencies.
grant select on
  public.professionals, public.professional_services, public.professional_service_areas,
  public.professional_distribution_settings, public.professional_documents,
  public.professional_document_requirements, public.professional_review_feedback,
  public.professional_audit_log, public.lead_assignments, public.leads,
  public.lead_images, public.lead_answers, public.lead_activity,
  public.lead_distribution_candidates, public.professional_wallets,
  public.wallet_transactions, public.lead_purchases, public.lead_pricing_rules,
  public.professional_notification_events, public.professional_notification_preferences
to authenticated;

grant update on public.professionals, public.lead_assignments,
  public.lead_distribution_candidates, public.leads to authenticated;
grant insert, update on public.professional_services,
  public.professional_distribution_settings, public.professional_documents,
  public.lead_pricing_rules, public.professional_notification_preferences to authenticated;
grant insert, update, delete on public.professional_service_areas to authenticated;
grant insert on public.commercial_audit_log to authenticated;
grant update (read_at) on public.professional_notification_events to authenticated;

-- Existing professional UPDATE flows only view/decline already offered rows.
-- The ownership policy/trigger alone does not reject queued -> offered, so
-- granting UPDATE must not let a professional allocate their own queued offer.
drop policy if exists "session updates only allocated distribution offers"
  on public.lead_distribution_candidates;
create policy "session updates only allocated distribution offers"
  on public.lead_distribution_candidates as restrictive
  for update to authenticated
  using (public.is_admin() or status in ('offered', 'viewed'))
  with check (public.is_admin() or status in ('offered', 'viewed', 'declined'));

-- Retain existing admin-only session reads; their policies check current DB role.
grant select on public.operational_settings, public.operational_worker_runs,
  public.experiments, public.experiment_variants, public.experiment_assignments,
  public.experiment_audit_log, public.lead_quality_reviews,
  public.lead_quality_review_events, public.admin_role_audit to authenticated;

-- Server reporting, embedded relations, public server reads and worker reads.
-- Quality-review tables intentionally remain behind authenticated admin RPCs.
grant select on
  public.services, public.service_questions, public.service_question_options,
  public.professionals, public.professional_services, public.professional_service_areas,
  public.leads, public.lead_answers, public.lead_images, public.lead_matches,
  public.lead_assignments, public.lead_activity, public.analytics_events,
  public.contact_submissions, public.seo_locations, public.seo_local_pages,
  public.professional_wallets, public.wallet_transactions,
  public.lead_purchases, public.lead_pricing_rules, public.commercial_audit_log,
  public.lead_distribution_runs, public.lead_distribution_candidates,
  public.professional_distribution_settings, public.professional_documents,
  public.professional_document_requirements, public.professional_review_feedback,
  public.professional_audit_log, public.professional_notification_events,
  public.professional_notification_preferences, public.operational_settings,
  public.operational_worker_runs, public.experiments, public.experiment_variants,
  public.experiment_assignments, public.experiment_audit_log, public.admin_role_audit
to service_role;

-- Only existing direct server mutations; wallet/purchase writes stay RPC-only.
grant insert, update, delete on public.leads, public.professionals to service_role;
grant insert, update on public.services, public.service_questions,
  public.service_question_options, public.professional_services,
  public.analytics_events, public.contact_submissions, public.seo_locations,
  public.seo_local_pages, public.professional_distribution_settings,
  public.lead_distribution_runs, public.lead_distribution_candidates,
  public.professional_notification_events, public.operational_worker_runs,
  public.experiment_assignments to service_role;
grant insert on public.professional_service_areas, public.lead_answers,
  public.lead_images, public.lead_assignments, public.lead_activity,
  public.seo_audit_log, public.professional_review_feedback to service_role;
grant insert, delete on public.lead_matches to service_role;
grant update on public.professional_documents to service_role;

-- Helpers evaluated by policies, defaults, CHECKs and INVOKER assignment triggers.
revoke execute on function public.current_professional_id(),
  public.can_professional_view_lead_contact(uuid, uuid),
  public.generate_lead_public_reference(),
  public.analytics_metadata_is_safe(jsonb),
  public.is_valid_lead_progress_transition(public.lead_progress_status, public.lead_progress_status)
from public, anon, authenticated, service_role;
grant execute on function public.current_professional_id(),
  public.can_professional_view_lead_contact(uuid, uuid),
  public.is_valid_lead_progress_transition(public.lead_progress_status, public.lead_progress_status)
to authenticated, service_role;
grant execute on function public.generate_lead_public_reference(),
  public.analytics_metadata_is_safe(jsonb) to service_role;

-- Reassert the audited RPC boundaries, never EXECUTE TO PUBLIC.
revoke execute on function
  public.is_admin(),
  public.professional_document_storage_path_is_owned(text, uuid),
  public.professional_document_record_path_is_owned(text, uuid, uuid),
  public.transition_own_professional_onboarding(public.professional_onboarding_step, boolean),
  public.delete_own_pending_professional_document(uuid),
  public.apply_wallet_transaction(uuid, public.wallet_transaction_type, integer, uuid, uuid, text, text, jsonb),
  public.purchase_lead(uuid, text), public.refund_lead_purchase(uuid, text),
  public.get_wallet_reconciliation(uuid), public.refresh_lead_sales_state(uuid),
  public.update_assignment_quality(uuid, timestamptz, text, text, text, text, text, text),
  public.admin_lead_quality_queue(integer, text, text, uuid, text, text, boolean, text, text, integer),
  public.admin_lead_quality_detail(uuid),
  public.admin_update_lead_quality_review(uuid, timestamptz, text, text, text),
  public.claim_expired_distribution_candidates(integer),
  public.activate_lead_distribution_run(uuid, integer, integer, integer),
  public.claim_pending_notification_events(integer),
  public.claim_expired_professional_documents(integer),
  public.transition_experiment_status(uuid, text, uuid)
from public, anon, authenticated, service_role;

grant execute on function public.is_admin() to anon, authenticated, service_role;
grant execute on function
  public.professional_document_storage_path_is_owned(text, uuid),
  public.professional_document_record_path_is_owned(text, uuid, uuid),
  public.transition_own_professional_onboarding(public.professional_onboarding_step, boolean),
  public.delete_own_pending_professional_document(uuid),
  public.get_wallet_reconciliation(uuid)
to authenticated, service_role;
grant execute on function
  public.apply_wallet_transaction(uuid, public.wallet_transaction_type, integer, uuid, uuid, text, text, jsonb),
  public.purchase_lead(uuid, text), public.refund_lead_purchase(uuid, text),
  public.update_assignment_quality(uuid, timestamptz, text, text, text, text, text, text),
  public.admin_lead_quality_queue(integer, text, text, uuid, text, text, boolean, text, text, integer),
  public.admin_lead_quality_detail(uuid),
  public.admin_update_lead_quality_review(uuid, timestamptz, text, text, text)
to authenticated;
grant execute on function
  public.refresh_lead_sales_state(uuid),
  public.claim_expired_distribution_candidates(integer),
  public.activate_lead_distribution_run(uuid, integer, integer, integer),
  public.claim_pending_notification_events(integer),
  public.claim_expired_professional_documents(integer),
  public.transition_experiment_status(uuid, text, uuid)
to service_role;

-- Internal definer helpers are owner/trigger-only, also on projects with old
-- automatic function grants. Their calling RPCs retain their own authorization.
revoke execute on function
  public.append_commercial_audit_log(uuid, uuid, text, uuid, text, jsonb),
  public.ensure_professional_wallet(uuid), public.resolve_lead_price(uuid),
  public.append_professional_audit_log(uuid, uuid, public.professional_audit_event_type, jsonb),
  public.enqueue_professional_notification(uuid, public.professional_notification_event_type, jsonb),
  public.admin_lead_quality_items(integer, uuid)
from public, anon, authenticated, service_role;

-- Trigger execution does not require API callers to have direct EXECUTE.
revoke execute on function
  public.set_updated_at(), public.enforce_lead_assignment_update(),
  public.enforce_professional_self_update(), public.enforce_lead_progress_update(),
  public.prevent_wallet_transaction_mutation(), public.enforce_lead_purchase_update(),
  public.enforce_distribution_candidate_update(), public.enforce_active_offer_for_purchase(),
  public.sync_distribution_after_purchase(), public.protect_professional_document_delete(),
  public.touch_professional_verification_on_document_change(),
  public.track_professional_audit_after_change(),
  public.track_professional_document_audit_after_change(),
  public.enforce_professional_document_integrity(),
  public.notify_professional_document_rejection(), public.notify_professional_suspension(),
  public.notify_distribution_candidate_lifecycle(), public.notify_lead_assignment_created(),
  public.notify_distribution_run_exhausted(),
  public.resolve_professional_review_feedback_on_status_change(),
  public.enforce_assignment_access_immutability(), public.enforce_assignment_quality(),
  public.audit_assignment_quality(), public.guard_assignment_quality_audit(),
  public.guard_lead_quality_review_event(), public.audit_admin_role_change()
from public, anon, authenticated, service_role;

-- All business IDs are UUIDs: no sequence grants. No default grants: every
-- future migration must declare its own table/RPC privileges. Storage ownership,
-- platform ACLs, buckets, existing policies, RLS and function bodies are not changed.
