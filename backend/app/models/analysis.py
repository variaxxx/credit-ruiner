from marshmallow import fields
from marshmallow.validate import Length, OneOf, Range
from app.extensions import db, ma

class Analysis(db.Model):
  __tablename__ = 'analysis'

  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
  name = db.Column(db.String(80), nullable=False)
  date = db.Column(db.DateTime, nullable=False)
  person_age = db.Column(db.Integer, nullable=False)
  person_income = db.Column(db.Integer, nullable=False)
  person_home_ownership = db.Column(db.String(80), nullable=False)
  person_emp_length = db.Column(db.Integer, nullable=False)
  loan_intent = db.Column(db.String(80), nullable=False)
  loan_grade = db.Column(db.String(1), nullable=False)
  loan_amnt = db.Column(db.Integer, nullable=False)
  loan_int_rate = db.Column(db.Integer, nullable=False)
  loan_percent_income = db.Column(db.Integer, nullable=False)
  cb_person_default_on_file = db.Column(db.String(1), nullable=False)
  cb_person_cred_hist_length = db.Column(db.Integer, nullable=False)
  loan_status = db.Column(db.Integer, nullable=False)
  success_percentage = db.Column(db.Integer, nullable=False)


class AnalysisSchema(ma.Schema):
  class Meta:
    model = Analysis
    load_instance = True
    include_fk = True

  id = fields.Int(dump_only=True)
  user_id = fields.Int(required=True)
  name = fields.Str(required=True, validate=Length(min=3, max=80))
  date = fields.DateTime(required=True)
  person_age = fields.Int(required=True, validate=Range(min=0, max=116))
  person_income = fields.Int(required=True, validate=Range(min=0))
  person_home_ownership = fields.Str(required=True, validate=OneOf(['MORTGAGE', 'OTHER', 'OWN', 'RENT']))
  person_emp_length = fields.Int(required=True, validate=Range(min=0))
  loan_intent = fields.Str(required=True, validate=OneOf(['DEBTCONSOLIDATION', 'EDUCATION', 'HOMEIMPROVEMENT', 'MEDICAL', 'PERSONAL', 'VENTURE']))
  loan_grade = fields.Str(required=True, validate=OneOf(["A", "B", "C", "D", "E", "F", "G"]))
  loan_amnt = fields.Int(required=True, validate=Range(min=0))
  loan_int_rate = fields.Float(required=True, validate=Range(min=0.0, max=100.0))
  loan_percent_income = fields.Float(required=True, validate=Range(min=0.0))
  cb_person_default_on_file = fields.Str(required=True, validate=OneOf(["Y", "N"]))
  cb_person_cred_hist_length = fields.Int(required=True, validate=Range(min=0))
  loan_status = fields.Int(required=True, validate=OneOf([0, 1]))
  success_percentage = fields.Float(required=True, validate=Range(min=0.0, max=100.0))

class AnalysisShortSchema(ma.Schema):
  class Meta:
    model = Analysis
    load_instance = True

  id = fields.Int(dump_only=True)
  name = fields.Str(required=True, validate=Length(min=3, max=80))
  date = fields.DateTime(required=True)
  loan_status = fields.Int(required=True, validate=OneOf([0, 1]))
  success_percentage = fields.Int(required=True, validate=Range(min=0, max=100))


analysis_schema = AnalysisSchema()
analyses_schema = AnalysisSchema(many=True)

analysis_short_schema = AnalysisShortSchema()
analyses_short_schema = AnalysisShortSchema(many=True)