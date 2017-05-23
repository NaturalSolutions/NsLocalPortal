from sqlalchemy import (
   Column,
   DateTime,
   Index,
   Integer,
   Sequence,
   String,
   func,
   Boolean
 )



engine = create_engine('PostgreSQL 9.6/NsPortal:', echo=True)



class T_User(db.Model):
    id            = db.Column(db.Integer, primary_key = True)
    firstname     = db.Column(db.String)
    familyname    = db.Column(db.String)
    login		  = db.Column(db.String)
    fk_Trole      = db.Column(db.Integer, db.ForeignKey('T_Role.id'))

class T_Role(db.Model):
    id            = db.Column(db.Integer, primary_key = True)
    nomRole       = db.Column(db.String, index = True)
