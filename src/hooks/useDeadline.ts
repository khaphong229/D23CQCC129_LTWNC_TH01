import { useMemo } from 'react';

export interface DeadlineInfo {
  diffDays: number;
  isOverdue: boolean;
  deadlineText: string;
}

export function useDeadline(dueDate: string, isCompleted: boolean): DeadlineInfo {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isOverdue = diffDays < 0 && !isCompleted;

    let deadlineText = '';
    if (diffDays > 0) {
      deadlineText = `Còn ${diffDays} ngày`;
    } else if (diffDays === 0) {
      deadlineText = 'Hôm nay là hạn chót';
    } else {
      deadlineText = `Quá hạn ${Math.abs(diffDays)} ngày`;
    }

    return {
      diffDays,
      isOverdue,
      deadlineText,
    };
  }, [dueDate, isCompleted]);
}
