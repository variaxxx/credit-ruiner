from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.analysis import Analysis, analysis_schema, analysis_short_schema
from marshmallow import ValidationError
from app.models.user import User
from app.extensions import db
from datetime import datetime

analysis_bp = Blueprint('analysis', __name__)


@analysis_bp.route('/history', methods=['GET'])
@jwt_required()
def analysis_history():
	user_id = User.query.filter_by(email=get_jwt_identity()).first().id
	history = Analysis.query.filter_by(user_id=user_id).order_by(Analysis.date).all()

	if len(history) == 0:
		return jsonify(
			count=0,
			page=1,
			pages=0,
			items=[]
		), 200

	count = min(int(request.args.get('count')), len(history))
	page = int(request.args.get('page'))
	pages = 0 if count == 0 else len(history) // count + (len(history) % count > 0)

	if not count or not page:
		return jsonify(msg="No data provided"), 422
	if not isinstance(count, int) or not isinstance(page, int):
		return jsonify(msg="Invalid parameter"), 400
	if page > pages:
		return jsonify(msg="Out of bounds"), 422

	filtered_history = []
	for h in history:
		h_dict = analysis_short_schema.dump(h)
		filtered_history.append(h_dict)

	return jsonify(
		count=count,
		page=page,
		pages=pages,
		items=filtered_history[count * (page - 1):count * page],
	), 200


@analysis_bp.route('/', methods=['POST'])
@jwt_required()
def do_analysis():
	user_email = get_jwt_identity()
	user_id = User.query.filter_by(email=user_email).first().id

	data = request.form.to_dict()

	date = datetime.now()

	# TODO: calculate result and success_percentage
	loan_status = 0
	success_percentage = 52

	data['user_id'] = user_id
	data['date'] = str(date)
	data['success_percentage'] = str(success_percentage)
	data['loan_status'] = str(loan_status)

	try:
		analysis_data = analysis_schema.load(data)

		analysis = Analysis(**analysis_data)

		db.session.add(analysis)
		db.session.commit()

		return jsonify(msg='Success'), 200
	except ValidationError as err:
		return jsonify(msg=err.messages), 400


@analysis_bp.route('/history/<id>', methods=['DELETE'])
@jwt_required()
def remove_analysis(id):
	user_email = get_jwt_identity()
	user_id = User.query.filter_by(email=user_email).first().id

	if not id:
		return jsonify(msg="No data provided"), 422

	analysis = Analysis.query.filter_by(id=id).first()
	if not analysis:
		return jsonify(msg="Analysis not found"), 404
	if analysis.user_id != user_id:
		return jsonify(msg="Access denied"), 403

	db.session.delete(analysis)
	return jsonify(msg="Success"), 200


@analysis_bp.route('/history/<id>', methods=['GET'])
@jwt_required()
def get_single_analysis(id):
	user_email = get_jwt_identity()
	user_id = User.query.filter_by(email=user_email).first().id

	analysis = Analysis.query.filter_by(id=id).first()

	if not analysis:
		return jsonify(msg="Analysis not found"), 404
	if analysis.user_id != user_id:
		return jsonify(msg="Access denied"), 403

	analysis_dict = analysis_schema.dump(analysis)
	del analysis_dict['user_id']

	return jsonify(analysis_dict), 200
