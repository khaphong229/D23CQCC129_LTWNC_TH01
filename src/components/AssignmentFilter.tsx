import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  setFilter,
  type FilterType,
} from '../features/assignments/assignmentsSlice';

interface FilterOption {
  key: FilterType;
  label: string;
}

const filters: FilterOption[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chưa hoàn thành' },
  { key: 'overdue', label: 'Quá hạn' },
  { key: 'completed', label: 'Đã hoàn thành' },
];

export function AssignmentFilter() {
  const dispatch = useAppDispatch();
  const currentFilter = useAppSelector((state) => state.assignments.filter);

  return (
    <div className="filter-bar">
      <span>Lọc trạng thái:</span>
      <div className="filter-buttons">
        {filters.map((item) => (
          <button
            key={item.key}
            className={`btn-filter ${
              currentFilter === item.key ? 'filter-active' : ''
            }`}
            onClick={() => dispatch(setFilter(item.key))}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
