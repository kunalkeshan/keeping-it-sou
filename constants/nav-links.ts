import {
  ArrowRight,
  BrainCircuit,
  Cloud,
  Code2,
  FileText,
  GraduationCap,
  HeartPulse,
  LifeBuoy,
  ListChecks,
  PenTool,
  Scale,
  Shield,
  ShoppingCart,
  Smartphone,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { LinkItemType } from "@/components/layout/sheard";

export const navLinks = [
  {
    label: "Docs",
    href: "#",
  },
  {
    label: "Pricing",
    href: "#",
  },
];

export const featuresLinks: LinkItemType[] = [
  {
    label: "AI",
    href: "#",
    icon: BrainCircuit,
    description: "Advanced AI capabilities",
  },
  {
    label: "Performance",
    href: "#",
    icon: Zap,
    description: "Lightning fast performance",
  },
  {
    label: "Security",
    href: "#",
    icon: Shield,
    description: "Enterprise-grade security",
  },
  {
    label: "Backup",
    href: "#",
    icon: Cloud,
    description: "Cloud backup solutions",
  },
  {
    label: "Mobile App",
    href: "#",
    icon: Smartphone,
    description: "Dedicated mobile app",
  },
];

export const useCasesLinks: LinkItemType[] = [
  {
    label: "Healthcare",
    href: "#",
    icon: HeartPulse,
    description: "Secure patient data management",
  },
  {
    label: "Education",
    href: "#",
    icon: GraduationCap,
    description: "E-learning and virtual classrooms",
  },
  {
    label: "Finance",
    href: "#",
    icon: Wallet,
    description: "Secure financial transactions",
  },
  {
    label: "E-commerce",
    href: "#",
    icon: ShoppingCart,
    description: "Scalable online stores",
  },
  {
    label: "View more",
    href: "#",
    icon: ArrowRight,
    description: "Explore all use cases",
  },
];

export const resourcesLinks: LinkItemType[] = [
  {
    label: "API Reference",
    href: "#",
    icon: Code2,
    description: "Complete API Referencees",
  },
  {
    label: "Tutorials",
    href: "#",
    icon: GraduationCap,
    description: "Step-by-step learning resources",
  },
  {
    label: "Blog",
    href: "#",
    icon: PenTool,
    description: "Latest updates and articles",
  },
  {
    label: "Community",
    href: "#",
    icon: Users,
    description: "Join our developer community",
  },
  {
    label: "Changelog",
    href: "#",
    icon: ListChecks,
    description: "Latest product updates",
  },
  {
    label: "Support",
    href: "#",
    icon: LifeBuoy,
    description: "Get help and support",
  },
];

/**
 * Returns a Lucide icon for a legal document by title (e.g. for index cards).
 */
export function getLegalIcon(title: string): LucideIcon {
  const t = title.toLowerCase();
  if (t.includes("terms")) return Scale;
  if (t.includes("privacy")) return Shield;
  return FileText;
}
