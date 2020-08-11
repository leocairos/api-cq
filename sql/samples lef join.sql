--CREATE OR REPLACE VIEW public.vw_all_samples as
--CREATE OR REPLACE VIEW public.vw_30d_samples as
SELECT 	
	s.id, s.identification, s.service_center_id, s.created_at, s.updated_at, 
	s.sample_conclusion_id, control_number, "number", "year", 
	sub_number, revision, active, sync_portal, received, finalized, published, reviewed, taken_date_time, received_time, 
	finalized_time, published_time, reviewed_time, sample_reason_id, sample_type_id, sample_collection_point_id, sample_status_id, 
	current_status_user_id, current_status_edition_date_time,
	cp.identification collection_point, sc.identification sample_conclusion, sr.identification sample_reason,
	st.identification sample_type, ss.identification sample_status, mu.identification current_status_user
FROM 
	samples s 
	LEFT JOIN collection_points cp 	ON 	s.sample_collection_point_id = cp.id 
	LEFT JOIN sample_conclusions sc ON 	s.sample_conclusion_id = sc.id 
	LEFT JOIN sample_reasons sr 	ON 	s.sample_reason_id = sr.id 
	LEFT JOIN sample_types st 		ON 	s.sample_type_id = st.id 
	LEFT JOIN sample_status ss 		ON 	s.sample_status_id = ss.id
	LEFT JOIN mylims_users mu 		ON 	s.current_status_user_id = mu.id
WHERE s.current_status_edition_date_time >= now() - interval '30 day';
