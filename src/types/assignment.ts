export type Priority = 'Cao' | 'Trung bình' | 'Thấp';

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  isCompleted: boolean;
}

// Generic
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Utility Types: Omit dùng khi tạo bài tập mới từ form (chưa có id)
export type CreateAssignmentInput = Omit<Assignment, 'id'>;

// Utility Types: Partial và Pick khi cần cập nhật 1 phần dữ liệu
export type UpdateAssignmentInput = Partial<Assignment> & Pick<Assignment, 'id'>;

// Custom Type Guard: kiểm tra giá trị có phải Priority hợp lệ không
export function isValidPriority(value: unknown): value is Priority {
  return value === 'Cao' || value === 'Trung bình' || value === 'Thấp';
}

// Type Guard: kiểm tra bài tập có bị quá hạn không
export function isAssignmentOverdue(assignment: Assignment): boolean {
  if (assignment.isCompleted) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(assignment.dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
}
