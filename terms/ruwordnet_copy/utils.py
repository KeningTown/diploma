import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .models import Base


def get_default_session(filename=None):
    if filename is None:
        dir = os.path.join(os.path.dirname(__file__), "static")
        filename = os.path.join(dir, "ruwordnet-2021.db")
        if not os.path.exists(filename):
            filename = os.path.join(dir, "ruwordnet.db")
    if not os.path.exists(filename):
        raise FileNotFoundError(
            f"The file {filename} was not found. "
            f"Please make sure you have provided a correct database filename."
        )

    engine = create_engine(
        f"sqlite:///{filename}", connect_args={"check_same_thread": False}, echo=False
    )
    Base.metadata.create_all(engine)

    Session = sessionmaker()
    Session.configure(bind=engine)
    session = Session()
    return session
