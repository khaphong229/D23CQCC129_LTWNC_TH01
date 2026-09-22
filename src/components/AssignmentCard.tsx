import React, { createContext, useContext } from 'react';
import type { Assignment } from '../types/assignment';
import { useDeadline } from '../hooks/useDeadline';

interface AssignmentContextType {
  assignment: Assignment;
}

const AssignmentContext = createContext<AssignmentContextType | null>(null);

function useAssignmentContext() {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error('Component con phải được bọc trong <AssignmentCard>');
  }
  return context;
}

interface AssignmentCardProps {
  assignment: Assignment;
  children: React.ReactNode;
}

export function AssignmentCard({ assignment, children }: AssignmentCardProps) {
  return (
    <AssignmentContext.Provider value={{ assignment }}>
      <div
        className={`assignment-card ${
          assignment.isCompleted ? 'card-completed' : ''
        }`}
      >
        {children}
      </div>
    </AssignmentContext.Provider>
  );
}

// Sub-component 1: Header (Môn học và Độ ưu tiên)
AssignmentCard.Header = function AssignmentCardHeader() {
  const { assignment } = useAssignmentContext();
  return (
    <div className="card-header">
      <span className="card-subject">{assignment.subject}</span>
      <span className={`badge badge-${assignment.priority.toLowerCase()}`}>
        {assignment.priority}
      </span>
    </div>
  );
};

// Sub-component 2: Body (Tên bài tập, Hạn nộp và Đếm ngày qua Hook)
AssignmentCard.Body = function AssignmentCardBody() {
  const { assignment } = useAssignmentContext();
  const { deadlineText, isOverdue } = useDeadline(
    assignment.dueDate,
    assignment.isCompleted
  );

  return (
    <div className="card-body">
      <h3 className="card-title">{assignment.title}</h3>
      <div className="card-meta">
        <span>Hạn nộp: {assignment.dueDate}</span>
        <span className={`deadline-tag ${isOverdue ? 'tag-overdue' : ''}`}>
          {assignment.isCompleted ? 'Đã hoàn thành' : deadlineText}
        </span>
      </div>
    </div>
  );
};

// Sub-component 3: Actions (Các nút bấm Đánh dấu xong / Xóa)
interface ActionsProps {
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

AssignmentCard.Actions = function AssignmentCardActions({
  onToggle,
  onDelete,
}: ActionsProps) {
  const { assignment } = useAssignmentContext();

  return (
    <div className="card-actions">
      <button
        onClick={() => onToggle(assignment.id)}
        className="btn btn-toggle"
      >
        {assignment.isCompleted ? 'Bỏ hoàn thành' : 'Hoàn thành'}
      </button>
      <button
        onClick={() => onDelete(assignment.id)}
        className="btn btn-delete"
      >
        Xoá
      </button>
    </div>
  );
};
