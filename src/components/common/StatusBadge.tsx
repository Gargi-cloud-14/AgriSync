import React from 'react';
import { Badge, type BadgeVariant } from './Badge';
import { CheckCircle2, Clock, AlertTriangle, Truck, Warehouse, CheckCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  switch (normalized) {
    case 'VERIFIED':
    case 'QUALITY_VERIFIED':
      return (
        <Badge variant="emerald" icon={<CheckCircle2 className="w-3 h-3 text-emerald-600" />} className={className}>
          Verified ✓
        </Badge>
      );
    case 'IN_TRANSIT':
    case 'DISPATCHED':
      return (
        <Badge variant="blue" icon={<Truck className="w-3 h-3 text-sky-600" />} className={className}>
          In Transit
        </Badge>
      );
    case 'IN_STORAGE':
    case 'OPERATIONAL':
      return (
        <Badge variant="amber" icon={<Warehouse className="w-3 h-3 text-amber-700" />} className={className}>
          In Storage
        </Badge>
      );
    case 'HARVESTED':
    case 'STORAGE_PENDING':
    case 'REQUESTED':
      return (
        <Badge variant="stone" icon={<Clock className="w-3 h-3 text-stone-600" />} className={className}>
          Pending Allocation
        </Badge>
      );
    case 'DELIVERED':
    case 'DELIVERED_TO_BUYER':
      return (
        <Badge variant="emerald" icon={<CheckCheck className="w-3 h-3 text-emerald-600" />} className={className}>
          Delivered
        </Badge>
      );
    case 'NEAR_CAPACITY':
    case 'CAUTION':
      return (
        <Badge variant="saffron" icon={<AlertTriangle className="w-3 h-3 text-orange-600" />} className={className}>
          Capacity Caution
        </Badge>
      );
    default:
      return (
        <Badge variant="stone" className={className}>
          {status}
        </Badge>
      );
  }
};

export default StatusBadge;
