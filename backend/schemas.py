

from marshmallow import Schema, fields

class LoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)

class TeamSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    color = fields.Str()

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    role = fields.Str(required=True)
    team_id = fields.Int(allow_none=True)

class KidSchema(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    team_id = fields.Int(required=True)
    present = fields.Bool()
    lunch = fields.Bool()

class GameSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str(allow_none=True)

class ScoreSchema(Schema):
    id = fields.Int(dump_only=True)
    game_id = fields.Int(required=True)
    team_id = fields.Int(required=True)
    points = fields.Int(required=True)
    created_at = fields.DateTime(dump_only=True)

class RefereeShiftSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    game_id = fields.Int(required=True)
    shift_start = fields.DateTime(required=True)
    shift_end = fields.DateTime(required=True)