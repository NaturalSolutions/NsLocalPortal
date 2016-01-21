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

class UserDepartement(Base):
    __tablename__ = 'TUserDepartements'
    id = Column('TUDp_PK_ID', Integer, primary_key=True)
    FK_User = Column( 'TUDp_FK_TUse_ID', Integer, nullable=False)
    Fk_Departement = Column( 'TUDp_FK_TDep_ID', Integer, nullable=False)


