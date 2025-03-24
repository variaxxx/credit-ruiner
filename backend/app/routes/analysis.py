from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.analysis import Analysis, analysis_schema, analysis_short_schema, analysis_request_schema
from marshmallow import ValidationError
from app.models.user import User
from app.extensions import db
from datetime import datetime
import joblib
import pandas as pd

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

    errors = analysis_request_schema.validate(data)

    if errors:
        return jsonify(msg=errors), 422

    try:
        df = create_data_frame(data)

        model = joblib.load('backend/instance/model.pkl')
        loan_status = model.predict(df).tolist()[0]
        success_percentage = round(model.predict_proba(df).tolist()[0][1] * 100)

        data['user_id'] = user_id
        data['date'] = str(date)
        data['success_percentage'] = str(success_percentage)
        data['loan_status'] = str(loan_status)


        analysis_data = analysis_schema.load(data)

        analysis = Analysis(**analysis_data)

        db.session.add(analysis)
        db.session.commit()

        return jsonify(id=analysis.id, name=analysis.name, date=analysis.date, loan_status=loan_status, success_percentage=success_percentage), 200
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


def create_data_frame(data):
    pd.set_option('future.no_silent_downcasting', True)

    all_columns = ['current_loan_amount', 'annual_income', 'monthly_debt',
                   'years_of_credit_history', 'months_since_delinquent',
                   'number_of_accounts', 'number_of_problems',
                   'current_credit_balance', 'bankruptcies', 'tax_liens', 'term_LONG',
                   'term_SHORT', 'years_in_job_1',
                   'years_in_job_>10', 'years_in_job_2',
                   'years_in_job_3', 'years_in_job_4',
                   'years_in_job_5', 'years_in_job_6',
                   'years_in_job_7', 'years_in_job_8',
                   'years_in_job_9', 'years_in_job_<1',
                   'home_ownership_MORTGAGE', 'home_ownership_OWN',
                   'home_ownership_RENT', 'purpose_BUSINESS', 'purpose_HOUSE',
                   'purpose_CAR', 'purpose_DEBTCONSOLIDATION',
                   'purpose_EDUCATION', 'purpose_HOMEIMPROVEMENT',
                   'purpose_MEDICAL', 'purpose_OTHER', 'purpose_TRIP',
                   'purpose_MAJORPURCHASE', 'purpose_MOVING', 'purpose_oTHER',
                   'purpose_SMALLBUSINESS', 'purpose_VACATION', 'purpose_WEDDING']

    numeric_columns = ['current_loan_amount', 'annual_income', 'monthly_debt',
                       'years_of_credit_history', 'months_since_delinquent',
                       'number_of_accounts', 'number_of_problems',
                       'current_credit_balance', 'bankruptcies', 'tax_liens']

    renamed_columns = {
        'current_loan_amount': 'Current_Loan_Amount',
        'annual_income': 'Annual_Income',
        'Years in current job': 'Years_in_current_job',
        'Home Ownership': 'Home_Ownership',
        'monthly_debt': 'Monthly_Debt',
        'years_of_credit_history': 'Years_of_Credit_History',
        'months_since_delinquent': 'Months_since_last_delinquent',
        'number_of_accounts': 'Number_of_Open_Accounts',
        'number_of_problems': 'Number_of_Credit_Problems',
        'current_credit_balance': 'Current_Credit_Balance',
        'tax_liens': 'Tax_Liens',
        'bankruptcies': 'Bankruptcies',
        'term_LONG': 'Term_Long Term',
        'term_SHORT': 'Term_Short Term',
        'years_in_job_1': 'Years_in_current_job_1 year',
        'years_in_job_2': 'Years_in_current_job_2 years',
        'years_in_job_3': 'Years_in_current_job_3 years',
        'years_in_job_4': 'Years_in_current_job_4 years',
        'years_in_job_5': 'Years_in_current_job_5 years',
        'years_in_job_6': 'Years_in_current_job_6 years',
        'years_in_job_7': 'Years_in_current_job_7 years',
        'years_in_job_8': 'Years_in_current_job_8 years',
        'years_in_job_9': 'Years_in_current_job_9 years',
        'years_in_job_>10': 'Years_in_current_job_10+ years',
        'years_in_job_<1': 'Years_in_current_job_< 1 year',
        'home_ownership_MORTGAGE': 'Home_Ownership_Home Mortgage',
        'home_ownership_OWN': 'Home_Ownership_Own Home',
        'home_ownership_RENT': 'Home_Ownership_Rent',
        'purpose_BUSINESS': 'Purpose_Business Loan',
        'purpose_HOUSE': 'Purpose_Buy House',
        'purpose_CAR': 'Purpose_Buy a Car',
        'purpose_DEBTCONSOLIDATION': 'Purpose_Debt Consolidation',
        'purpose_EDUCATION': 'Purpose_Educational Expenses',
        'purpose_HOMEIMPROVEMENT': 'Purpose_Home Improvements',
        'purpose_MEDICAL': 'Purpose_Medical Bills',
        'purpose_OTHER': 'Purpose_Other',
        'purpose_TRIP': 'Purpose_Take a Trip',
        'purpose_MAJORPURCHASE': 'Purpose_major_purchase',
        'purpose_MOVING': 'Purpose_moving',
        'purpose_oTHER': 'Purpose_other',
        'purpose_SMALLBUSINESS': 'Purpose_small_business',
        'purpose_VACATION': 'Purpose_vacation',
        'purpose_WEDDING': 'Purpose_wedding'
    }

    data_copy = data.copy()
    data_copy.pop('name')
    for column in numeric_columns:
        data_copy.pop(column)
    df = pd.DataFrame([data_copy])
    df = pd.get_dummies(df)

    for col in all_columns:
        if col not in df.columns:
            if col in numeric_columns:
                df[col] = data[col]
            else:
                df[col] = 0

    df = df[all_columns]
    df = df.replace(True, 1).rename(columns=renamed_columns)

    return df
