--CREATE OR REPLACE VIEW public.vw_samples_analyses as
SELECT 
	sa.id, sa."order", sa.measurement_unit, sa.display_value, sa.value_float, sa.reference_method, sa.method_analysis_type, 
	sa.conclusion, sa.sample_id, sa.method_id, sa.analysis_group_id, sa.info_id, sa.created_at, sa.updated_at,
	ag.identification analysis_group, i2.identification analise, vsm.id id_sample_method, vsm."method",
	vsm.method_type_id, vsm.method_type, vsm.service_area_id, vsm.service_area, vsm.method_status_id, vsm.method_status,
	vsm.edition_user_id, vsm.edition_user, vsm.edition_data_time,
	vsm.start_user_id, vsm.start_user, vsm.start_data_time,
	vsm.execute_user_id, vsm.execute_user, vsm.execute_data_time,
	vsm.created_at vsm_created_at, vsm.updated_at vsm_updated_at
FROM 
	sample_analyses sa
left join analysis_groups ag 
	on sa.analysis_group_id = ag.id 
left join infos i2 
	on sa.info_id = i2.id
left join vw_samples_methods vsm 
	on sa.sample_id + sa.method_id = vsm.sample_id + vsm.method_id 
