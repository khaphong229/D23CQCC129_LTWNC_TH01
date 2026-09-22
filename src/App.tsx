import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  fetchAssignments,
  toggleComplete,
  deleteAssignment,
} from './features/assignments/assignmentsSlice';
import { isAssignmentOverdue } from './types/assignment';
import { AssignmentForm } from './components/AssignmentForm';
import { AssignmentFilter } from './components/AssignmentFilter';
import { AssignmentCard } from './components/AssignmentCard';
import './App.css';

export default function App() {
  const dispatch = useAppDispatch();
  const { items, status, error, filter } = useAppSelector(
    (state) => state.assignments
  );

  // Khởi động app: lấy danh sách mẫu từ API giả lập My-JSON-Server
  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  const handleToggle = (id: string) => {
    dispatch(toggleComplete(id));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá bài tập này?')) {
      dispatch(deleteAssignment(id));
    }
  };

  // Logic lọc bài tập
  const filteredAssignments = items.filter((item) => {
    if (filter === 'completed') {
      return item.isCompleted;
    }
    if (filter === 'overdue') {
      return !item.isCompleted && isAssignmentOverdue(item);
    }
    if (filter === 'pending') {
      return !item.isCompleted;
    }
    return true; // 'all'
  });

  return (
    <div className="container">
      <header className="app-header">
        <h1>Student Deadline Tracker</h1>
        <p className="app-subtitle">
          Quản lý deadline bài tập cá nhân - LTWNC Bài thực hành 01
        </p>
      </header>

      <main className="main-content">
        <section className="form-section">
          <AssignmentForm />
        </section>

        <section className="list-section">
          <AssignmentFilter />

          {status === 'loading' && (
            <p className="status-msg">Đang tải dữ liệu từ API...</p>
          )}

          {status === 'failed' && (
            <p className="status-msg error-msg">Lỗi: {error}</p>
          )}

          {status === 'succeeded' && filteredAssignments.length === 0 && (
            <p className="empty-msg">Không có bài tập nào phù hợp.</p>
          )}

          <div className="assignment-list">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment}>
                <AssignmentCard.Header />
                <AssignmentCard.Body />
                <AssignmentCard.Actions
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              </AssignmentCard>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
