
from pyramid.security import NO_PERMISSION_REQUIRED
from pyramid.view import view_config
from ..Models import DBSession,Base
from pyramid.response import Response
from sqlalchemy import select,text,bindparam,and_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy import create_engine
import json
import time




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








@view_config(route_name='querymaker',renderer='json',permission=NO_PERMISSION_REQUIRED )
def getTotalQuery(request):



	q = (session.query(T_User, T_Role)
        .join(T_Role)
        .filter(T_User.Fk_Trole == T_Role.ID_Role)
        ).all()

	q = q.columns(T_User.id, T_User.firstname, T_User.familyname, T_User.login, T_Role.nomRole)


	results = request.dbsession.execute(q).fetchall()
	data = [dict(row) for row in results]
	lMin = (int(positionPage)-1)*(int(nbPerPage))
	lMax = lMin + len(results)
	request.response.headers.update({'Access-Control-Expose-Headers' : 'true'})
	request.response.headers.update({ 'Content-Range' : ''+str(lMin)+'-'+str(lMax)+'/'+str(resultsTotal['NB_ERREUR'])+''})
	request.response.headers.update({ 'Content-Max' : ''+str(resultsTotal['NB_ERREUR'])+''})
	return data