"""PostgreSQL helpers for training scripts and the ML API.

Example:
    from common.db import read_sql
    df = read_sql("SELECT * FROM export_records WHERE product = %(p)s", {"p": "Coconut oil"})
"""

import os

import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()

_engine = None


def get_engine():
    global _engine
    if _engine is None:
        url = os.environ["DATABASE_URL"]
        # SQLAlchemy needs the psycopg driver named explicitly.
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+psycopg://", 1)
        _engine = create_engine(url)
    return _engine


def read_sql(query: str, params: dict | None = None) -> pd.DataFrame:
    return pd.read_sql_query(query, get_engine(), params=params)


def write_df(df: pd.DataFrame, table: str) -> None:
    df.to_sql(table, get_engine(), if_exists="append", index=False)
