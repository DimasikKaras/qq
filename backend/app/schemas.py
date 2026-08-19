from datetime import date as date_type

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from .models import EquipmentStatusEnum, InspectionResultEnum, RiskLevelEnum, RoleEnum


class TokenPairResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'


class InspectorBase(BaseModel):
    full_name: str
    rank: str
    phone: str | None = None
    email: EmailStr
    role: RoleEnum = RoleEnum.inspector


class InspectorRegister(InspectorBase):
    password: str = Field(min_length=8)


class InspectorOut(InspectorBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class InspectionBase(BaseModel):
    facility_id: int
    date: date_type
    result: InspectionResultEnum
    violations: str | None = None


class InspectionCreate(InspectionBase):
    pass


class InspectionUpdate(BaseModel):
    date: date_type | None = None
    result: InspectionResultEnum | None = None
    violations: str | None = None


class InspectionOut(InspectionBase):
    id: int
    inspector_id: int

    model_config = ConfigDict(from_attributes=True)


class FacilityBase(BaseModel):
    name: str
    address: str
    risk_level: RiskLevelEnum


class FacilityCreate(FacilityBase):
    pass


class FacilityUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    risk_level: RiskLevelEnum | None = None


class FacilityOut(FacilityBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class EquipmentOut(BaseModel):
    id: int
    facility_id: int
    type: str
    status: EquipmentStatusEnum
    last_check_date: date_type

    model_config = ConfigDict(from_attributes=True)
