import type { MembershipReponse } from "../types";
import { Card, Button, Chip, Dropdown, type Key} from '@heroui/react'
import {Ellipsis, Pencil, Trash2, Users, Clock, AlertCircle} from 'lucide-react'

const FALLBACK_IMAGE = 'https://placeholder.co/600x400/f1f5f9/94a3b8?text=Sin+imagen'

interface MembershipCardProps {
    membership: MembershipReponse
    onEdit: (membership: MembershipReponse) => void
    onDelete: (membership: MembershipReponse) => void
}



export function MembershipCard( {membership, onEdit, onDelete} : MembershipCardProps){
  const isActive = membership.status === true
  const hasActiveOffer = membership.active === true
  const hasExpiredOffer = membership.expired === true
  const isFull = membership.enrolledMembers >= membership.capacityLimit
  const isAlmostFull = !isFull && membership.enrolledMembers >= membership.capacityLimit * 0.8
  const spotsLeft = membership.capacityLimit - membership.enrolledMembers

  const handleMenuAction = (key:Key) => {
    if(key === 'edit') onEdit(membership)
    if(key === 'delete') onDelete(membership)
  }

  return (
    <Card className="overflow-hidden border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform duration-200 flex flex-col">


      <div className="relative aspect-video w-full shrink-0">
        <img
          src={membership.image || FALLBACK_IMAGE}
          alt={membership.name}
          className="w-full h-full object-cover"
          onError={(e) => {

            e.currentTarget.src = FALLBACK_IMAGE
          }}
        />


        <div className="absolute top-3 left-3">
          <Chip
            size="sm"
            className={`text-[10px] font-bold uppercase tracking-wider border-0 ${
              isActive
                ? 'bg-white/90 text-blue-600' 
                : 'bg-gray-900/70 text-white'   
            }`}
          >
            {isActive ? 'Activo' : 'Inactivo'}
          </Chip>
        </div>


        <div className="absolute top-3 right-3">
          <Dropdown>

            <Button
              size="sm"
              aria-label="Acciones de la membresía"
              className="min-w-8 w-8 h-8 p-0 bg-white/90 rounded-full shadow-sm"
            >
              <Ellipsis size={16} className="text-gray-700" />
            </Button>

            <Dropdown.Popover>
              <Dropdown.Menu
                onAction={handleMenuAction}
                className="min-w-40 bg-white border border-gray-100 shadow-xl rounded-2xl"
              >
                <Dropdown.Item id="edit" textValue="Editar">
                  <div className="flex items-center gap-2 py-0.5">
                    <Pencil size={14} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Editar</span>
                  </div>
                </Dropdown.Item>

                <Dropdown.Item id="delete" textValue="Eliminar" variant="danger">
                  <div className="flex items-center gap-2 py-0.5">
                    <Trash2 size={14} />
                    <span className="text-sm font-medium">Eliminar</span>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>


        {hasActiveOffer && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              Oferta activa
            </span>
          </div>
        )}

        {hasExpiredOffer && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-gray-500/80 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              Oferta vencida
            </span>
          </div>
        )}
      </div>



      <div className="p-5 flex flex-col gap-3 flex-1">

        {/* Nombre y duración */}
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-tight">
            {membership.name}
          </h3>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mt-0.5">
            {membership.duration} días
          </p>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
          {membership.description}
        </p>

        <div className="h-px bg-gray-100" />



        <div>
          {hasActiveOffer && membership.discountPrice !== null ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-blue-600">
                  S/ {membership.discountPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  S/ {membership.price.toFixed(2)}
                </span>
              </div>

              {membership.remainingDays !== null && (
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-orange-500" />
                  <span className="text-xs text-orange-500 font-semibold">
                    {membership.remainingDays} días restantes de oferta
                  </span>
                </div>
              )}
            </div>
          ) : (
            <span className="text-2xl font-black text-gray-900">
              S/ {membership.price.toFixed(2)}
            </span>
          )}
        </div>

        <div className="h-px bg-gray-100 mt-auto" />


        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              <span className="font-bold text-gray-800">
                {membership.enrolledMembers}
              </span>
              <span className="text-gray-400"> / {membership.capacityLimit}</span>
            </span>
          </div>

          {isFull ? (
            <div className="flex items-center gap-1">
              <AlertCircle size={12} className="text-red-500" />
              <span className="text-[11px] text-red-500 font-bold uppercase tracking-wide">
                Cupo lleno
              </span>
            </div>
          ) : isAlmostFull ? (
            <span className="text-[11px] text-amber-500 font-bold uppercase tracking-wide">
              ¡Casi lleno!
            </span>
          ) : (
            <span className="text-[11px] text-green-600 font-semibold">
              {spotsLeft} disponibles
            </span>
          )}
        </div>

      </div>
    </Card>
  )

}