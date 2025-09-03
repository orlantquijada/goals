import type { ReactNode } from 'react';
import { Text } from 'react-native';
import { cn } from '@/lib/cn';

type PageTitleProps = {
  className?: string;
  children: ReactNode;
};

export default function PageTitle({ children, className }: PageTitleProps) {
  return (
    <Text
      className={cn('font-inter-semibold text-lg text-on-surface-1', className)}
    >
      {children}
    </Text>
  );
}
