<script setup lang="ts">
/**
 * Icon wrapper around lucide-vue-next with an explicit registry.
 *
 * Adding all icons via `import * as icons` defeats tree-shaking and bloats
 * the theme bundle to ~1MB. Instead we import only the icons we actually
 * use. When adding a new icon, add it here AND export it in `iconMap`.
 *
 * Missing names fall back to Circle so typos stay visible without crashing.
 */
import { computed } from 'vue'
import {
  Activity, AlertCircle, AlertTriangle, ArrowRight, ArrowUpRight, Award,
  BarChart3, BookA, BookOpen, Bot, Brain, Briefcase, Building2,
  Calculator, Check, CheckCircle, Circle, Clapperboard, Cloud, Coins, Compass, Copy, Crown,
  Code, DatabaseBackup, Download,
  Filter, Gamepad2, Gauge, GitBranch, GitMerge, Github, GraduationCap, Hammer, History,
  Import, Key, KeyRound, Landmark, Layers, LifeBuoy, Lightbulb, Link as LinkIcon, Lock,
  Mail, MessagesSquare, Monitor, Network,
  Package, Package2, PackagePlus, PenTool, Plug, PlugZap, Puzzle,
  Receipt, Repeat, Rewind, Rocket,
  Search, Server, Share2, Shield, ShieldCheck, Shuffle, Smartphone, Sparkles, Star,
  Terminal, Timer, TrendingUp,
  UserCheck, Users, Video, Wallet, Workflow, Zap,
} from 'lucide-vue-next'

const iconMap: Record<string, unknown> = {
  'activity': Activity,
  'alert-circle': AlertCircle,
  'alert-triangle': AlertTriangle,
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  'award': Award,
  'bar-chart-3': BarChart3,
  'book-a': BookA,
  'book-open': BookOpen,
  'bot': Bot,
  'brain': Brain,
  'briefcase': Briefcase,
  'building-2': Building2,
  'calculator': Calculator,
  'check': Check,
  'check-circle': CheckCircle,
  'circle': Circle,
  'clapperboard': Clapperboard,
  'cloud': Cloud,
  'code': Code,
  'coins': Coins,
  'compass': Compass,
  'copy': Copy,
  'crown': Crown,
  'database-backup': DatabaseBackup,
  'download': Download,
  'filter': Filter,
  'gamepad-2': Gamepad2,
  'gauge': Gauge,
  'git-branch': GitBranch,
  'git-merge': GitMerge,
  'github': Github,
  'graduation-cap': GraduationCap,
  'hammer': Hammer,
  'history': History,
  'import': Import,
  'key': Key,
  'key-round': KeyRound,
  'landmark': Landmark,
  'layers': Layers,
  'life-buoy': LifeBuoy,
  'lightbulb': Lightbulb,
  'link': LinkIcon,
  'lock': Lock,
  'mail': Mail,
  'messages-square': MessagesSquare,
  'monitor': Monitor,
  'network': Network,
  'package': Package,
  'package-2': Package2,
  'package-plus': PackagePlus,
  'pen-tool': PenTool,
  'plug': Plug,
  'plug-zap': PlugZap,
  'puzzle': Puzzle,
  'receipt': Receipt,
  'repeat': Repeat,
  'rewind': Rewind,
  'rocket': Rocket,
  'search': Search,
  'server': Server,
  'share-2': Share2,
  'shield': Shield,
  'shield-check': ShieldCheck,
  'shuffle': Shuffle,
  'smartphone': Smartphone,
  'sparkles': Sparkles,
  'star': Star,
  'terminal': Terminal,
  'timer': Timer,
  'trending-up': TrendingUp,
  'user-check': UserCheck,
  'users': Users,
  'video': Video,
  'wallet': Wallet,
  'workflow': Workflow,
  'zap': Zap,
}

interface Props {
  name: string
  size?: number | string
  strokeWidth?: number | string
  color?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  strokeWidth: 1.75,
  color: 'currentColor',
  label: '',
})

const component = computed(() => iconMap[props.name] || Circle)

const dim = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : props.size,
)
</script>

<template>
  <component
    :is="component"
    :size="size"
    :stroke-width="strokeWidth"
    :color="color"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    class="lurus-icon"
    :style="{ width: dim, height: dim }"
  />
</template>

<style scoped>
.lurus-icon {
  flex-shrink: 0;
  vertical-align: -0.125em;
}
</style>
