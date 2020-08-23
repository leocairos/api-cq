-- public.samples_methods_analyses source

CREATE OR REPLACE VIEW public.samples_methods_analyses
AS SELECT sm.id AS id_sm,
    sm.sample_id AS sample_sm,
    sm.method_id AS method_sm,
    sm.service_area_id,
    sm.method_status_id,
    sm.edition_user_id,
    sm.edition_data_time,
    sm.execute_user_id,
    sm.execute_data_time,
    sm.start_user_id,
    sm.start_data_time,
    sm.created_at AS created_at_sm,
    sm.updated_at AS updated_at_sm,
    sa.id AS id_sa,
    sa."order",
    sa.measurement_unit,
    sa.display_value,
    sa.value_float,
    sa.reference_method,
    sa.method_analysis_type,
    sa.conclusion,
    sa.sample_id AS sample_sa,
    sa.method_id AS method_sa,
    sa.analysis_group_id,
    sa.info_id,
    i.identification,
    sa.created_at AS created_at_sa,
    sa.updated_at AS updated_at_sa
   FROM sample_methods sm,
    sample_analyses sa,
    infos i
  WHERE sm.sample_id = sa.sample_id AND sm.method_id = sa.method_id AND i.id = sa.info_id;