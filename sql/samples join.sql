--CREATE OR REPLACE VIEW public.vw_all_samples as
--CREATE OR REPLACE VIEW public.vw_30d_samples as
SELECT
	s.id, s.identification, s.service_center_id, s.created_at, s.updated_at,
	s.sample_conclusion_id, control_number, "number", "year",
	sub_number, revision, active, sync_portal, received, finalized, published, reviewed, taken_date_time, received_time,
	finalized_time, published_time, reviewed_time, sample_reason_id, sample_type_id, sample_collection_point_id, sample_status_id,
	current_status_user_id, current_status_edition_date_time,
	cp.identification collection_point, sc.identification sample_conclusion, sr.identification sample_reason,
	st.identification sample_type, ss.identification sample_status, mu.identification current_status_user,
	vsa.id analyse_id, vsa."order" analyse_order, vsa.info_id analyse_info_id, vsa.analise analyse_info,
	vsa.measurement_unit analyse_measurement_unit, vsa.display_value analyse_display_value,
	vsa.value_float analyse_value_float, vsa.reference_method analyse_reference_method,
	vsa.method_id analyse_method_id, vsa."method" analyse_method, vsa.method_analysis_type analyse_method_analyse_type,
	vsa.conclusion  analyse_conclusion, vsa.analysis_group_id analyse_group_id, vsa.analysis_group analyse_group,
	vsa.created_at analyse_created_at, vsa.updated_at analyse_updated_at,
	vsa.method_type_id vsa_method_type_id, vsa.method_type vsa_method_type, vsa.service_area_id vsa_service_area_id,
	vsa.service_area vsa_service_area, vsa.method_status_id vsa_method_status_id, vsa.method_status vsa_method_status,
	vsa.edition_user_id vsa_edition_user_id, vsa.edition_user vsa_edition_user, vsa.edition_data_time vsa_edition_data_time,
	vsa.start_user_id vsa_start_user_id, vsa.start_user vsa_start_user, vsa.start_data_time vsa_start_data_time,
	vsa.execute_user_id vsa_execute_user_id, vsa.execute_user vsa_execute_user, vsa.execute_data_time vsa_execute_data_time,
	vsa.vsm_created_at vsa_vsm_created_at, vsa.vsm_updated_at vsa_vsm_updated_at,
	(select si.display_value from sample_infos si where si.sample_id = s.id and si.info_id = 10163) "s.observation",
	(select si.display_value from sample_infos si where si.sample_id = s.id and si.info_id = 10131) "s.lote"
FROM
	samples s
	LEFT JOIN collection_points cp 		ON 	s.sample_collection_point_id = cp.id
	LEFT JOIN sample_conclusions sc 	ON 	s.sample_conclusion_id = sc.id
	LEFT JOIN sample_reasons sr 		ON 	s.sample_reason_id = sr.id
	LEFT JOIN sample_types st 			ON 	s.sample_type_id = st.id
	LEFT JOIN sample_status ss 			ON 	s.sample_status_id = ss.id
	LEFT JOIN mylims_users mu 			ON 	s.current_status_user_id = mu.id
	LEFT JOIN vw_samples_analyses vsa 	ON 	s.id = vsa.sample_id
WHERE s.current_status_edition_date_time >= now() - interval '30 day';
