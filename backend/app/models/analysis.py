from marshmallow import fields
from marshmallow.validate import Length, OneOf, Range
from app.extensions import db, ma

purpose_values = [
  'BUSINESS',
  'CAR',
  'HOUSE',
  'DEBTCONSOLIDATION',
  'EDUCATION',
  'HOMEIMPROVEMENT',
  'MAJORPURCHASE',
  'MEDICAL',
  'MOVING',
  'TRIP',
  'VACATION',
  'WEDDING',
  'SMALLBUSINESS',
  'OTHER'
]

home_ownership_values = [
  'MORTGAGE',
  'OWN',
  'RENT'
]

years_in_job_values = [
  '<1',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '>10'
]

term_values = [
  'SHORT',
  'LONG'
]

class Analysis(db.Model):
  __tablename__ = 'analysis'

  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
  name = db.Column(db.String(80), nullable=False)
  date = db.Column(db.DateTime, nullable=False)
  current_loan_amount = db.Column(db.Integer, nullable=False)
  term = db.Column(db.String(80), nullable=False)
  years_in_job = db.Column(db.String(3), nullable=False)
  home_ownership = db.Column(db.String(80), nullable=False)
  annual_income = db.Column(db.Integer, nullable=False)
  purpose = db.Column(db.String(80), nullable=False)
  monthly_debt = db.Column(db.Float, nullable=False)
  years_of_credit_history = db.Column(db.Float, nullable=False)
  months_since_delinquent = db.Column(db.Integer, nullable=False)
  number_of_accounts = db.Column(db.Integer, nullable=False)
  number_of_problems = db.Column(db.Integer, nullable=False)
  current_credit_balance = db.Column(db.Integer, nullable=False)
  bankruptcies = db.Column(db.Integer, nullable=False)
  tax_liens = db.Column(db.Integer, nullable=False)
  loan_status = db.Column(db.Integer, nullable=False)
  success_percentage = db.Column(db.Integer, nullable=False)

class AnalysisSchema(ma.Schema):
  class Meta:
    model = Analysis
    load_instance = True
    include_fk = True

  id = fields.Int(dump_only=True)
  user_id = fields.Int(dump_only=True)
  name = fields.Str(required=True, validate=Length(min=1, max=80))
  date = fields.DateTime(required=True)
  current_loan_amount = fields.Integer(required=True, validate=Range(min=0))
  term = fields.Str(required=True, validate=OneOf(term_values))
  years_in_job = fields.Str(required=True, validate=OneOf(years_in_job_values))
  home_ownership = fields.Str(required=True, validate=OneOf(home_ownership_values))
  annual_income = fields.Integer(required=True, validate=Range(min=0))
  purpose = fields.Str(required=True, validate=OneOf(purpose_values))
  monthly_debt = fields.Float(required=True, validate=Range(min=0))
  years_of_credit_history = fields.Float(required=True, validate=Range(min=0))
  months_since_delinquent = fields.Integer(required=True, validate=Range(min=-1))
  number_of_accounts = fields.Integer(required=True, validate=Range(min=0))
  number_of_problems = fields.Integer(required=True, validate=Range(min=0))
  current_credit_balance = fields.Float(required=True, validate=Range(min=0))
  bankruptcies = fields.Integer(required=True, validate=Range(min=0))
  tax_liens = fields.Integer(required=True, validate=Range(min=0))
  loan_status = fields.Int(required=True, validate=OneOf([0, 1]))
  success_percentage = fields.Float(required=True, validate=Range(min=0.0, max=100.0))


class AnalysisShortSchema(ma.Schema):
  class Meta:
    model = Analysis
    load_instance = True

  id = fields.Int(dump_only=True)
  name = fields.Str(required=True, validate=Length(min=1, max=80))
  date = fields.DateTime(required=True)
  loan_status = fields.Int(required=True, validate=OneOf([0, 1]))
  success_percentage = fields.Int(required=True, validate=Range(min=0, max=100))


analysis_schema = AnalysisSchema()
analyses_schema = AnalysisSchema(many=True)

analysis_short_schema = AnalysisShortSchema()
analyses_short_schema = AnalysisShortSchema(many=True)