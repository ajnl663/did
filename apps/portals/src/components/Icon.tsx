import { cn } from '@/lib/utils';

const bgColors: Record<string, string> = {
  primary: 'bg-primary-50',
  success: 'bg-success-50',
  warning: 'bg-warning-50',
  danger: 'bg-danger-50',
};

const textColors: Record<string, string> = {
  primary: 'text-primary-600',
  success: 'text-success-600',
  warning: 'text-warning-600',
  danger: 'text-danger-600',
};

const borderColors: Record<string, string> = {
  primary: 'border-l-primary-500',
  success: 'border-l-success-500',
  warning: 'border-l-warning-500',
  danger: 'border-l-danger-500',
};

import {
  FileText, Users, IdCard, ScanLine, ListChecks, Settings, Home,
  ShieldCheck, ShieldX, Clock, Loader2, RefreshCw, WifiOff, Wifi,
  Check, CheckCircle2, XCircle, ChevronDown, ChevronRight, ChevronLeft,
  ArrowLeft, ArrowRight, Plus, Minus, Search, Eye, EyeOff, QrCode,
  Upload, Download, AlertTriangle, Info, Flag, LogOut, Database,
  Building2, Cpu, MemoryStick, Zap, Activity, Globe, Lock, Key,
  Trash2, Edit3, MoreVertical, Bell, Menu, TrendingUp, TrendingDown,
  Link2, Filter, Calendar, Send, Clipboard, Layers, CheckSquare,
  ExternalLink, Server, User, X, Volume2, VolumeX,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  'check-circle': CheckCircle2,
  'x-circle': XCircle,
  'clock': Clock,
  'loader': Loader2,
  'shield-x': ShieldX,
  'refresh-cw': RefreshCw,
  'wifi-off': WifiOff,
  'wifi': Wifi,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'check': Check,
  'volume-2': Volume2,
  'volume-x': VolumeX,
  'x': X,
  'user': User,
  'id-card': IdCard,
  'scan-line': ScanLine,
  'list-check': ListChecks,
  'settings': Settings,
  'home': Home,
  'shield-check': ShieldCheck,
  'file-text': FileText,
  'users': Users,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'plus': Plus,
  'minus': Minus,
  'search': Search,
  'eye': Eye,
  'eye-off': EyeOff,
  'qr-code': QrCode,
  'upload': Upload,
  'download': Download,
  'alert-triangle': AlertTriangle,
  'info': Info,
  'flag': Flag,
  'logout': LogOut,
  'database': Database,
  'building': Building2,
  'cpu': Cpu,
  'memory': MemoryStick,
  'zap': Zap,
  'activity': Activity,
  'globe': Globe,
  'lock': Lock,
  'key': Key,
  'trash': Trash2,
  'edit': Edit3,
  'more-vertical': MoreVertical,
  'bell': Bell,
  'menu': Menu,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'link': Link2,
  'filter': Filter,
  'calendar': Calendar,
  'send': Send,
  'clipboard': Clipboard,
  'layers': Layers,
  'check-square': CheckSquare,
  'external-link': ExternalLink,
  'server': Server,
};

export interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className }: IconProps) {
  const LucideIcon = iconMap[name];
  if (!LucideIcon) {
    return null;
  }
  return <LucideIcon size={size} className={cn('shrink-0', className)} />;
}
