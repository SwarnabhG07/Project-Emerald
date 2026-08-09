import json

from .db import get_conn
from adapters import get_adapter


def run_pipeline(source_code: str):
    print(f"Starting pipeline for source: {source_code}")
    adapter = get_adapter(source_code)

    # 1. Fetch data from the adapter
    records = adapter.fetch()
    if not records:
        print("No records to process.")
        return

    conn = get_conn()
    inserted_count = 0
    skipped_count = 0

    try:
        with conn.cursor() as cur:
            # 2. Ensure the source is registered in the sources table
            cur.execute(
                """
                INSERT INTO sources (code, name, type)
                VALUES (%s, %s, 'local_json')
                ON CONFLICT (code) DO NOTHING
                """,
                (adapter.source_code, adapter.source_name),
            )

            # 3. Process each record
            for record in records:
                # Check if this exact external_id is already pending review
                cur.execute(
                    """
                    SELECT 1 FROM ingestion_queue
                    WHERE source_code = %s
                      AND external_id = %s
                      AND status = 'pending_review'
                    """,
                    (adapter.source_code, record.external_id),
                )

                if cur.fetchone():
                    skipped_count += 1
                    continue

                # Insert into ingestion queue for admin review (Section 1.3)
                cur.execute(
                    """
                    INSERT INTO ingestion_queue (
                        source_code,
                        external_id,
                        raw_data,
                        normalized_name,
                        normalized_ministry,
                        normalized_state,
                        status
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, 'pending_review')
                    """,
                    (
                        adapter.source_code,
                        record.external_id,
                        json.dumps(record.raw_json),
                        record.name,
                        record.ministry,
                        record.state,
                    ),
                )
                inserted_count += 1

        conn.commit()
        print("Pipeline finished successfully.")
        print(f"-> Inserted into queue: {inserted_count}")
        print(f"-> Skipped (already pending): {skipped_count}")

    except Exception as e:
        conn.rollback()
        print(f"Pipeline failed and rolled back: {e}")
        raise e
    finally:
        conn.close()
