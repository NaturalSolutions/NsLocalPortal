from sqlalchemy import (
   Column,
   DateTime,
   Index,
   Integer,
   Sequence,
   String,
   func,
   Boolean,
   ForeignKey
 )

from sqlalchemy.ext.hybrid import hybrid_property
from ..Models import Base, dbConfig, User

db_dialect = dbConfig['dialect']

class Authorisation(Base):
    __tablename__ = 'TAutorisations'
    id = Column('TAut_PK_ID', Integer, primary_key=True)
    FK_User = Column( 'TAut_FK_TUseID', Integer,  nullable=False)
    Instance = Column( 'TAut_FK_TInsID', Integer, nullable=False)
    Role = Column( 'TAut_FK_TRolID', Integer, nullable=False)