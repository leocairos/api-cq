--CREATE OR REPLACE VIEW public.vw_samples_methods as
SELECT 
	sm.id, sm.sample_id, sm.method_id, m.identification "method", m.method_type_id,
	mt.identification method_type, sm.service_area_id, sa.identification service_area,
	sm.method_status_id, ms.identification method_status, 
	sm.edition_user_id, mue.identification edition_user, sm.edition_data_time, 
	sm.execute_user_id, mux.identification execute_user, sm.execute_data_time, 
	sm.start_user_id, mus.identification start_user, sm.start_data_time, 
	sm.created_at, sm.updated_at	  
FROM 
	sample_methods sm
left join methods m 
	on sm.method_id = m.id 
left join service_areas sa 
	on sm.service_area_id = sa.id
left join method_status ms  
	on sm.method_status_id = ms.id
left join mylims_users mue 
	on sm.edition_user_id = mue.id
left join mylims_users mus 
	on sm.start_user_id = mus.id
left join mylims_users mux 
	on sm.execute_user_id = mux.id
left join method_types mt 
	on m.method_type_id = mt.id 