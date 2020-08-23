-- public.vw_samples_methods source

CREATE OR REPLACE VIEW public.vw_samples_methods
AS SELECT sm.id,
    sm.sample_id,
    sm.method_id,
    m.identification AS method,
    m.method_type_id,
    mt.identification AS method_type,
    sm.service_area_id,
    sa.identification AS service_area,
    sm.method_status_id,
    ms.identification AS method_status,
    sm.edition_user_id,
    mue.identification AS edition_user,
    sm.edition_data_time,
    sm.execute_user_id,
    mux.identification AS execute_user,
    sm.execute_data_time,
    sm.start_user_id,
    mus.identification AS start_user,
    sm.start_data_time,
    sm.created_at,
    sm.updated_at
   FROM sample_methods sm
     LEFT JOIN methods m ON sm.method_id = m.id
     LEFT JOIN service_areas sa ON sm.service_area_id = sa.id
     LEFT JOIN method_status ms ON sm.method_status_id = ms.id
     LEFT JOIN mylims_users mue ON sm.edition_user_id = mue.id
     LEFT JOIN mylims_users mus ON sm.start_user_id = mus.id
     LEFT JOIN mylims_users mux ON sm.execute_user_id = mux.id
     LEFT JOIN method_types mt ON m.method_type_id = mt.id;
