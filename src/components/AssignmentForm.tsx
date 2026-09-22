import React, { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { addAssignment } from '../features/assignments/assignmentsSlice';
import {
  type CreateAssignmentInput,
  isValidPriority,
} from '../types/assignment';

export function AssignmentForm() {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<CreateAssignmentInput>({
    subject: '',
    title: '',
    dueDate: '',
    priority: 'Trung bình',
    isCompleted: false,
  });

  const [error, setError] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.title.trim() || !formData.dueDate) {
      setError('Vui lòng điền đầy đủ thông tin bài tập');
      return;
    }

    // Type Guard kiểm tra độ ưu tiên hợp lệ
    if (!isValidPriority(formData.priority)) {
      setError('Độ ưu tiên không hợp lệ');
      return;
    }

    const newAssignment = {
      id: Date.now().toString(),
      ...formData,
    };

    dispatch(addAssignment(newAssignment));

    // Reset form
    setFormData({
      subject: '',
      title: '',
      dueDate: '',
      priority: 'Trung bình',
      isCompleted: false,
    });
    setError('');
  };

  return (
    <form className="assignment-form" onSubmit={handleSubmit}>
      <h3>Thêm bài tập mới</h3>
      {error && <p className="form-error">{error}</p>}

      <div className="form-group">
        <label>Môn học:</label>
        <input
          type="text"
          name="subject"
          placeholder="VD: Lập trình Web nâng cao"
          value={formData.subject}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Tên bài tập:</label>
        <input
          type="text"
          name="title"
          placeholder="VD: Làm bài thực hành số 1"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Hạn nộp:</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Độ ưu tiên:</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="Cao">Cao</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Thấp">Thấp</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn btn-submit">
        + Thêm bài tập
      </button>
    </form>
  );
}
