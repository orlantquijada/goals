import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';
import { Text } from 'react-native';

type PageTitleProps = {
  className?: string;
  children: ReactNode;
};

export default function PageTitle({ children, className }: PageTitleProps) {
  return (
    <Text
      className={cn(
        'font-inter-semibold text-base text-on-surface-1',
        className
      )}
    >
      {children}
    </Text>
  );
}
