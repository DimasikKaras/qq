from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import Equipment, Inspector
from ..schemas import EquipmentOut

router = APIRouter(prefix='/equipment', tags=['equipment'])


@router.get('/', response_model=list[EquipmentOut])
def list_equipment(_: Inspector = Depends(get_current_user), db: Session = Depends(get_db)):
    return list(db.scalars(select(Equipment).order_by(Equipment.id.asc())))
