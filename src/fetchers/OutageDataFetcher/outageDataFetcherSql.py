fetchOutageSql = '''SELECT
    rto.id,
    rto.element_id,
    rto.shut_down_type_id,
    rto.shutdown_tag_id,
    rto.owners,
    rto.elementname,
    rto.state_name,
    rto.station_name,
    rto.unit_number,
    rto.INSTALLED_CAPACITY,
    RTO.CLASSIFICATION,
    rto.station_type,
    trunc(rto.outage_date) AS outage_date,
    coalesce(rto.outage_time, 'NA') AS outage_time,
    trunc(rto.expected_date) AS expected_date,
    rto.expected_time AS expected_time,
    rto.shut_down_type_name,
    rto.reason,
    rto.shutdown_tag
FROM
    (
        SELECT
            outages.id,
            outages.entity_id,
            outages.element_id,
            outages.elementname,
            outages.shutdown_tag_id,
            outages.outage_remarks,
            outages.revived_date,
            outages.revived_time,
            outages.outage_time,
            outages.outage_date,
            outages.expected_date,
            outages.expected_time,
            ent_master.entity_name,
            owner_details.owners,
            gu.INSTALLED_CAPACITY, 
            gu.UNIT_NUMBER,
            gs.GENERATING_STATION_NAME AS station_name,
            ssm.FULL_NAME AS state_name,
            CM.CLASSIFICATION,
            gst.NAME station_type,
            reas.reason,
            sd_type.id             AS shut_down_type_id,
            sd_type.name           AS shut_down_type_name,
            sd_tag.name            AS shutdown_tag,
            to_char(outages.outage_date, 'YYYY-MM-DD')
            || ' '
            || outages.outage_time AS out_date_time
        FROM
            reporting_web_ui_uat.real_time_outage     outages
            LEFT JOIN reporting_web_ui_uat.outage_reason        reas ON reas.id = outages.reason_id
            LEFT JOIN reporting_web_ui_uat.entity_master        ent_master ON ent_master.id = outages.entity_id
            LEFT JOIN reporting_web_ui_uat.shutdown_outage_tag  sd_tag ON sd_tag.id = outages.shutdown_tag_id
            LEFT JOIN reporting_web_ui_uat.shutdown_outage_type sd_type ON sd_type.id = outages.shut_down_type
            LEFT JOIN reporting_web_ui_uat.GENERATING_UNIT gu ON gu.ID = outages.ELEMENT_ID 
            LEFT JOIN reporting_web_ui_uat.GENERATING_STATION gs ON gs.ID = gu.FK_GENERATING_STATION 
            LEFT JOIN reporting_web_ui_uat.CLASSIFICATION_MASTER cm ON cm.ID = gs.CLASSIFICATION_ID 
            LEFT JOIN REPORTING_WEB_UI_UAT.SRLDC_STATE_MASTER SSM on SSM.id = GS.LOCATION_ID
            LEFT JOIN reporting_web_ui_uat.GENERATING_STATION_TYPE gst ON gst.ID = gs.station_type
            LEFT JOIN (SELECT
                            LISTAGG(own.owner_name, ',') WITHIN GROUP(
                            ORDER BY
                                owner_name
                            ) AS owners,
                            parent_entity_attribute_id AS element_id
                        FROM
                            reporting_web_ui_uat.entity_entity_reln ent_reln
                            LEFT JOIN reporting_web_ui_uat.owner own ON own.id = ent_reln.child_entity_attribute_id
                        WHERE
                                ent_reln.child_entity = 'Owner'
                            AND ent_reln.parent_entity = 'GENERATING_STATION'
                            AND ent_reln.child_entity_attribute = 'OwnerId'
                            AND ent_reln.parent_entity_attribute = 'Owner'
                        GROUP BY
                            parent_entity_attribute_id
                    ) owner_details ON owner_details.element_id = gu.fk_generating_station
    ) rto
    INNER JOIN (
        SELECT
            element_id,
            entity_id,
            MAX(to_char(outage_date, 'YYYY-MM-DD')
                || ' '
                || outage_time) AS out_date_time
        FROM
            reporting_web_ui_uat.real_time_outage
        where outage_date<=TO_DATE(:dateKey,'YYYY-MM-DD HH24:MI:SS')
        GROUP BY
            entity_id,
            element_id
    ) latest_out_info ON ( ( latest_out_info.entity_id = rto.entity_id )
                           AND ( latest_out_info.element_id = rto.element_id )
                           AND ( latest_out_info.out_date_time = rto.out_date_time ) )
WHERE rto.entity_name='GENERATING_UNIT' AND rto.outage_date<=TO_DATE(:dateKey,'YYYY-MM-DD HH24:MI:SS') AND (rto.revived_time IS NULL or rto.revived_date>TO_DATE(:dateKey,'YYYY-MM-DD HH24:MI:SS'))
ORDER BY
    rto.out_date_time DESC

'''


